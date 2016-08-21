// Als Vorlage, so wäre es ohne authenticate
/*var socket = io('http://localhost:3000');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});*/
var run = 0;


var socket = io.connect('http://localhost:3000');
socket.on('connect', function(){

    // HEAR SERVER-EVENTS
    socket.on('authenticated', function() {
        // use the socket as usual
        console.log('authenticated...');

        if ( run == 0) {
            $("#starttimer").click(function(){
                starttimer();
                socket.emit('stoptime', {});
                console.log("Yeah, I started, and stopped all the other B****");
                run = 1;
            });
        };

        socket.on('stopit', function () {
            stoptimer();
            var mytime = $("#time").text();
            console.log("Yeah your time is:" + mytime);
            if ( run == 1) {
                socket.emit('sendtime', { time: mytime });
                run = 0;
            };
        });

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
