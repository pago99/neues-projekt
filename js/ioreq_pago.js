// Als Vorlage, so wäre es ohne authenticate
var socket = io('http://localhost:3000');

socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});

/* -- TIME IS TIME -- */

var run = 0;

if ( run == 0) {
    $("#starttimer").click(function(){
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
        socket.emit('sendtime', { time: 'mytime' });
        run = 0;
    };
});
