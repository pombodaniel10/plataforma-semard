var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoDB = 'mongodb://192.168.0.200/semard';
mongoose.connect(mongoDB,{
  useMongoClient: true
});

var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var impresora_schema = new Schema({
  pT: String, // printer type
  n: String, //name
  cC: Number, // corriente
  v:  Number, // voltaje
  s: String, // State
  wT: {
        h: Number, // horas
        m: Number, // minutos
        s: Number, // segundos
      }
});

var Impresora = mongoose.model("Impresora",impresora_schema);

module.exports.Impresora = Impresora;
