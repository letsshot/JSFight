var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var http = require('http').createServer(app);
var io=require('socket.io').listen(http);

var playerModel = require('./database/db').player;
var md5=require("./routes/md5");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
var onlineUsers={};
var onlineCount=0;
function isLoggedIn(player,onlineUsers,onlineCount){
	var i=onlineCount;
	while(i--)
	{
		if(onlineUsers[i]==player.name)
		{
			return true;
		}
	}
	return false;
}
var sockets={};
io.on('connection',function(socket){
socket.on('userlogin',function(player){
	var query = {name: player.name, password: player.password};
	  (function(){
                  playerModel.count(query, function(err, doc){
                        if(doc == 1){
							if(!isLoggedIn(player,onlineUsers,onlineCount))
                            {
							socket.name=player.name;
							sockets[socket.name]=socket;
							onlineUsers[onlineCount]=player.name;
							onlineCount++;
							}
							io.emit('showusers',onlineUsers,onlineCount);
						}
                });
          })(query);
	});
socket.on('send',function(message){
		io.emit('showmessage',message);
	});		
socket.on('apply',function(receiver){
							if(socket.name!=receiver)
							{
								var playerData1={
								x:100,
								y:300,
								step:false,
								jump:false,
								crouch:false,
								direction:"right",
								attack:"null",
								hp:100,
								mp:100
								};
								var playerData2={
								x:500,
								y:300,
								step:false,
								jump:false,
								crouch:false,
								direction:"left",
								attack:"null",
								hp:100,
								mp:100
								};
								sockets[receiver].emit('apply-send',socket.name);
								sockets[receiver].on('apply-response',function(bool){
								if(bool==true)
								{
									sockets[receiver].emit('game',playerData1,playerData2);
									sockets[socket.name].emit('game',playerData1,playerData2);
									sockets[receiver].on('game',function(action){
										if(action=="stop")
										{
											playerData2.step=false;
											playerData2.crouch=false;
											playerData2.jump=false;
											playerData2.attack="null";
											playerData2.y=300;
										}
										else if(action=="left")
										{
										playerData2.direction="left";
										playerData2.x-=5;
										if(playerData2.x%2==0)
										{
											playerData2.step=true;
										}
										else{
											playerData2.step=false;
										}
										}
										else if(action=="right")
										{
										playerData2.direction="right";
										playerData2.x+=5;
										if(playerData2.x%2==0)
										{
											playerData2.step=true;
										}
										else{
											playerData2.step=false;
										}
										}
										else if(action=="punch")
										{
											playerData2.attack="punch";
										}
										else if(action=="kick")
										{
											playerData2.attack="kick";
										}
										else if(action=="special")
										{
											playerData2.attack="special";
										}
										else if(action=="block")
										{
											playerData2.attack="block";
										}
										else if(action=="down")
										{
											playerData2.crouch=true;
											if(playerData2.y==300)
											{
												playerData2.y=330;
											}
										}
										else if(action=="up")
										{
											playerData2.jump=true;
											if(playerData2.y==300)
											{
												playerData2.y=250;
											}
										}
										if(-30<=(playerData1.x-playerData2.x)&&(playerData1.x-playerData2.x)<=30)
										{
											if(playerData1.attack!="null"&&playerData1.attack!="block"&&playerData2.attack!="block")
											{
												playerData2.hp-=5;
											}
											else if(playerData2.attack!="null"&&playerData2.attack!="block"&&playerData1.attack!="block")
											{
												playerData1.hp-=5;
											}
										}
										if(playerData1.hp==0)
										{
										sockets[receiver].emit('over','player2 win');
										sockets[socket.name].emit('over','player2 win');
										}
										else if(playerData2.hp==0)
										{
										sockets[receiver].emit('over','player1 win');
										sockets[socket.name].emit('over','player1 win');
										}
										sockets[receiver].emit('game',playerData1,playerData2);
										sockets[socket.name].emit('game',playerData1,playerData2);
									});
									sockets[socket.name].on('game',function(action){
										if(action=="stop")
										{
											playerData1.step=false;
											playerData1.crouch=false;
											playerData1.jump=false;
											playerData1.attack="null";
											playerData1.y=300;
										}
										else if(action=="left")
										{
										playerData1.direction="left";
										playerData1.x-=5;
										if(playerData1.x%2==0)
										{
											playerData1.step=true;
										}
										else{
											playerData1.step=false;
										}
										}
										else if(action=="right")
										{
										playerData1.direction="right";
										playerData1.x+=5;
										if(playerData1.x%2==0)
										{
											playerData1.step=true;
										}
										else{
											playerData1.step=false;
										}
										}
										else if(action=="punch")
										{
											playerData1.attack="punch";
										}
										else if(action=="kick")
										{
											playerData1.attack="kick";
										}
										else if(action=="special")
										{
											playerData1.attack="special";
										}
										else if(action=="block")
										{
											playerData1.attack="block";
										}
										else if(action=="down")
										{
											playerData1.crouch=true;
											if(playerData1.y==300)
											{
												playerData1.y=330;
											}
										}
										else if(action=="up")
										{
											playerData1.jump=true;
											if(playerData1.y==300)
											{
												playerData1.y=250;
											}
										}
										if(-30<=(playerData1.x-playerData2.x)&&(playerData1.x-playerData2.x)<=30)
										{
											if(playerData1.attack!="null"&&playerData1.attack!="block"&&playerData2.attack!="block")
											{
												playerData2.hp-=5;
											}
											else if(playerData2.attack!="null"&&playerData2.attack!="block"&&playerData1.attack!="block")
											{
												playerData1.hp-=5;
											}
										}
										if(playerData1.hp==0)
										{
										sockets[receiver].emit('over','player2 win');
										sockets[socket.name].emit('over','player2 win');
										}
										else if(playerData2.hp==0)
										{
										sockets[receiver].emit('over','player1 win');
										sockets[socket.name].emit('over','player1 win');
										}
										sockets[receiver].emit('game',playerData1,playerData2);
										sockets[socket.name].emit('game',playerData1,playerData2);
									});
								}
								else{
									
								}
							});
							}
	});
socket.on('disconnect',function(){

});
});

app.listen(3000);
http.listen(4000);
module.exports = app;
