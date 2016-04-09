#Igaro App [http://app.igaro.com](http://app.igaro.com)

[ ![Codeship Status for igaro/app](https://codeship.com/projects/d521e620-04a0-0133-19ae-1a88c4115bd9/status?branch=master)](https://codeship.com/projects/89386)

Igaro App is a web-app (SPA+) architecture using native ES5/6 JavaScript API.

## Why Igaro App?

Are you tired of JavaScript frameworks that promise you the world and demo it to you with a simple "Hello World" data binding example?

Are you weary of investing time and energy learning the quirks of a framework only to find that when it comes to building something substantial it causes you pain?

Are you a developer that prefers structure and performance over rapid "kick it out the door" development?

Do you want to use the native ES5/ES6 JavaScript API without JQuery, Loadash and a hundred other dependencies?

If so, welcome to Igaro App!

## Repo = App = Live Demo

The repository you download here is fully featured App you'll soon have running on your local machine, and which is continuously deployed to: [http://app.igaro.com](http://app.igaro.com)

By reading some of the documentation and using your natural inquisitiveness to change things you'll quickly get to grips and be on your way.

Igaro App is just "plain old object orientated JavaScript", with some easy to use spice (read about [Bless](http://app.igaro.com/#/bless) if you want a taste!).

## Documentation

All modules are comprehensibly documented in the /modules section within the app and also inline via JSDoc.

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
- new native build system (requires Node 5.8+) for spectacular speed. Grunt removed
- split configuration files in prep for removing demo files from the core (1.6)
- documentation improvements including event lists

###1.4
- core.router -> IE8+ support, URL object support, relative navigation
- instance.amd -> detailed loading feedback
- [browser] fixes for IE8+
- font.glyph.awesome -> included!
- core.url -> supports a URL object which can be passed to the router
- instance.amd -> add module and app version support to module request

