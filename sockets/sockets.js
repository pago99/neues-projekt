module.exports = function(io) {
    var db   = require('../db/connect.js');
    var User = require('../db/user.js');

    // nicht eingeloggt:
    io.sockets.on('connection', function(socket){

        socket.on('register', function(data){
            console.log('register try');

            // User darf nur angelegt werden, wenn es ihn noch nicht gibt
            User.findOne({username:data.username}, function(err, user){
                if(!err && !user){
                    var userSave = new User(
                    {
                      username: data.username,
                      password: data.password,
                      time: '0',
                      registered_at: new Date()
                    });

                    userSave.save( function(err) {
                        if(!err){
                            console.log('User angelegt');
                        } else {
                            console.log('Fehler: Registrierung');
                        }
                    });
                } else {
                    console.log('user already exists');
                }
            });

        });

        // Kann erst ausgelöst werden, wenn eingeloggt
        socket.on('stoptime', function (userData) {
            socket.broadcast.emit('stopit', {username: userData.username, time: userData.time});
        });

        socket.on('sendtime', function (userData) {
            //user.save({time: 'data'});
            // Hier die Daten speichern vom User, dessen Zeit gerade
            // gestoppt wurde, weil ein anderer FIRE! geklickt hat
            //console.log(userData);
            User.where('username', userData.username).update({$set: {time: userData.time}}, function(err, count){});
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

        User.findOne({username:username}, function(err, user) {
            console.log('try to find user...');
            //inform the callback of auth success/failure
            console.log(err, user);

            if (err || !user) {
              return callback(new Error("User not found"));
            } else {
                console.log('user found, check password...');
                if( user.password == password ){
                  console.log('Password correct');
                  socket.emit('whoami', {username:user.username, time: user.time});
                  return callback(null, user.password == password);
                } else {
                  return callback(new Error("Wrong password"));
                }
            }
        });
    }
    function postAuthenticate(socket, data){
        var username = data.username;

        User.findOne({username:username}, function(err, user) {
            console.log(err, user);
            if(!err){
                socket.client.user = user;
            } else {
                console.log(err);
            }
        });
    }
}
