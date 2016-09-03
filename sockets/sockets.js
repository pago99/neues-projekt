module.exports = function(io) {
    var db   = require('../db/connect.js');
    var User = require('../db/user.js');
    var bcrypt = require('bcryptjs');

    // SERVERSEITIG :)

    // nicht eingeloggt:
    io.sockets.on('connection', function(socket){

        // Client fragt an sich zu registrieren:
        socket.on('register', function(data){
            console.info('register try');

            // User darf nur angelegt werden, wenn es ihn noch nicht gibt
            User.findOne({username:data.username}, function(err, user){
                // es darf also kein Fehler aufgetreten sein und das "user"-Result
                // muss leer (undefined) sein
                if(!err && !user){
                    // generate salt
                    var salt = bcrypt.genSaltSync(10);
                    // hash pw
                    var hash = bcrypt.hashSync(data.password, salt);
                    // nur dann neuen Datensatz anlegen
                    var userSave = new User(
                    {
                      username: data.username,
                      hash: hash,
                      time: '0.0',
                      registered_at: new Date()
                    });

                    // anschließend speichern
                    userSave.save( function(err) {
                        if(!err){
                            console.info('Success: User angelegt');
                            socket.emit('success', {username:data.username, password:data.password});
                        } else {
                            console.error('Error: Konnte nicht speichern.');
                            socket.emit('regError', {code:2});
                        }
                    });
                } else {
                    // Ansonsten gibt es den User schon.
                    console.error('Error: user already exists');
                    socket.emit('regError', {code:1});
                }
            });

        });

        // Kann erst ausgelöst werden, wenn eingeloggt
        socket.on('stoptime', function (userData) {
            // An alle verbundenen Sockets (= quasi alle verbundenen Besucher/Benutzer) schicken
            // --> zu den Clients, als Wert wird der NEUE "King of the Hill" mitgegeben
            socket.broadcast.emit('stopit', {username: userData.username, time: userData.time});
            setRankings(User, socket, true);
        });

        socket.on('sendtime', function (userData) {
            console.time('saveAndRankingsUpdate');
            // Hier die Daten speichern vom User, dessen Zeit gerade
            // gestoppt wurde, weil ein anderer FIRE! geklickt hat
            console.log('Gespeichert: ' + userData.username + ': ' + userData.time);
            User.where('username', userData.username).update({$set: {time: userData.time}}, function(err, count){
                if(!err){
                    setRankings(User, socket, true);
                }
            });
            console.timeEnd('saveAndRankingsUpdate');
        });

        // bei Login Ranglistendaten holen!
        setRankings(User, socket, false);

    });

    // helper funcs
    // Ranglistendaten an Client oder Clients (dann type angeben) schicken
    // type = false -> kein broadcast, bei true -> broadcast
    function setRankings(UserModel, socket, type){
        UserModel.find({}, 'username time', function(err, user){
            if(!err) {
                if(type){
                    io.sockets.emit('highscore', {user});
                } else {
                    socket.emit('highscore', {user});
                }
            } else {
                throw err;
            }
        });
    }


    // Auth-Configuration
    // authenticate wird aufgerufen, wenn user sich einloggen will (ausgelöst im client)
    require('socketio-auth')(io, {
        authenticate: authenticate,
        postAuthenticate: postAuthenticate,
        timeout: 'none' // Angabe wie lange der User dafür Zeit hat, bei uns gibt es keine Beschränkung
    });
    function authenticate(socket, data, callback) {
        console.info('Login try');
        //get credentials sent by the client
        var username = data.username;
        var password = data.password;

        // Gibts den User?
        User.findOne({username:username}, function(err, user) {
            console.info('try to find user...');
            //inform the callback of auth success/failure
            // console.log(err, user);

            if (err || !user) {
                return callback(new Error("User not found"));
            } else {
                console.info('user found, check password...');

                // User gefunden, aber stimmt das pw?
                //if( user.hash == password ){
                console.log('found hash: '+user.hash);
                if( bcrypt.compareSync(password, user.hash) ){
                    console.info('Password correct');
                    socket.emit('whoami', {username:user.username, time: user.time});
                    // Wichtig: Sowohl im Erfolgs- als auch Misserfolgsfall
                    // muss per callback das Ergebnis geliefert werden
                    // Ansonsten checkt der Client nicht, ob "authorized" oder "unauthorized"
                    // für den verbundenen User der Fall ist. Des Weiteren gehen NUR
                    // im "authorized" (Erfolg) - Fall broadcast-Messages!
                    return callback(null, true);
                } else {
                    return callback(new Error("Wrong password"));
                }
            }
        });
    }

    // Wird immer direkt nach dem authenticate Prozess ausgeführt
    // um zu "tracken", ob User weiterhin authenticated ist
    function postAuthenticate(socket, data){
        var username = data.username;

        User.findOne({username:username}, function(err, user) {
            //console.log(err, user);
            if(!err){
                socket.client.user = user;
            } else {
                console.log(err);
            }
        });
    }
}
