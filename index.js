// requirements
var io = require('socket.io');
var http = require('http');
var express = require('express');
var session = require('express-session');
var db = require('./db/connect.js');

var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || 'localhost';

var app = express();

// "static"-Ordner definieren, sodass in den view-Dateien (.html) kein absoluter
// Pfad angegeben werden muss: '... href="css/base.min.css" ...'
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));
app.use('/view', express.static('view'));
app.use('/assets', express.static('assets'));


// das URL-Routing in ein router-module ausgelagert
var router = require('./router.js');
app.use('/', router);

app.listen(PORT, null, null, function() {
  console.log('Host: %s - Server listening on port %d in %s mode', 'localhost', this.address().port, app.settings.env);
});
