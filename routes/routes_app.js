var express = require('express');
var User = require('../models/user').User;
var Impresora = require('../models/impresora').Impresora;
var mqtt = require('mqtt');

var client  = mqtt.connect('mqtt://192.168.0.200',{
  port: 1883,
  host: '192.168.0.200',
  clientId: "Severo perro pirobo",
  username: "semard",
  password: "semard2017"
});

var messages = "";

var impres = { pT: "impresora", n: "impresora", cC: 40, v: 5, s: "ok"};

client.on('connect', function () {
  client.subscribe('outStepper');
  client.subscribe('impresora_estado');
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  if(topic="outStepper"){
    messages = message.toString();
  }

  if(topic="impresora_estado"){
    var ij = JSON.parse(message.toString());
    var impresora = new Impresora(ij);
    impresora.save().then(function(imp){
      impres = imp;
    },function(err){
      console.log(String(err));
      res.send("WRONG :(");
    });
  }
});


var router = express.Router();

router.get("/",function(req,res){
  res.render("app/home");
});

router.post('/blackout',function (req,res) {
  var sen = req.body.clockwise || req.body.counterclockwise;
  var vue = req.body.vueltas;

  var stepper = {"vueltas": parseInt(vue), "sentido":sen};
  var myJSON = JSON.stringify(stepper);

  client.publish('inStepper',myJSON);

	res.render("app/blackout",{messages: messages});
});

router.get("/blackout",function(req,res){
  res.render("app/blackout",{messages: messages});
});

router.post('/luces',function (req,res) {
  var nombre = req.body.on || req.body.off;

	if (nombre == "on"){
    client.publish('encenderFoco','{"status": true}');
  } else if (nombre == "off") {
    client.publish('encenderFoco','{"status": false}');
  }

	res.render("app/luces");
});

router.get("/luces",function(req,res){
  res.render("app/luces");
});

router.get("/impresora",function(req,res){
  res.render("app/impresora",{impresora: impres})
});


router.get("/admin",function(req,res){
  User.findById(req.session.user_id,function(err,user){
    if(err){
      console.log(err);
    }else{
      if(user.isAdmin==true){
        User.find(function(err,users){
          if(err){
            console.log(err);
          }else {
            res.render("app/home_admin");
          }
        });
      } else {
        res.send("Usuario no autorizado"); }
      }
    });
});

router.get("/myaccount",function(req,res){
  res.render("app/myaccount");
});

router.get("/myaccountA",function(req,res){
  User.findById(req.session.user_id,function(err,user){
    if(err){
      console.log(err);
    }else{
      if(user.isAdmin==true){
        User.find(function(err,users){
          if(err){
            console.log(err);
          }else {
            res.render("app/myaccountA");
          }
        });
      } else {
        res.send("Usuario no autorizado"); }
      }
    });
  });

router.get("/admin/manage",function(req,res){
  User.findById(req.session.user_id,function(err,user){
    if(err){
      console.log(err);
    }else{
      if(user.isAdmin==true){
        User.find(function(err,users){
          if(err){
            console.log(err);
          }else {
            res.render("app/admin/manage",{users:users});
          }
        });
      } else {
        res.send("Usuario no autorizado"); }
      }
    });
  });

  router.get("/admin/signup",function(req,res){
    User.findById(req.session.user_id,function(err,user){
      if(err){
        console.log(err);
      }else{
        if(user.isAdmin==true){
          User.find(function(err,users){
            if(err){
              console.log(err);
            }else {
              res.render("app/admin/signup");
            }
          });
        } else {
          res.send("Usuario no autorizado"); }
        }
      });
    });

module.exports = router;
