#!/usr/bin/env node

/* Igaro App Builder

   This script builds Igaro App taking into account different configurations by way of "recipe" files.
   It's like Gulp, but on steroids!
   It also provides services such as watchers and httpd.

   Written by Andrew Charnley, igaro.com

   --watch -> Watches files and rebuilts upon modification.
   --serve=<portNum> -> provides a http service on a port of your chosing.
   --recipe=<name> -> the recipe file which provides the config to use for the build. Don't supply if you want a list.
*/

"use strict";

// node version check
var nodeVersion = process.version.slice(1).split('.');
if (nodeVersion[0] < 5 && nodeVersion[1] < 8)
    throw new Error("NodeJS 5.8+ is required to run this script. The current version is "+nodeVersion.join('.'));

// main vars
var args = require("yargs").argv,
    recipe = args.recipe,
    fs = require("fs-extra"),
    sass = require("node-sass"),
    sassXtra = require("node-sass-asset-functions"),
    watch = require("watch"),
    uglify = require("uglify-js"),
    po2json = require("po2json"),
    linter = require("eslint").linter;

// get recipes
var recipes = fs.readdirSync("src/recipes").filter(function(recipe) {
    return recipe.slice(-5) === '.json';
}).map(function(recipe) {
    return recipe.slice(0,-5);
});

// check recipe supplied
if (! recipe)
    throw new Error("Arg --recipe not provided. Valid recipes are: "+recipes.join(", "));

// check recipe valid
if (recipes.indexOf(recipe) === -1)
    throw new Error("Arg --recipe invalid. Valid recipes are: "+recipes.join(", "));

// process recipe
var recipeConf = require(__dirname + "/src/recipes/"+recipe+".json"),
    minifyEnabled = !! args.minify,
    watchEnabled = !! args.watch,
    servePort = args.serve || recipeConf.serve;

// folders
var srcRootDir = __dirname + '/src',
    srcSassDir = srcRootDir  + '/sass/scss',
    srcAppDir = srcRootDir  + '/app',
    srcCpDir = srcRootDir  + '/cp',
    srcTranslationsDir = srcRootDir + '/translations',
    targetRootDir = __dirname + '/target/'+recipe,
    targetCssDir = targetRootDir + '/cdn/css';

// regexps
var includeRegExp = /\@\@include\((.*?)\)/g,
    varRegExp = /\@\@var\((.*?)\)/g,
    trRegExp = function() { return /\.tr\(\(\(\{(.*?)\}\)\)/g; };

/* HELPERS ------------------------------------------------------------ */

var padNumber = function(n) {

    return n<10? "0"+n : n;
};

var pullTrData = function(str) {

    str = "(function() { return " + str.slice(6,-2) + "; })()";
    try {
        var obj = eval(str);
        return obj;
    } catch(e) {
        throw "Translation failure ("+e+ ") at: "+str;
    }
};

var makePotHeader = function() {

    var now = new Date(), //2016-01-01 00:00+0000
        str = now.getUTCFullYear() +'-'+padNumber(now.getUTCMonth())+'-'+padNumber(now.getUTCDate())+' '+padNumber(now.getUTCHours())+':'+padNumber(now.getUTCMinutes())+'+0000';
    return 'msgid ""\n\
msgstr ""\n\
"Project-Id-Version: PACKAGE VERSION"\n\
"Language-Team: LANGUAGE <LL@li.org>"\n\
"Report-Msgid-Bugs-To:"\n\
"PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE"\n\
"Language:"\n\
"MIME-Version: 1.0"\n\
"Content-Type: text/plain; charset=utf-8"\n\
"Content-Transfer-Encoding: 8bit"\n\
"POT-Creation-Date: ' + str + '"';
};

var poSanitise = function(str) {

    return str
        .replace(/\n/g,"\\n")
        .replace(/\"/g,"\\\"");
};

var potMakeSection = function(key,data) {

    var a = "\n";
    data.map(function(x) {

        if (x[2].comment)
            a+= "\n#." + poSanitise(x[2].comment);
        if (x[2].format)
            a+= "\n#," + poSanitise(x[2].format);
    });
    a += "\n#: " + data.map(function(x) {

        return x[0]+":"+x[1];
    }).join(" ");
    data.map(function(x) {
        if (x[2].context)
            a += "\nmsgctxt \"" + poSanitise(x[2].context) + "\"";
    });
    a += "\nmsgid \"" + poSanitise(key) + "\"";
    var pluralData = data.find(function(x) {

        return x[2].plural;
    });
    if (pluralData) {
        a += "\nmsgid_plural \""+ poSanitise(pluralData[2].plural) + "\"";
        a += "\nmsgstr[0] \"\"";
        a += "\nmsgstr[1] \"\"";
    } else {
        a += "\nmsgstr \"\"";
    }

    return a;
};

var mkdir = function(dir) {

    return new Promise(function(resolve,reject) {

        fs.mkdirs(dir, function(err) {

            if (err) {
                reject(err);
            } else {
                 resolve();
            }
        });
    });
};

var readdir = function(dir,filter) {

    return new Promise(function(resolve,reject) {

        fs.readdir(dir,function(err,files) {
            if (filter) {
                files = files.filter(function(file) {

                    return file.slice(-1 - filter.length) === '.'+filter;
                });
            }
            if (err) {
                reject(err);
            } else {
                 resolve(files);
            }
        });
    });
};

var readfile = function(file) {

    return new Promise(function(resolve,reject) {

        fs.readFile(file,function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.toString('utf8'));
            }
        });
    });
};

