// Externe Module + Konfiguration
// Wichtig: Konfigurationsablauf, Reihenfolge wichtig!
var express = require('express');
var app     = express();
var PORT    = process.env.PORT || 3000;
var HOST    = process.env.HOST || 'localhost';
var server  = app.listen(PORT, null, null, function() {

  console.log('Host: %s - Server listening on port %d in %s mode', 'localhost', this.address().port, app.settings.env);

});

// Weitere externe Module
var io      = require('socket.io').listen(server) // socket.io wird mit Port verknüpft!!!

// Eigene Module
var sockets = require('./sockets/sockets.js')(io);
var db      = require('./db/connect.js');
var router  = require('./router.js');

// "static"-Ordner definieren, sodass in den view-Dateien (.html) kein absoluter
// Pfad angegeben werden muss: '... href="css/base.min.css" ...'
app.use('/js', express.static('js'));
app.use('/socket.io', express.static('socket.io'));
app.use('/css', express.static('css'));
app.use('/view', express.static('view'));
app.use('/assets', express.static('assets'));

// das URL-Routing in ein router-module ausgelagert
app.use('/', router);
