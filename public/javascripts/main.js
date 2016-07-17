var socket = io.connect('ws://localhost:4000');
var isPlaying=false;
var player={
	name: document.getElementById('playername').value,
	password: document.getElementById('password').value
}
socket.emit('userlogin',player);
socket.on('showusers',function(onlineUsers,onlineCount){
	var div=document.getElementById('ladder-area');
	var content="";
	for(i=0;i<onlineCount;i++)
	{
		// '"+onlineUsers[i]+"'
	content+="<section>"+"<a href=\"javascript:startAGame()\">"+onlineUsers[i]+"</a>"+"</section>";
	}
	div.innerHTML=content;
	});
socket.on('showmessage',function(message){
	var div=document.getElementById('message-pool');
	var section=document.createElement('section');
	section.innerHTML=message.player+":"+message.body;
	div.appendChild(section);
	document.getElementById('my-message').value="";
	});

socket.on('apply-send',function(applicant)
{
		if(isPlaying==false)
		{
			var div=document.getElementById('message-apply');
			div.innerHTML=applicant+" wants to play with you <a href=\"javascript:choose('"+applicant+"',true)\">accept</a>  <a href=\"javascript:choose('"+applicant+"',false)\">refuse</a>";
		}
});
	
function sendMessage()
{
	var message={
		player: document.getElementById('playername').value,
		body: document.getElementById('my-message').value
	};
	this.socket.emit('send',message);
}

function startAGame(receiver)
{
	gameover = false;
	life1.score = 100;
	life2.score = 100;
	document.getElementById("myCanvas").style.visibility = "visible";
	run();
}
