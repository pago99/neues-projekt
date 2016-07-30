module.exports = function(io) {

    var db   = require('../db/connect.js');
    var user = require('../db/user.js');

    // Der ganze Socket.io Stuff:
    // Als Vorlage, so wäre es OHNE "authenticate"
    io.on('connection', function (socket) {

        // Nur Testkram
        // Beim Entfernen: auch Code im Frontend löschen
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });

        socket.on('stoptime', function (data) {
            socket.broadcast.emit('stopit', {});
        });

        socket.on('sendtime', function (data) {
            //user.save({time: 'data'});
            console.log(data);
        });

    });
}
