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
        // Zeit starten, wie lange der Browser hierfür brauch:
        console.time('highscore');
        var times = new Array;

        for (var i = 0; i < user.user.length; i++) {
            times.push(user.user[i].time);
        };

        var newtimes = times.sort(function(a, b){return b-a});

        // highscore-Container wird nicht mehr geleert. Neue werden appended, bereits
        // vorhandene werden herausgefiltert und ändern ihre Position per Animation
        for (var i = 0; i < user.user.length; i++) {
            // User und dessen Zeit für den aktuellen Schleifendurchlauf
            var username = user.user[i].username;
            var time = user.user[i].time;
            // bottom Prozentwert auf zwei Nachkommstallen kürzen
            var bottom = (time*100/newtimes[0]-3.5).toFixed(2);
            // diese Variable enthält entweder 'undefined' oder einen username
            // Indikator dafür, ob neuer Dot hinzugefügt oder vorhandener animiert werden soll!
            var userHasScore = $(document).find('[data-username="'+username+'"]').attr('data-username');

            //console.log(userHasScore, username, time, bottom);
            // Frontend-Username mit Backend-Username vergleichen
            if( userHasScore != username ) {
                // User ist noch nicht im highscore => Hinzufügen
                // console.log('score appended!');

                // Elemente per JS erzeugen und mit Attributen versehen
                // an dieser Stelle "data-username" einer "id" für username-holder vorgezogen
                // weil es sein kann, dass irgendein User mal einen Namen wählt, der einer unserer
                // css-ids entspricht, was das Layout zerstören könnte
                var userContainer = $('<div/>', {'data-username':username, class:'user', css:{'bottom':bottom+'%'}});
                var rankUser = $('<div/>', {class:'rankuser'});
                var displayUsername = $('<span/>', {text:username+' '});
                var displayScore = $('<span/>', {id:'timescore', text:time+'s'});
                var dot = $('<div/>', {class:'dot'});
                var hr = $('<hr/>');

                // Nun nach gewünschter Verschachtelung dem DOM hinzufügen
                $('#highscore').append(userContainer.append(rankUser.append(displayUsername.append(displayScore)), dot, hr));

                // Entspricht diesem Aufbau:
                //$('#highscore').append('<div data-username="'+username+'" class="user" style="bottom:'+bottom+'%;"><div class="rankuser"><span>'+username+': <span id="timescore">'+time+'s</span></span></div><div class="dot"></div><hr/></div>');
            } else {
                // User ist bereits im highscore => Animieren
                //console.log('score animated!');
                // in userHasScore ist der username des Users, der in diesem Schleifendurchlauf dran ist
                // und bereits im Frontend in der Rangliste vorhanden ist
                var actualUser = $('[data-username="'+userHasScore+'"]');
                // Zeit aktualisieren und Position prozentual animieren
                actualUser.find('#timescore').text(time);
                actualUser.animate({
                    'bottom': bottom+'%'
                }, 1200); // Standart-Animation (kein Wert) innerhalb 1,2 Sekunden
            }

        };
        // Zeit stoppen und in Console ausgeben
        console.timeEnd('highscore');
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
            if( reqUsername.length <= 1 || !reqUsername.match(/^[a-z0-9]+$/i) ){
                displayError(3, 'log');
            } else if( reqPassword <= 3 ){
                displayError('Wrong password', 'log');
            } else {
                socket.emit('authentication', {username: reqUsername, password: reqPassword});
            }
        });

        // register button clicked:
        // event wird nur getriggered, wenn man NICHT eingeloggt ist
        $('.register').on('submit', function(e){
            e.preventDefault();
            var reqUsername = $(this).find('input[name="regname"]').val();
            var reqPassword = $(this).find('input[name="regpass"]').val();
            if( reqUsername.length <= 1 || !reqUsername.match(/^[a-z0-9]+$/i) ){
                displayError(3, 'reg');
            } else if( reqPassword <= 3 ){
                displayError('Wrong password', 'reg');
            } else {
                socket.emit('register', {username: reqUsername, password: reqPassword});
            }
        });

        // fire button clicked:
        // event wird nur getriggered, wenn man NICHT eingeloggt ist
        $('#starttimer').on('click touch', function(){
            $("#overlay").css("display", "block").animate({opacity: '1'}, "fast");
            switch(myTime.length) {
                case 7:
                    $('#time').css('font-size', '100px');
                    break;
                case 8:
                    $('#time').css('font-size', '80px');
                    break;
                case 9:
                    $('#time').css('font-size', '60px');
                    break;
                default:
                    $('#time').css('font-size', '120px');
            };
        });
    }

    // error events:
    // Wird ausgespuckt wenn es einen Fehler beim Loginprozess gab
    socket.on('unauthorized', function(err){
        console.log("There was an error with the authentication:", err.message);
    });

    // Login-Fehler abfangen:
    socket.on('error', function(err){
        console.error("There was an error ", err);
        display(err, 'log');
    });

    // Register-Fehler abfangen:
    socket.on('regError', function(err){
        // console.error("There was an error ", err);
        displayError(err.code, 'reg');
    });

    // Erfolg abfangen
    socket.on('success', function(userData){
        console.info("Successful! ", userData);
        socket.emit('authentication', {username:userData.username, password:userData.password});
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
//displays Errors
function displayError(errorType, hook){
    console.log('displayError called');
    var msg;
    var name = 'name';
    switch(errorType){
        case 1:
            // User already exists
            msg = 'This user already exists. Try another name!';
        break;
        case 2:
            // Konnte nicht in DB speichern
            msg = 'Apparently we couldn\'t save your request. Sorry, please try again later.';
        break;
        case 3:
            // ungültiger username
            msg = 'Please use only alphanumerical letters and/or digits for your username. Use at least 2 characters for your name.';
        break;
        case 4:
            // ungültiges password
            msg = 'Please use a secure password. Length of password must be at least 4 characters.';
            name = 'pass';
        break;
        case 'User not found':
            // user existiert nicht
            msg = 'This user doesn\'t exits';
        break;
        case 'Wrong password':
            // wrong password
            msg = 'Wrong password.';
            name = 'pass';
        break;
    }
    // Vorige Fehlermeldungen entfernen, falls gerade sichtbar
    $('.error').remove();
    // Tooltip erstellen
    var tooltip = $('<p/>', {class:'error-tooltip', text:msg});
    var hr = $('<hr/>', {class:'tooltip-helper'});
    var dot = $('<div/>', {class:'error-dot'});
    var close = $('<span/>', {class:'error-close', text:'x'});
    // Tooltip an richtiger Stelle anzeigen (direkt beim zur msg passenden Input)
    $('[name="'+hook+name+'"]').parent().append(tooltip.append(hr, dot, close));
    // Höhe des Tooltips ermitteln, damit richtiger Abstand gesetzt werden kann
    var tooltipHeight = $('.error-tooltip').outerHeight();
    // jetzt sichtbar schalten. Durch "visibility" kann Höhe errechnet werden
    // selbst wenn Element noch unsichtbar
    $('.error-tooltip').css({'top':'-'+tooltipHeight+'px', 'visibility':'visible'});
    // Close-Event hinzufügen
    $(document).on('click touch focus', '.error-close, input', function(){
        $('.error-tooltip').remove();
    });
}
