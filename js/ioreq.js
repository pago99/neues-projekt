// Als Vorlage, so wäre es ohne authenticate
/*var socket = io('http://localhost:3000');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});*/
var run = 0;
var authenticated;

var socket = io.connect('http://localhost:3000');
socket.on('connect', function(){

    // HEAR SERVER-EVENTS
    socket.on('authenticated', function() {
        // use the socket as usual
        console.log('authenticated...');
        authenticated = true;

        if ( run == 0) {
            $("#starttimer").on('click touch', function(){
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
    $('.login').on('submit', function(e){
        e.preventDefault();
        if(!authenticated){
            var reqUsername = $(this).find('input[name="logname"]').val();
            var reqPassword = $(this).find('input[name="logpass"]').val();
            console.log(reqUsername, reqPassword);
            socket.emit('authentication', {username: reqUsername, password: reqPassword});
        } else {
            console.log('Bist schon eingeloggt');
        }
    });

    // register button clicked:
    $('.register').on('submit', function(e){
        e.preventDefault();
        if(!authenticated){
            var reqUsername = $(this).find('input[name="regname"]').val();
            var reqPassword = $(this).find('input[name="regpass"]').val();
            socket.emit('register', {username: reqUsername, password: reqPassword});
        } else {
            console.log('Du bist bereits eingeloggt... Warum also registrieren?');
        }
    });

    // fire button clicked:
    $('#starttimer').on('click touch', function(){
        if(!authenticated){
            $("#overlay").css("display", "block").animate({opacity: '1'}, "fast");
        }
    });

});
