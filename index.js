// requirements
var io = require('socket.io');
var http = require('http');
var express = require('express');
var session = require('express-session');
var db = require('./db/connect.js');

var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || 'localhost';

var app = express();

app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/assets', express.static('assets'));

app.get('/', function(req, res) {
    res.sendFile('view/start.html', {root: __dirname })
});


app.listen(PORT, null, null, function() {
  console.log('Host: %s - Server listening on port %d in %s mode', 'localhost', this.address().port, app.settings.env);
});
