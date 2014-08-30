#!/usr/bin/node

// Requirements
var http = require('http');
var express = require('express');
var path = require('path');

// Create Server
var app = express();
var p = path.resolve(__dirname + '/../output/debug/');

app.use('/cdn', express.static(p+'/cdn'));

app.all('*', function(req, res, next) {
	res.sendFile(p+'/index.html');
});

// Listen
http.createServer(app).listen(3000);

// Log
console.log('Igaro App - Debug - Server - localhost:3000');

