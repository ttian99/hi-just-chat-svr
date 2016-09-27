var Base = require('../user-model.js');
// var cfg = require('../../../cfg.js');
// var log = cfg.log('login');

module.exports = function login(body, resCb) {
	console.log('-------- start ---------');
	var username = body.username;
	Base.findOne({
		username: username
	}, function(err, doc) {
		if (err) {
			console.log('------ there is some err = ' + err.stack);
			// resCb(err);
			resCb({code: -2, msg: 'find db error'});
		} else {
			doc ? userExist(body, doc, resCb) : createNewUser(body, resCb);
		}
	});
};


function userExist(body, doc, cb) {
	console.log('------ userExist ----------');
	// doc.lastLoginTime = new Date();
	console.log('the doc : ' + JSON.stringify(doc));
	var ret = {};
	if (body.pwd === doc.pwd) {
		ret = {code: 0, msg: 'success'};
	} else {
		ret = {code: -1, msg: 'username or password error'}
	}
	// doc.save();
	cb(ret);
}

function createNewUser(body, cb) {
	console.log('--------- createNewUser -------');
	var doc = new Base({
		username: body.username,
		pwd: body.pwd,
	});
	doc.save();
	console.log('-------- over ---------');
	cb({code: 0, msg: 'success'});
}