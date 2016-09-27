var express = require('express');
var router = express.Router();
// var cfg = require('../../cfg.js');
// var log = cfg.log('api-router');
var glob = require('glob-all');
var path = require('path');
var moment = require('moment');
var _ = require('lodash');

var cmds = {};

// var pathname = __dirname + '/../api/**/*.js';
var pathname = __dirname + '/../api/*.js';
console.log('pathname = ' + pathname);

// 遍历对应的协议文件
var path = require('path');
var files = glob.sync(pathname);
files.forEach(function(file) {
  var extname = path.extname(file);
  var basename = path.basename(file, extname);
  cmds[basename] = require(file);
  console.log('register api: ' + basename);
});

// post请求
router.post('/', function(req, res) {
  console.log('-- post --');
  var body = req.body;
  routerToCmd(body, res);
});

// get请求
router.get('/', function(req, res) {
  console.log('-- get --');
  var body = req.query;
  routerToCmd(body, res);
});

// 路由到对应api文件
function routerToCmd(body, res) {
  console.log('body = ' + JSON.stringify(body));
  if (body && body.cmd && cmds[body.cmd]) {
    var begTime = moment();
    cmds[body.cmd](body, function(rst) {
      var svrSpendTime = (moment().valueOf() - begTime.valueOf());
      if (svrSpendTime >= 2000) {
        // console.log(body, 'svrSpendTime', svrSpendTime);
      }
      res.json(_.merge(rst, {
        svrSpendTime: svrSpendTime
      }));
    });
  } else {
    console.log('unknown cmd');
    // res.json(cfg.rst.UNKNOWN_CMD);
  }
}

module.exports = router;