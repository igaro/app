#!/usr/bin/env node

/* Igaro App Builder

   This script builds Igaro App taking into account different configurations by way of "recipe" files.
   Babel is used for linting, transpiling and minification.
   It also provides services such as watchers and httpd.

   Written by Andrew Charnley, igaro.com

   --watch -> Watches files and rebuilts upon modification.
   --serve=<portNum> -> provides a http service on a port of your chosing.
   --recipe=<name> -> the recipe file which provides the config to use for the build. Don't supply if you want a list.
*/

"use strict";

// node version check
const nodeVersion = process.version.slice(1).split('.');
if (nodeVersion[0] < 16 && nodeVersion[1] < 0) {
  throw new Error("NodeJS 16.0+ is required to run this script. The current version is "+nodeVersion.join('.'));
}

// main vars
const args = require("yargs").argv,
  recipe = args.recipe,
  fs = require("fs"),
  fsP = fs.promises,
  sass = require("sass"),
  watch = require("watch"),
  path = require('path'),
  po2json = require("po2json"),
  jsTransform = require("@babel/core").transform;

// get recipes
const recipes = fs.readdirSync("src/recipes")
  .filter(recipe => recipe.slice(-5) === '.json')
  .map(recipe => recipe.slice(0,-5));

// check recipe supplied
if (! recipe) {
  throw new Error("Arg --recipe not provided. Valid recipes are: "+recipes.join(", "));
}

// check recipe valid
if (recipes.indexOf(recipe) === -1) {
  throw new Error("Arg --recipe invalid. Valid recipes are: "+recipes.join(", "));
}

// process recipe
const recipeConf = require(__dirname + "/src/recipes/"+recipe+".json"),
  watchEnabled = !! args.watch,
  servePort = args.serve || recipeConf.serve,
  recipeBabel = recipeConf.babel;

// folders
const srcRootDir = __dirname + '/src',
  srcSassDir = srcRootDir  + '/sass/scss',
  srcAppDir = srcRootDir  + '/app',
  srcCpDir = srcRootDir  + '/cp',
  srcTranslationsDir = srcRootDir + '/translations',
  targetRootDir = __dirname + '/target/'+recipe,
  targetCssDir = targetRootDir + '/cdn/css';