var writefile = function(file,data) {

    return mkdir(file.substr(0,file.lastIndexOf('/'))).then(function() {

        return new Promise(function(resolve,reject) {

            fs.writeFile(file,data,function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
};

var consoleColor = function(txt,code) {

    console.info('\x1b['+code+'m',txt,'\x1b[0m');
};

var consoleInfo = function(txt) {

    consoleColor(txt,32);
};

var consoleError = function(txt) {

    consoleColor(txt,31);
};

var consoleWarn = function(txt) {

    consoleColor(txt,33);
};

/* HTTPD -------------------------------------------------------------- */

var httpd = function() {

    var express = require('express');
    var app = express();
    app.listen(servePort, function () {

        consoleInfo('Httpd:'+servePort);
    });
    app.use(express.static(targetRootDir));
};

/* WATCHER ------------------------------------------------------------ */

var watchers = function() {

    var ignore = recipeConf.watch.ignore;
    [
        ['SASS',srcSassDir + '/..' ,'sass'],
        ['APP',srcAppDir,'app'],
        ['BUILTIN',srcRootDir+'/builtin','app'],
        ['CONF',srcRootDir+'/conf','app'],
        ['TRANSLATIONS',srcTranslationsDir,'app'],
        ['CP',srcCpDir,'cp']
    ].forEach(function(o) {

        watch.watchTree(o[1], {
            ignoreDotFiles:true,
            filter:function(file) {
                return ignore.every(function(ext) {

                    return file.slice(-1 - ext.length) !== '.'+ext;
                });
            }
        }, function (f,curr,prev) {

            if (typeof f === "object" && prev === null && curr === null) {
                consoleInfo("Watching:"+o[0]);
                return; // finished walking tree
            }

            Promise.resolve().then(function() {

                return build[o[2]](f, curr && curr.nlink === 0);
            }).catch(function(e) {

                consoleError(e);
            });
        });
    });
};

/* BUILD -------------------------------------------------------------- */

var build = {

    app : function() {

        var start = process.hrtime();
        consoleWarn("Building:APP...");
        return new Promise(function(resolve,reject) {

            // walk tree
            var files = [];
            fs.walk(srcAppDir)
              .on('data', function(file) {

                files.push(file.path);
              })
              .on('end', function() {

                resolve(files);
              })
              .on('error', function(err) {

                reject(err);
              });
        }).then(function(files) {

            // read only js and html
            return Promise.all(
                files.filter(function(file) {

                    return file.slice(-3) === '.js' || file.slice(-5) === '.html';
                }).map(function(file) {

                    // read file
                    return readfile(file).then(function(data) {

                        return { name:file, data:data };
                    });
                })
            );

        }).then(function(files) {

            // includes
            var cache = {};
            var scanInc = function(data) {

                // match pass
                var matches = data.match(includeRegExp);
                if (! (matches instanceof Array))
                    return Promise.resolve(data);

                // cache files
                return Promise.all(

                    matches.map(function(match) {

                        var file = match.slice(11,-2);
                        return readfile(srcRootDir + '/' + file).then(function(data) {

                            cache[file] = data;
                        });
                    })

                // replace pass
                ).then(function() {

                    return scanInc(data.replace(includeRegExp, function(match) {

                        return cache[match.slice(11,-2)];
                    }));
                });
            };

            return Promise.all(files.map(function(file) {

                return scanInc(file.data).then(function(data) {

                    file.data = data;
                    return file;
                });
            }));

        }).then(function(files) {

            // embed vars
            recipeConf.buildTs = new Date().getTime();

            files.forEach(function(file) {

                file.data = file.data.replace(varRegExp, function(match) {

                    var name = match.slice(7,-2),
                        value = recipeConf[name];
                    if (! value)
                        throw new Error("Entry missing from recipe: "+name);
                    return value;
                });
            });

            return files;

        }).then(function(files) {

            // only scan route and instance files
            var scanable = files.filter(function(file) {

                var name = file.name.slice(srcRootDir.length+12);
                return name.slice(0,6) === 'route.' || name.slice(0,9) === 'instance.';
            });

            // extract data
            var pot = {};
            scanable.forEach(function(file) {

                var lines = file.data.split("\n");
                lines.forEach(function(line) {

                    var re = trRegExp(),
                        match;
                    while ((match = re.exec(line)) !== null) {
                        var obj = pullTrData(match[0]),
                            key = obj.key;
                        if (! pot[key])
                            pot[key] = [];
                        // store source and comment information
                        pot[key].push([file.name,re.lastIndex,obj]);
                    }
                });
            });


            var lang = {};
            return Promise.all([

                // read .po file data
                readdir(srcTranslationsDir,'po').then(function(pofiles) {

                    return Promise.all(
                        pofiles.map(function(file) {

                            var name = file.slice(0,-3).replace('_','-');
                            return new Promise(function(resolve,reject) {

                                po2json.parseFile(srcTranslationsDir+'/'+file,{ },function(err,data) {

                                    Object.keys(data).forEach(function(key) {

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
                        })
                    );
                }),

                // write .pot
                writefile(srcTranslationsDir +'/messages.pot',
                    Object.keys(pot).reduce(function(a,b) {

                        var data = pot[b];
                        if (data.some(function(x) {

                            return !! x[2].context;
                        })) {
                            data.forEach(function(x) {

                                if (! x[2].context)
                                    x[2].context = {};
                                a += potMakeSection(b,[x]);
                            });
                        } else {
                            a += potMakeSection(b,data);
                        }
                        return a;

                    }, makePotHeader())
                )

            ]).then(function() {

                // embed translation data
                var re = trRegExp();
                scanable.forEach(function(file) {

                    file.data = file.data.replace(re,function(match) {

                        var obj = pullTrData(match),
                            key = obj.context? obj.context + String.fromCharCode(4) + obj.key : obj.key,
                            dict = lang[key];
                        if (dict) {
                            obj.dict = dict;
                            return ".tr(" + JSON.stringify(obj);
                        }
                        return match;
                    });
                });

                return files;
            });

        }).then(function(files) {

            // lint
            if (recipeConf.esLint.enabled) {
                files.forEach(function(file) {

                    linter.verify(file.data, recipeConf.esLint.rules).forEach(function(message) {

                        message.fileName = file.name;
                        if (message.fatal) {
                            consoleError(message);
                            throw null;
                        }
                        consoleWarn(message);
                    });
                });
            }
            return files;

        }).then(function(files) {

            // minify
            if (minifyEnabled) {
                var conf = recipeConf.uglify,
                    origSize = 0,
                    nowSize = 0;
                files.forEach(function(file) {

                    origSize += file.data.length;
                    file.data = uglify.minify(file.data, conf).code;
                    nowSize += file.data.length;
                });
                consoleInfo("JavaScript Minified ("+ ((nowSize/origSize)*100).toFixed(1) + "%)");
            }
            return files;

        }).then(function(files) {

            // write files
            return Promise.all(files.map(function(file) {

                return writefile(targetRootDir + file.name.slice(srcAppDir.length),file.data);
            }));

        }).then(function() {

            consoleInfo("Built:APP ("+ process.hrtime(start)[0]+'.'+(process.hrtime(start)[1] / 1000000).toFixed(0) + "s)");
        });
    },

    cp : function(f,deleted) {

        var start = process.hrtime();
        consoleWarn("Building:CP...");
        return Promise.resolve().then(function() {

            if (f) {
                return new Promise(function(resolve,reject) {

                    var target = targetRootDir + '/' + f.substr(srcCpDir.length);
                    if (deleted) {
                        return fs.remove(target, function(err) {

                            if (err)
                                return reject(err);
                            resolve();
                        });
                    }

                    fs.copy(f, target, { clobber:true }, function(err) {

                        if (err)
                            return reject(err);
                        resolve();
                    });
                });
            }

            return mkdir(targetRootDir).then(function() {

                return new Promise(function(resolve,reject) {

                    fs.copy(srcCpDir, targetRootDir, function(err) {
                        if (err)
                            return reject(err);
                        resolve();
                    });
                });
            });
        }).then(function() {

            consoleInfo("Built:CP" + (f? ':'+f + (deleted? ' (deleted)' : '') : '') + " ("+ process.hrtime(start)[0]+'.'+(process.hrtime(start)[1] / 1000000).toFixed(0) + "s)");
            process.hrtime();
        });
    },

    sass : function() {

        var start = process.hrtime();
        consoleWarn("Building:SASS...");
        return mkdir(targetCssDir).then(function() {

            return readdir(srcSassDir,'scss').then(function(files) {

                return Promise.all(
                    files.map(function(file) {

                        return new Promise(function(resolve,reject) {

                            sass.render({
                                functions: sassXtra({

                                    images_path: 'src/sass/images/',
                                    fonts_path: 'src/sass/fonts/'
                                }),
                                file: srcSassDir + '/' + file,
                                includePaths : [srcSassDir],
                                outputStyle : minifyEnabled? 'compressed' : 'nested'
                            }, function(err, result) {

                                if (err)
                                    return reject(err);

                                fs.writeFile(targetCssDir + '/' + file.slice(0,-5)+'.css', result.css, function(err){

                                    if (err)
                                        return reject(err);
                                    resolve();
                                });
                            });
                        });
                    })
                );
            });
        }).then(function() {

            consoleInfo("Built:SASS ("+ process.hrtime(start)[0]+'.'+(process.hrtime(start)[1] / 1000000).toFixed(0) + "s)");
            process.hrtime();
        });
    }
};

// build
console.info("");
console.info("** Igaro App Builder **");
console.info("");
fs.emptyDir(targetRootDir, function() {

    Promise.all(
        Object.keys(build).map(function(action) {

            return build[action]();
        })
    ).then(function() {

        console.info("");
        consoleInfo("Ready: "+ targetRootDir);

        var isHttpd = typeof servePort === 'number';

        if (! isHttpd && ! watchEnabled)
            return;

        console.info("");
        console.info("Launching Services...");
        console.info("");

        // http service?
        if (isHttpd)
            httpd();

        // watch and rebuild?
        if (watchEnabled)
            watchers();

        // yuk
        setTimeout(function() {
            console.info("");
            console.info("Waiting...");
            console.info("");
        },2000);

    }).catch(function(e) {

        consoleError(e);
    });
});

