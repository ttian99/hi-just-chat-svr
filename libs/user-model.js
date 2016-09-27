var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mToObject = require('mongoose-toobject');

// 用户信息
var baseSchema = new Schema({
  createTime: { type: Date, default: Date.now },  // 创建时间
  uid: {type: String, unique: true}, // 用户唯一标示
  username: String, // 昵称(可选)
  pwd: String, // 密码
  face: String,  // 头像(可选)
  color: String, // 颜色(可选)
  // isGirl: Boolean, // 性别(可选)
  // lvl: Number, // 权限等级

  // 上一次登陆时间
  // lastLoginTime: { type: Date, default: Date.now },
});
baseSchema.plugin(mToObject, { hide: '__v' });
baseSchema.index({
  createTime: 1
});


module.exports = mongoose.model('Base', baseSchema);