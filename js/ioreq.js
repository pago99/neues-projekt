var run = 0;
var authenticated;
var username, myTime;

var socket = io.connect('http://localhost:3000');
socket.on('connect', function(){

    // CLIENTSEITIG :)

    // HEAR SERVER-EVENTS
    socket.on('authenticated', function(response) {
        // use the socket as usual
        console.info('auth successful');
        authenticated = true;

        // Overlay entfernen... und evtl zukünftig noch paar Dinge, deshalb als
        // helper function
        authClean();

        if ( run == 0) {
            $("#starttimer").on('click touch', function(){
                stoptimer();
                var savedTime = formatSavedTime(myTime);
                seconds = savedTime[0];
                millisec = savedTime[1];
                starttimer('time');
                socket.emit('stoptime', {username:username, time:myTime});
                console.log("Yeah, you're the new king of time.");
                // die Anzeige des Users, der gerade King of the Hill geworden ist
                // aktualisieren
                currentUser(username, '(You)');
                run = 1;
            });
        }
    });

    // Server sagt uns wer wir als User sind, sobald sichergestellt ist, dass
    // wir "authenticated" sind (Ergebnis des Logins)
    socket.on('whoami', function(userData) {
        console.log('You are: ' + userData.username + ' and your time is: ' + userData.time);
        username = userData.username;
        myTime = userData.time;

        // dem User anzeigen (bevor er auf "FIRE!" geklickt hat), wie seine Zeit gerade ist
        $('#time').text(myTime);

        // den Timer anhand der gespeicherten Zeit fortlaufen lassen, wofür die
        // gespeicherte Zeit formatiert werden muss (der Timer arbeitet mit int)
        var savedTime = formatSavedTime(myTime);
        seconds = savedTime[0]; // seconds kommt aus der do.js -> Timer
        millisec = savedTime[1]; // millisec kommt aus der do.js -> Timer
    });

    socket.on('highscore', function(user) {
        var times = new Array;

        for (var i = 0; i < user.user.length; i++) {
            times.push(user.user[i].time);
        };

        var newtimes = times.sort(function(a, b){return b-a});

        // da highscore nun auch aktualisiert wird, muss es vor jedem ausgelösten
        // Schleifendurchlauf geleert werden
        $('#highscore').html('');
        for (var i = 0; i < user.user.length; i++) {
            var bottom = ((user.user[i].time*100)/newtimes[0])-3.5;
            $('#highscore').append('<div class="user" style="bottom:'+bottom+'%;"><div class="rankuser">'+user.user[i].username+': '+user.user[i].time+'s</div><div class="dot"></div><hr/></div>');
        };
    });

    // Server sagt "stoppen", wenn es einen neuen King gibt
    socket.on('stopit', function (userData) {
        // userData = Daten vom User, der gerade King of the hill ist!
        // vorigen King vom Thron stoßen, also dessen Timer stoppen
        stoptimer();

        // neuen King anzeigen (in jedem CLIENT!!!)
        currentUser(userData.username, userData.time);

        // timer des neuen Kings laufen lassen
        var savedTime = formatSavedTime(userData.time);
        seconds = savedTime[0];
        millisec = savedTime[1];
        starttimer('othertime');

        // Zeit vom verbundenen User, der u.U. der vorige King of the Hill war
        myTime = $("#time").text();
        console.log("Your time was stopped: " + myTime);

        // Die Zeit des entthronten Kings speichern!
        if ( run == 1) {
            // username = Benutzername des Users, dessen Zeit gerade gestoppt wurde
            // und deshalb gespeichert werden muss
            console.log('Save! ' + username + ': ' + myTime );
            socket.emit('sendtime', {username:username, time: myTime});
            run = 0;
        }
    });

    // EVENTS by USER
    // Events sollen nur angesteuert werden, wenn man nicht authenticated ist:
    if(!authenticated){
        // login button clicked:
        // event wird nur getriggered, wenn man NICHT eingeloggt ist
        $('.login').on('submit', function(e){
            e.preventDefault();
            var reqUsername = $(this).find('input[name="logname"]').val();
            var reqPassword = $(this).find('input[name="logpass"]').val();
            socket.emit('authentication', {username: reqUsername, password: reqPassword});
        });

        // register button clicked:
        // event wird nur getriggered, wenn man NICHT eingeloggt ist
        $('.register').on('submit', function(e){
            e.preventDefault();
            var reqUsername = $(this).find('input[name="regname"]').val();
            var reqPassword = $(this).find('input[name="regpass"]').val();
            socket.emit('register', {username: reqUsername, password: reqPassword});
        });

        // fire button clicked:
        // event wird nur getriggered, wenn man NICHT eingeloggt ist
        $('#starttimer').on('click touch', function(){
            $("#overlay").css("display", "block").animate({opacity: '1'}, "fast");
        });
    }

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
// Remove Overlay from DOM
function authClean(){
    $('#overlay').remove();
}
// Alter display for current user info
function currentUser(username, time){
    $('.currentinfo span').text(username);
    $('#othertime').text(time);
}
// returns the saved Time: first return value: seconds, then milliseconds
function formatSavedTime(timeToFormat){
    var secAndMillisec = timeToFormat.split('.');
    return [parseInt(secAndMillisec[0]), parseInt(secAndMillisec[1])];
}
