#!/usr/bin/node

// Requirements
var http = require('http');
var express = require('express');
var path = require('path');

// Create Server
var app = express();
var p = path.resolve(__dirname + '/../output/deploy/');

app.use('/cdn', express.static(p+'/cdn'));

app.all('*', function(req, res, next) {
	res.sendFile(p+'/index.html');
});

// Listen
var server = http.createServer(app).listen(3001);

// Log
console.log('Igaro App - Deploy - running on localhost:3001');
