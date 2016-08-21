module.exports = function(io) {
    var db   = require('../db/connect.js');
    var User = require('../db/user.js');

    // nicht eingeloggt:
    io.sockets.on('connection', function(socket){
        console.log(io.sockets);
        socket.on('register', function(data){
            console.log('register try');

            // User darf nur angelegt werden, wenn es ihn noch nicht gibt
            User.findOne({username:data.username}, function(err, user){
                console.log(err, user);
                if(!err && !user){
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
                } else {
                    console.log('user already exists');
                }
            });

        });

        // Kann erst ausgelöst werden, wenn eingeloggt
        socket.on('stoptime', function (data) {
            console.log(data);
            socket.broadcast.to(data.room).emit('stopit', {});
            // socket.broadcast.emit('stopit', {});
            //io.sockets.emit('stopit');
            //socket.broadcast.to('loggedin').emit('stopit');
            console.log('Stop!');
        });

        socket.on('sendtime', function (data) {
            //user.save({time: 'data'});
            console.log(data);
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
              // funzt nicht
              // return callback(null, user.password == password);
              if( user.password == password ){
                  console.log('Password correct: Authenticated socket', socket.id);
                  socket.join('General');
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
            console.log('POST TEST');
            User.find('User', {username:username}, function(err, user) {
                socket.client.user = user;
            });
        });

    }

}
