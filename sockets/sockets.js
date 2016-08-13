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
              email: 'maggo@persistant.com',
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
    });



    require('socketio-auth')(io, {
        authenticate: authenticate,
        postAuthenticate: postAuthenticate,
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
                  socket.emit('authenticated');
              } else {
                  return callback(new Error("Wrong password"));
              }
            }
        });
    }

    function postAuthenticate(socket, data){
        var username = data.username;

        User.find('User', {username:username}, function(err, user) {
            socket.client.user = user;
        });

    }

}
