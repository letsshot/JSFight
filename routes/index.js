var express = require('express');
var router = express.Router();
var player = require('../database/db').player;
var md5=require("./md5");
//var io=require('../app').io;
router.get('/', function(req, res) {
  res.render('index', { title: 'Login - JSFight' });
});
router.get('/lobby', function(req, res) {
  res.redirect('/');
});
router.get('/register', function(req, res) {
  res.render('Register', { title: 'Register - JSFight' });
});
router.post('/register', function(req, res) {
	var query = {name: req.body.name};
	(function(){
                  player.count(query, function(err, doc){
                        if(doc == 1){
                            console.log('Player name '+query.name+' has been used!');
                            res.render('register', { error:'Player name '+query.name+' has been used!' });
						}else{
							var newPlayer=new player({
								name: req.body.name,
								password: md5.hex_md5(req.body.password),
								gameNumber: 0,
								winNumber:0
							});
							newPlayer.save();
							res.render('lobby', { name: newPlayer.name, password: newPlayer.password });
                        }
                });
          })(query);

});
router.post('/lobby', function(req, res) {
	      var query = {name: req.body.name, password: md5.hex_md5(req.body.password)};
          (function(){
                  player.count(query, function(err, doc){
                        if(doc == 1){
                            console.log(query.name + ": Login successed " + new Date());
                            res.render('lobby', { name: query.name, password: query.password });
						}else{
                            console.log(query.name + ": Login failed " + new Date());
                            res.redirect('/');
                        }
                });
          })(query);
		  
  });
  module.exports = router;
