var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:pythagoras@ds029778.mlab.com:29778/persistent');

// check Connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Mongoose is running mofo');
});

module.exports = db;
