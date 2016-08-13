// Als Vorlage, so wäre es ohne authenticate
/*var socket = io('http://localhost:3000');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});*/

var socket = io.connect('http://localhost:3000');
socket.on('connect', function(){

    // HEAR SERVER-EVENTS
    socket.on('authenticated', function() {
        // use the socket as usual
        console.log('authenticated...');
    });

    // EVENTS by USER
    // login button clicked:
    $('#login').on('click touch', function(){
        socket.emit('authentication', {username: "Maggo", password: "secret"});
    });

    // register button clicked:
    $('#register').on('click touch', function(){
        socket.emit('register', {username: "Maggo", password: "secret"});
    });

});
