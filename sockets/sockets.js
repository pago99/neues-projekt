module.exports = function(io) {
    var db   = require('../db/connect.js');
    var User = require('../db/user.js');

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

    // nicht eingeloggt:
    io.on('connection', function(socket){
        console.log('Nicht eingeloggt');

        socket.on('register', function(data){
            console.log('register try');
            var userSave = new User(
            {
              username: data.username,
              password: data.password,
              time: '0',
              registered_at: new Date()
            });
            console.log(userSave);

            userSave.save( function(err) {
                if(!err){
                    console.log('User angelegt');
                } else {
                    console.log('Fehler: Registrierung');
                }
            });
        });

        // Darf erst ausgelöst werden, wenn eingeloggt!
        socket.on('stoptime', function (data) {
            socket.broadcast.emit('stopit', {});
        });

        socket.on('sendtime', function (data) {
            //user.save({time: 'data'});
            console.log(data);
        });

        socket.on('unauthorized', function(err){
            console.log("There was an error with the authentication:", err.message);
        });

        socket.on('error', function(err){
            console.log("There was an error ", err);
        });

    });



    require('socketio-auth')(io, {
        authenticate: authenticate,
        postAuthenticate: postAuth,
        timeout: 'none'
    });
    function authenticate(socket, data, callback) {
        console.log('Login try');
        //get credentials sent by the client
        var username = data.username;
        var password = data.password;

        console.log(username, password);

        User.findOne({username:username}, function(err, user) {
            console.log('try to find user...');
            //inform the callback of auth success/failure
            console.log(err, user);

            if (err || !user) {
              return callback(new Error("User not found"));
            } else {
                console.log(user.password);
              // funzt nicht
              // return callback(null, user.password == password);
              if( user.password == password ){
                  console.log('Authenticated socket', socket.id);
                  socket.emit('authenticated');
              } else {
                  return callback(new Error("Wrong password"));
              }
            }
        });
    }
    var postAuth = function(socket, data){
        var username = data.username;
        console.log('POST TEST');
        /*User.find('User', {username:username}, function(err, user) {
            socket.client.user = user;
        });*/

    }

}
