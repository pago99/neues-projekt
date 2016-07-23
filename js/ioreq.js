// Als Vorlage, so wäre es ohne authenticate
/*var socket = io('http://localhost:3000');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});*/

var socket = io.connect('http://localhost:3000');
socket.on('connect', function(){

  socket.emit('authentication', {username: "John", password: "secret"});
  socket.on('authenticated', function() {
    // use the socket as usual
  });

});
