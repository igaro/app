#Igaro App [http://app.igaro.com](http://app.igaro.com)

[ ![Codeship Status for igaro/app](https://codeship.com/projects/d521e620-04a0-0133-19ae-1a88c4115bd9/status?branch=master)](https://codeship.com/projects/89386)

Igaro App is a complete web-app (SPA+) architecture using only the native ES5/6 JavaScript API.

It's designed by and for professionals. Tired of lesser frameworks like Angular? Try this!

## Repo = App = Live Demo

The repo you download here is the App you'll have running on your local machine, and which is continuously deployed to: [http://app.igaro.com](http://app.igaro.com)

## Documentation

All modules are comprehensibly documented in the /modules section within the demo and also inline via JSDoc.

## Install & Build

Ensure you have `Node 5.8` or newer installed (older versions can be used if you modify the build script to include a Promise library).

install the dependencies;

`npm install`

A native script builds the system using recipes (i.e develop, deploy). To list the available recipes use;

`./build.js`

To use the devel recipe, launch a web server on localhost:3006, minify the JavaScript and watch for file changes as you work use;

`./build.js --recipe=devel --serve=3006 --minify --watch`


## History

###1.5
- Full GetText language translation support
- new native build system (requires Node 5.8+). Grunt removed
- split configuration files in prep for removing the demo from the core

###1.4
- core.router -> IE8+ support, URL object support, relative navigation
- instance.amd -> detailed loading feedback
- [browser] fixes for IE8+
- font.glyph.awesome -> included!
- core.url -> supports a URL object which can be passed to the router
- instance.amd -> add module and app version support to module request

