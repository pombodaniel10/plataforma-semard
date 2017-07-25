var express = require('express');
var body_parser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user').User;
var cookieSession = require('cookie-session');
var router_app = require('./routes/routes_app');
var session_middleware = require('./middlewares/session');

var app = express();

const PORT = 8080;

app.use(body_parser.urlencoded({extended:true}));
app.use(body_parser.json());
app.use("/public",express.static("public"));
app.use(cookieSession({
  name: "session",
  keys: ["llave-1","llave-2"]
}));

//app.use(express.static("assets"));

app.set("view engine","jade");

app.listen(PORT, function(){
    console.log("My http server listening on port " + PORT + "...");
});

app.get('/',function(req,res){
  res.render("index");
});

app.get('/login',function(req,res){
  res.render("login");
});

app.get('/signup',function(req,res){
  res.render("signup");
});

app.post('/users',function(req,res){
  var isadmin = req.body.admin;
  if(!req.body.admin){
    isadmin= "false";
  };
  var user = new User({email: req.body.email,
                       username: req.body.username,
                       name: req.body.name,
                       password: req.body.password,
                       password_confirmation: req.body.password_confirmation,
                       isAdmin:isadmin});

  user.save().then(function(us){
    res.redirect("/app/admin/manage");
  },function(err){
    console.log(String(err));
    res.send("WRONG :(");
  });
});

app.post('/sessions',function(req,res){
  User.findOne({username: req.body.username, password: req.body.password},function(err,user){
    if(err){
      res.send("wrong");
    }
    if(user!=null){
      req.session.user_id = user._id;
      if(user.isAdmin==false){
        res.redirect("/app");
      } else {
        res.redirect("/app/admin");
      }
    } else {
        res.redirect("/login");
        //res.render("login",{loginerror: "Usuario o contraeña invalidos"});
      }
  });
});

app.get('/signout',function(req,res){
  req.session.user_id = null;
  res.redirect("/");
});

app.use("/app",session_middleware);
app.use("/app",router_app);
