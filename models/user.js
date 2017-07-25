var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoDB = 'mongodb://192.168.0.200/semard';
mongoose.connect(mongoDB,{
  useMongoClient: true
});

var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var password_validation = {
  validator: function(p){
    return this.password_confirmation == p;
  },
  message: "Las contraseñas no coinciden"
}
var user_schema = new Schema({
  name: String,
  username: {type: String, required: true, maxlength:[20,'Nombre usuario muy grande.']},
  password: {
    type: String,
    required:true,
    minlength:[8,'La contraseña es muy corta.'],
    validate: password_validation
  },
  isAdmin: Boolean,
  email: {type: String, required:true}
});

user_schema.virtual("password_confirmation").get(function() {
  return this.p_c;
}).set(function(password){
  this.p_c = password;
});

var User = mongoose.model("User",user_schema);

module.exports.User = User;