// regexps
const includeRegExp = /\@\@include\((.*?)\)/g,
  varRegExp = /\@\@var\((.*?)\)/g,
  trRegExp = () => { return /\.tr\(\(\(\s?\{(.*?)\}\s?\)\)/g; };

// pkg meta (useful for version number)
const packageMeta = require(__dirname + "/package.json");

/* HELPERS ------------------------------------------------------------ */

const walkFiles = async (pathname, filter, dirent) => {

  // impersonate a readdir entry for the root folder
  if (!dirent) {
    const filename = path.basename(path.resolve(pathname));
    dirent = await fsP.lstat(pathname);
    dirent.name = filename;
  }
  // doesn't follow symbolic links (doing so could cause infinite loops)
  if (!dirent.isDirectory()) {
    return [];
  }
  const result = await fsP.readdir(pathname, { withFileTypes: true });
  const files = [];
  for (let entity of result) {
    const filename = path.join(pathname, entity.name);
    if (!entity.isDirectory() && filter(filename)) {
      files.push(filename);
    }
    files.push(...await walkFiles(filename, filter, entity));
  }
  return files;
}

const padNumber = (n) => n<10? "0"+n : n;

const pullTrData = (str) => {
  str = "(function() { return " + str.slice(6,-2) + "; })()";
  try {
    var obj = eval(str);
    return obj;
  } catch(e) {
    throw "Translation failure ("+e+ ") at: "+str;
  }
};

const makePotHeader = () => {
  const now = new Date(), //2016-01-01 00:00+0000
    str = now.getUTCFullYear() +'-'+padNumber(now.getUTCMonth())+'-'+padNumber(now.getUTCDate())+' '+padNumber(now.getUTCHours())+':'+padNumber(now.getUTCMinutes())+'+0000';
  return '"POT-Creation-Date: ' + str + '\\n"';
};

const poSanitise = (str) => str
  .replace(/\n/g,"\\n")
  .replace(/\"/g,"\\\"");

const potMakeSection = (key, data) => {
  let a = "\n";
  data
    .map((x) => {
      if (x[2].comment)
        a+= "\n#." + poSanitise(x[2].comment);
      if (x[2].format)
        a+= "\n#," + poSanitise(x[2].format);
    });
  a += "\n#: " + data
    .map((x) => x[0]+":"+x[1])
    .join(" ");
  data
    .map((x) => {
      if (x[2].context)
          a += "\nmsgctxt \"" + poSanitise(x[2].context) + "\"";
    });
  a += "\nmsgid \"" + poSanitise(key) + "\"";
  let pluralData = data.find(x => x[2].plural);
  if (pluralData) {
    a += "\nmsgid_plural \""+ poSanitise(pluralData[2].plural) + "\"";
    a += "\nmsgstr[0] \"\"";
    a += "\nmsgstr[1] \"\"";
  } else {
    a += "\nmsgstr \"\"";
  }
  return a;
};

const readdir = async (dir, filter) => {

  let files = await fsP.readdir(dir);
  if (filter) {
    files = files
      .filter(file => file.slice(-1 - filter.length) === '.'+filter);
  }
  return files;
};

const readfile = async file => (await fsP.readFile(file)).toString();

const writefile = async (file, data) => {

  await fsP.mkdir(file.substr(0,file.lastIndexOf('/')), { recursive: true });
  await fsP.writeFile(file, data);
};

const embedVars = data => {

  recipeConf.buildTs = new Date().getTime();
  recipeConf.version = packageMeta.version || 0;
  return data.replace(varRegExp, match => {
    const name = match.slice(7,-2),
      value = recipeConf[name];
    if (! value)
      throw new Error("Entry missing from recipe: "+name);
    return value;
  });
};

const consoleColor = (txt, code) => console.info('\x1b['+code+'m',txt,'\x1b[0m');
const consoleInfo = txt => consoleColor(txt, 32);
const consoleError = txt => consoleColor(txt,31);
const consoleWarn = txt => consoleColor(txt,33);

const fileExtMatch = (file, ext) => file.slice(-1 - ext.length) === '.' + ext;

/* HTTPD -------------------------------------------------------------- */

const httpd = () => {

  const express = require('express'),
    app = express();
  app.listen(servePort, () => consoleInfo('Httpd:'+servePort));
  app.use('/res', express.static(targetRootDir + '/res'));
  app.use('/cdn', express.static(targetRootDir + '/cdn'));
  app.get(['/res/*', '/cdn/*'], (request, response) => {
      response.status(404).send('Resource not found.');
  });
  app.use('/', (req, res) => {
    const url = req.url.split('?')[0];
    res.sendFile(targetRootDir + (url.includes('.') && url.lastIndexOf('/') === 0? url : '/index.html'), null, err => {
      if (err) {
        console.log(err);
        res.status(err.status || 200).end();
      }
    });
  });
};

/* WATCHER ------------------------------------------------------------ */

const watchers = () => {

  const ignore = recipeConf.watch.ignore;
  [
    ['SASS',srcSassDir + '/..' ,'sass'],
    ['APP',srcAppDir,'app'],
    ['BUILTIN',srcRootDir+'/builtin','app'],
    ['CONF',srcRootDir+'/conf','app'],
    ['TRANSLATIONS',srcTranslationsDir,'app'],
    ['CP',srcCpDir,'cp']
  ].forEach(([name, root, runner]) => {
    const watchNow = (refresh) => watch.watchTree(root, {
      ignoreDotFiles:true,
      filter: file => ignore.every(ext => file.slice(-1 - ext.length) !== '.'+ext)
    }, async (f, curr, prev) => {
      if (typeof f === "object" && prev === null && curr === null) {
        consoleInfo((refresh? "Rewatching:" : "Watching:")+name);
      } else {
        try {
          await build[runner](f, !curr.nlink);
        } catch (e) {
          consoleError(e);
        }
        if (!curr.nlink) {
          watch.unwatchTree(root);
          watchNow();
        }
      }
    });
    watchNow();
  });
};

/* BUILD -------------------------------------------------------------- */

const build = {

  app : async (f, curr, prev) => {

    const start = process.hrtime();
    consoleWarn("Building:APP...");
    let files = await walkFiles(srcAppDir, file => fileExtMatch(file, 'js') || fileExtMatch(file, 'html'));
    files = await Promise.all(files
      .map(file => readfile(file)
        .then(data => ({ name:file, data:data, isHTML:fileExtMatch(file, 'html') }))));

    // includes
    const cache = {};
    const scanInc = async data => {

      // match pass
      let matches = data.match(includeRegExp);
      if (! (matches instanceof Array)) {
        return data;
      }

      // cache files
      await Promise.all(matches
        .map(match => match.slice(11,-2))
        .map(match => readfile(srcRootDir + '/' + match)
          .then(data => cache[match] = data)))
      // replace pass
      return scanInc(data.replace(includeRegExp, match => cache[match.slice(11,-2)] ));
    };

    // scan and include
    files = await Promise.all(files
      .map(async file => {
        file.data = await scanInc(file.data);
        return file;
      }));

    // embed variables
    files = files
      .map(file => {
        file.data = embedVars(file.data);
        return file;
      });

    // translation work...

    // don't scan 3rd party or core files
    const scanable = files
      .filter(file => {
        const name = file.name.slice(srcRootDir.length+12);
        return ! /^(3rdparty|core|polyfill)\..+$/.test(name);
    });

    // extract data
    const pot = {};
    scanable
      .forEach(file => {
        const lines = file.data.split("\n");
        lines
          .forEach(line => {
            const re = trRegExp();
            let match;
            while ((match = re.exec(line)) !== null) {
              const obj = pullTrData(match[0]),
                key = obj.key;
              if (! pot[key])
                pot[key] = [];
              // store source and comment information
              pot[key].push([file.name,re.lastIndex,obj]);
            }})
      });

    const lang = {};
    await Promise.all([
      // read .po file data
      readdir(srcTranslationsDir,'po')
        .then(pofiles => Promise.all(
            pofiles
              .map(file => {
                const name = file.slice(0,-3).replace('_','-');
                return new Promise((resolve,reject) => {
                  po2json.parseFile(srcTranslationsDir+'/'+file, { }, (err, data) => {
                    Object.keys(data).forEach(key => {
                      if (! key.length)
                          return;
                      if (! lang[key])
                          lang[key] = {};
                      lang[key][name] = data[key];
                    });
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                  });
                });
            }))),

      // write .pot
      writefile(srcTranslationsDir +'/messages.pot',
        Object.keys(pot)
          .reduce((a,b) => {
            const data = pot[b];
            if (data.some(x => !! x[2].context)) {
              data
                .forEach(x => {
                  if (! x[2].context)
                      x[2].context = {};
                  a += potMakeSection(b,[x]);
                });
            } else {
                a += potMakeSection(b,data);
            }
            return a;
        }, makePotHeader()))
    ]);

    // embed translation data
    const re = trRegExp();
    scanable
      .forEach((file) => {
        file.data = file.data.replace(re, match => {
          const obj = pullTrData(match),
            key = obj.context? obj.context + String.fromCharCode(4) + obj.key : obj.key,
            dict = lang[key];
          if (dict) {
            obj.dict = dict;
            return ".tr(" + JSON.stringify(obj);
          }
          return match;
        });
    });

    // run through babel for transpiling plus plugins like minification, FlowJS and linting.
    // add config options (the stuff that typically goes in .babelrc) to recipe.babel.config from here: https://babeljs.io/docs/core-packages/
    if (recipeBabel.enabled) {
      const conf = recipeBabel.config;
      files
        .forEach(file => {
          if (file.isHTML) {
            return;
          }
          try {
            file.data = jsTransform(file.data, conf).code;
          } catch (error) {
            throw {
              file: file.name,
              error
            };
          }
        });
    }

    // write files
    await Promise.all(files
      .map(file => writefile(targetRootDir + file.name.slice(srcAppDir.length),file.data)));

    consoleInfo("Built:APP ("+ process.hrtime(start)[0]+'.'+(process.hrtime(start)[1] / 1000000).toFixed(0) + "s)");
  },

  cp : async (f, deleted) => {

    const start = process.hrtime();
    consoleWarn("Building:CP...");
    if (f && deleted) {
      await fsP.rm(targetRootDir + '/' + f.substr(srcCpDir.length), { recursive: true, force: true });
    }
    await fsP.mkdir(targetRootDir, { recursive: true });
    await fsP.cp(srcCpDir, targetRootDir, { recursive: true });

    consoleInfo("Built:CP" + (f? ':'+f + (deleted? ' (deleted)' : '') : '') + " ("+ process.hrtime(start)[0]+'.'+(process.hrtime(start)[1] / 1000000).toFixed(0) + "s)");
    process.hrtime();
  },

  sass : async () => {

    const start = process.hrtime();
    consoleWarn("Building:SASS...");
    await fsP.mkdir(targetCssDir, { recursive: true });
    const files = await readdir(srcSassDir,'scss');
    await Promise.all(files
      .map((file) => new Promise((resolve,reject) => {
        sass.render({
          file: srcSassDir + '/' + file,
          includePaths : [srcSassDir],
          outputStyle : recipeConf.css.minify? 'compressed' : 'expanded'
        }, async (err, result) => {
          if (err) {
            return reject(err);
          }
          await writefile(targetCssDir + '/' + file.slice(0,-5)+'.css', result.css);
          resolve();
        });
      })));
    consoleInfo("Built:SASS ("+ process.hrtime(start)[0]+'.'+(process.hrtime(start)[1] / 1000000).toFixed(0) + "s)");
    process.hrtime();
  }
};

// build
console.info("");
console.info("** Igaro App Builder **");
console.info("");
Promise.resolve()
  .then(async () => {
    await fsP.rm(targetRootDir, { recursive: true, force: true });
    await fsP.mkdir(targetRootDir, { recursive: true });
    await Promise.all(Object.keys(build)
      .map(action => build[action]()));

    console.info("");
    consoleInfo("Ready: "+ targetRootDir);

    const isHttpd = typeof servePort === 'number';

    if (! isHttpd && ! watchEnabled) {
      return;
    }

    console.info("");
    console.info("Launching...");
    console.info("");

    // http service?
    if (isHttpd) {
      httpd();
    }

    // watch and rebuild?
    if (watchEnabled) {
      watchers();
    }

    // yuk
    setTimeout(() => {
      console.info("");
      console.info("Waiting...");
      console.info("");
    }, 2000);

  }).catch(e => consoleError(e));
