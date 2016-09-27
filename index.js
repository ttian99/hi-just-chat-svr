var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var Base = require('./libs/user-model.js');


// app.get('/', function(req, res) {
// 	res.send('<h1> welcome hi-just-chat server</h1>');
// });


var expressUtil = require('./libs/express/init-express.js');
expressUtil.init(app);

// 选择路由
app.use('/', require('./libs/router/api-router.js'));


// 连接mongoDb数据库
var mongoose = require('mongoose');

var mongoInfo = {
	uri: 'mongodb://localhost/chat',
	options: { db: { safe: true } }
}
mongoose.connect(mongoInfo.uri, mongoInfo.options, function(err) {
	if (err)
		console.log(err.stack);
	console.log('dbtype: mongo | uri: ' + mongoInfo.uri);
});

var onlineUsers = {}; // 在线用户
var onlineCount = 0; //在线人数
var histList = [];  // 历史记录（暂时不用）

io.on('connection', function(socket) {
	console.log('a user connected!');

	// 监听登陆
	socket.on('login', function(data) {
		console.log('--------- login -------- ');
		console.log(JSON.stringify(data));
		// console.log("socket = " + JSON.stringify(socket));
		var time = new moment();
		if (!onlineUsers.hasOwnProperty(data.username)) {
			onlineUsers[data.username] = data.username;
			// 在线人数加1
			onlineCount++;
		}
		socket.username = data.username;

		// 广播
		io.emit('login', {
			onlineUsers: onlineUsers,
			onlineCount: onlineCount,
			user: data,
			time: time
		});
		console.log(data.username + '加入了聊天室');
		console.log("-- 当前在线人数(" + onlineCount + " ) : " +　JSON.stringify(onlineUsers) + " --");
	});
	
	// 监听推出接口
	socket.on('disconnect', function(data) {
		console.log('----------- disconnect --------');
		console.log('socket.username =  '+ JSON.stringify(socket.username))
		var time = moment();
		if (onlineUsers.hasOwnProperty(socket.username)) {
			var obj = {
				username: onlineUsers[socket.username]
			};
			//删除
			delete onlineUsers[socket.username];
			//在线人数-1
			onlineCount--;

			//向所有客户端广播用户退出
			io.emit('logout', {
				onlineUsers: onlineUsers,
				onlineCount: onlineCount,
				user: obj,
				time: time,
			});
			console.log(obj.username + '退出了聊天室');
			console.log("-- 当前在线人数(" + onlineCount + " ) : " +　JSON.stringify(onlineUsers) + " --");
		}
	});

	//监听用户发布聊天内容
	socket.on('message', function(data) {
		console.log('-- message : ' + JSON.stringify(data));
		var time = moment();
		//向所有客户端广播发布的消息
		io.emit('message', {
			user: data,
			time: time,
		});
		console.log(data.username + '说：' + data.msg);
	});
});



http.listen(5000, function() {
	console.log('svr is listening at: 5000')
});


function login(socket) {
	socket.on('login', function(data) {
		console.log('--------- login -------- ');
		console.log(JSON.stringify(data));
		console.log("socket = " + JSON.stringify(socket));
		var time = new moment();
		if (!onlineUsers.hasOwnProperty(data.username)) {
			onlineUsers[data.username] = data.username;
			// 在线人数加1
			onlineCount++;
		}
		socket.username = data.username

		// if (!data.uid) {
		// 	var obj = new Base({
		// 		username: data.username,
		// 		// pwd: data.pwd,
		// 	});
		// 	// console.log(JSON.stringify(data));
		// 	obj.uid = obj._id;
		// 	obj.save();
		// } else {
		// 	Base.findOne({"username" : data.username },)
		// }
		// socket.uid = obj.uid;

		// if (!onlineUsers.hasOwnProperty(data.uid)) {
		// 	onlineUsers[data.uid] = data.username;
		// 	// 在线人数加1
		// 	onlineCount++;
		// }

		// 广播
		io.emit('login', {
			onlineUsers: onlineUsers,
			onlineCount: onlineCount,
			user: data,
			time: time
		});
		console.log(data.username + '加入了聊天室');
	});
}

function logout(socket) {
	socket.on('disconnect', function(data) {
		console.log('----------- disconnect --------');
		console.log("data = " + JSON.stringify(data))


		// console.log('socket.uid =  '+ JSON.stringify(socket.uid))
		console.log('socket.username =  '+ JSON.stringify(socket.username))
		// console.log('data.uid =  '+ JSON.stringify(data.uid))
		// console.log('data.username =  '+ JSON.stringify(data.username))
		// console.log('socket =  '+ JSON.stringify(socket))
		var time = moment();
		if (onlineUsers.hasOwnProperty(data.username)) {
			var obj = {
				username: onlineUsers[data.username]
			};
			//删除
			delete onlineUsers[data.username];
			//在线人数-1
			onlineCount--;

			//向所有客户端广播用户退出
			io.emit('logout', {
				onlineUsers: onlineUsers,
				onlineCount: onlineCount,
				user: obj,
				time: time,
			});
			console.log(obj.username + '退出了聊天室');
		}
	});
}

function sendMsg(socket) {
	var time = moment();
	//监听用户发布聊天内容
	socket.on('message', function(data) {
		//向所有客户端广播发布的消息
		io.emit('message', {
			user: data,
			time: time,
		});
		console.log(data.username + '说：' + data.msg);
	});
}