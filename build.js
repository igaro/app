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
    jsxgettext = require("jsxgettext"),
    linter = require("eslint").linter;

// get recipes
var recipes = fs.readdirSync("src/recipes").map(function(recipe) {

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
    minifyEnabled = !! (args.minify || recipeConf.minify),
    watchEnabled = !! (args.watch || recipeConf.watch),
    servePort = args.serve || recipeConf.serve;

// folders
var srcRootDir = __dirname + '/src';
    srcSassDir = srcRootDir  + '/sass/scss',
    srcAppDir = srcRootDir  + '/app',
    srcCpDir = srcRootDir  + '/cp',
    targetRootDir = __dirname + '/target/'+recipe,
    targetCssDir = targetRootDir + '/cdn/css';

// regexps
var includeRegExp = /\@\@include\((.*?)\)/g,
    varRegExp = /\@\@var\((.*?)\)/g;

/* HELPERS ------------------------------------------------------------ */

var mkdir = function(dir) {

    return new Promise(function(resolve,reject) {

        fs.mkdirs(dir, function(err) {

          if (err) reject(err)
          else resolve()
        });
    });
};

var readdir = function(dir) {

    return new Promise(function(resolve,reject) {

        fs.readdir(srcSassDir,function(err,files) {

          if (err) reject(err)
          else resolve(files)
        });
    });
};

var readfile = function(file) {

    return new Promise(function(resolve,reject) {

        fs.readFile(file,function(err, data) {
            if (err) reject(err)
            else resolve(data.toString('utf8'))
        });
    });
};

var writefile = function(file,data) {

    return mkdir(file.substr(0,file.lastIndexOf('/'))).then(function() {

        return new Promise(function(resolve,reject) {

            fs.writeFile(file,data,function(err) {
                if (err) reject(err)
                else resolve()
            });
        });
    });
};

var getTime = function() {

    var date = new Date();
    return date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
};

var consoleColor = function(txt,code) {

    console.info('\x1b['+code+'m', txt,'\x1b[0m');
}

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

        console.info('Httpd:'+servePort);
    });
    app.use(express.static(targetRootDir));
};

/* WATCHER ------------------------------------------------------------ */

var watchers = function() {

    [
        ['SASS',srcSassDir + '/..' ,'sass'],
        ['APP',srcAppDir,'app'],
        ['BUILTIN',srcRootDir+'/builtin','app'],
        ['CONF',srcRootDir+'/conf','app'],
        ['CP',srcCpDir,'cp']
    ].forEach(function(o) {

        watch.watchTree(o[1], { ignoreDotFiles:true }, function (f,curr,prev) {

            if (typeof f === "object" && prev === null && curr === null) {
                console.info("Watching:"+o[0]);
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
        return new Promise(function(resolve,reject) {

            // walk tree
            var files = [];
            fs.walk(srcAppDir)
              .on('data', function(file) {

                files.push(file.path)
              })
              .on('end', function() {

                resolve(files);
              })
              .on('error', function(err) {
                reject(err)
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
                        throw new Error("Entry missing from recipe: "+name)
                    return value;
                });
            });

            return files;

        }).then(function(files) {

            var mapped = files.reduce(function(a,b) {

                a[b.name] = b.data;
                return a;
            }, {});

            // parse out gettext strings
            var parsed = jsxgettext.generate(mapped,{});
            return writefile(__dirname + '/src/translations/messages.pot',parsed).then(function() {

                return files;
            })

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

            // write files
            return Promise.all(files.map(function(file) {

                return writefile(targetRootDir + file.name.slice(srcAppDir.length),file.data);
            }));

        }).then(function() {

            consoleInfo("APP ("+ process.hrtime(start)[0]+'.'+(process.hrtime(start)[1] / 1000000).toFixed(0) + "s)");
        });
    },

    cp : function(f,deleted) {

        var start = process.hrtime();
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
                    };

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

            consoleInfo("CP" + (f? ':'+f + (deleted? ' (deleted)' : '') : '') + " ("+ process.hrtime(start)[0]+'.'+(process.hrtime(start)[1] / 1000000).toFixed(0) + "s)");
            process.hrtime();
        });
    },

    sass : function() {

        var start = process.hrtime();

        return mkdir(targetCssDir).then(function() {

            return readdir(srcSassDir).then(function(files) {

                return Promise.all(
                    files.filter(function(file) {

                        return file.slice(-5) === '.scss';
                    }).map(function(file) {

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
                        })
                    })
                );
            });
        }).then(function() {

            consoleInfo("SASS ("+ process.hrtime(start)[0]+'.'+(process.hrtime(start)[1] / 1000000).toFixed(0) + "s)");
            process.hrtime();
        });
    }
};

// build
console.info("Building Igaro App...");
fs.emptyDir(targetRootDir, function() {

    Promise.all(
        Object.keys(build).map(function(action) {

            return build[action]();
        })
    ).then(function() {

        console.info("Build available: "+ targetRootDir);

        // http service?
        if (typeof servePort === 'number')
            httpd();

        // watch and rebuild?
        if (watchEnabled)
            watchers();

    }).catch(function(e) {

        consoleError(e);
    });
});

