#Igaro App [http://app.igaro.com](http://app.igaro.com)

[ ![Codeship Status for igaro/app](https://codeship.com/projects/d521e620-04a0-0133-19ae-1a88c4115bd9/status?branch=master)](https://codeship.com/projects/89386)

Igaro App is a web-app (SPA+) architecture using native ES5/6/7 JavaScript.

It was written in 2014 by a senior JavaScript engineer (Andrew Charnley, UK contractor) who became despondent with learning various frameworks (i.e Angular 1) only to hit walls using them in real-life applications. Since then several frameworks have come and gone, but the architecture behind Igaro App is still rock solid.

As this is a large project with minimal time available for improvements some aspects, like testing, require improvement. Igaro App detects any error on the page or within it's modules and handles it. By looking for this handle many aspects are tested at once. The code base is currently being freshened up with arrow functions.

## Zero Smell Code

- No callbacks (unless converting into a Promise).
- No global object on window.* - very secure!
- 100% modularity.
- 100% locale ready with support for multiple language, country and currency.
- 100% JavaScript. 0% HTML.

## Repo = App = Live Demo

This repository is a fully featured SPA you'll soon have running on your local machine and which is continuously deployed to: [http://app.igaro.com](http://app.igaro.com). It is also the foundation used in a commercial product [https://www.igaro.com](https://www.igaro.com) where you can see Igaro App's flexibility in action by way of features like the website's e-commerce shopping cart.

Igaro App is just "plain old object orientated JavaScript", with some easy to use spice to tie it's highly modular architecture together (read about [Bless](http://app.igaro.com/#/bless) if you want a taste!).

By reading some of the documentation and using your natural inquisitiveness you'll quickly get to grips and be on your way.

## Documentation

All modules are comprehensibly documented in the /modules section within the app and also inline via JSDoc.

## Install & Build

Ensure you have `Node 6.0` or newer installed.

install the dependencies;

`npm i`

A NodeJS script builds the system using recipes (i.e develop, deploy). It supports Babel. To list the available recipes use;

`./build.js`

To use the 'devel' recipe, launch a web server on localhost:3006, and watch for file changes as you work use;

`./build.js --recipe=devel --serve=3006 --watch`

## History

###1.5.1
- Bug fixes to country, currency and language for auto detection
- Both #/ and pushState support with auto url redirect
- Google Bot 404 redirect
- Many css tweaks for many modules
- Bug fixes for many instance modules
- Updated test, build scripts

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

