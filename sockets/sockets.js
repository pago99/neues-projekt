module.exports = function(io) {

    // Der ganze Socket.io Stuff:
    // Als Vorlage, so wäre es OHNE "authenticate"
    /*io.on('connection', function (socket) {

        // Nur Testkram
        // Beim Entfernen: auch Code im Frontend löschen
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });

    });*/

    var db   = require('../db/connect.js');
    var user = require('../db/user.js');
    require('socketio-auth')(io, {
        authenticate: function (socket, data, callback) {
            //get credentials sent by the client
            var username = data.username;
            var password = data.password;

            user.find('User', {username:username}, function(err, user) {

              //inform the callback of auth success/failure
              if (err || !user) {
                  return callback(new Error("User not found"));
              } else {
                  return callback(null, user.password == password);
              }
            });

        }
    });

}
