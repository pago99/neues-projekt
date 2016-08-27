var run = 0;
var authenticated;
var username;

var socket = io.connect('http://localhost:3000');
socket.on('connect', function(){

    // HEAR SERVER-EVENTS
    socket.on('authenticated', function(response) {
        // use the socket as usual
        console.log('authenticated...');
        authenticated = true;

        // Overlay entfernen... und evtl zukünftig noch paar Dinge, deshalb als
        // helper function
        authClean();

        if ( run == 0) {
            $("#starttimer").on('click touch', function(){
                starttimer();
                socket.emit('stoptime', {username:username, time:time});
                console.log("Yeah, I started, and stopped all the other B****");
                run = 1;
            });
        };

    });

    socket.on('whoami', function(userData){
        console.log('You are: ' + userData.username + ' and your time is: ' + userData.time);
        username = userData.username;
        time = userData.time;
    });

    socket.on('stopit', function (userData) {
        // userData = Daten vom User, der gerade King of the hill ist!
        stoptimer();
        $('#current').find('span').text(userData.username);
        $('#current').find('#othertime').text(userData.time);
        var mytime = $("#time").text();
        console.log("Yeah your time is:" + mytime);
        if ( run == 1) {
            // username = Benutzername des Users, dessen Zeit gerade gestoppt wurde
            // und deshalb gespeichert werden muss
            socket.emit('sendtime', { username:username, time: mytime });
            run = 0;
        };
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

    // in eine Funktion packen, damit DRY
    // fire button clicked:
    $('#starttimer').on('click touch', function(){
        if(!authenticated){
            $("#overlay").css("display", "block").animate({opacity: '1'}, "fast");
        } else {
            console.log('TEST');
            // Hier landet die Routine, wenn der User sich authentifiziert hat
            // und die Zeit startet und somit King of the Hill ist
            // Evtl. ein Event rausballern, vllt auch als broadcast?
        }
    });

    // error events:
    // Wird ausgespuckt wenn es einen Fehler beim Loginprozess gab
    socket.on('unauthorized', function(err){
        console.log("There was an error with the authentication:", err.message);
    });

    // andere Fehler abfangen:
    socket.on('error', function(err){
        console.log("There was an error ", err);
    });

});

// Helper funcs
function authClean(){
    $('#overlay').remove();
}
