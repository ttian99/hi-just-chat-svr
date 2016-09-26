var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.get('/', function(req, res) {
	res.send('<h1> welcome hi-just-chat server</h1>');
});

var onlineUsers = {}; // 在线用户
var onlineCount = 0; //在线人数

io.on('connection', function(socket) {
	console.log('a user connected!');
	login(socket);
	logout(socket);
	sendMsg(socket);
});



http.listen(5000, function() {
	console.log('svr is listening at: 5000')
});


function login(socket) {
	socket.on('login', function(obj) {
		var time = new moment();
		console.log(time);
		socket.name = obj.userid;

		if (!onlineUsers.hasOwnProperty(obj.userid)) {
			onlineUsers[obj.userid] = obj.username;
			// 在线人数加1
			onlineCount++;
		}

		// 广播
		io.emit('login', {
			onlineUsers: onlineUsers,
			onlineCount: onlineCount,
			user: obj,
			time: time
		});
		console.log(obj.username + '加入了聊天室');
	});
}

function logout(socket) {
	socket.on('disconnect', function() {
		var time = moment();
		if (onlineUsers.hasOwnProperty(socket.name)) {
			var obj = {
				userid: socket.name,
				username: onlineUsers[socket.name]
			};
			//删除
			delete onlineUsers[socket.name];
			//在线人数-1
			onlineCount--;

			//向所有客户端广播用户退出
			io.emit('logout', {
				onlineUsers: onlineUsers,
				onlineCount: onlineCount,
				user: obj
			});
			console.log(obj.username + '退出了聊天室');
		}
	});
}

function sendMsg(socket) {
	//监听用户发布聊天内容
	socket.on('message', function(obj) {
		//向所有客户端广播发布的消息
		io.emit('message', obj);
		console.log(obj.username + '说：' + obj.content);
	});
}