var express = require("express");
var router = express.Router();

// 导入
const md5 = require("blueimp-md5");

// 导入 UserModel 构造函数
const { UserModel, ChatModel } = require("../db/models");

//需要过滤的属性
const filter = {
  password: 0,
  __v: 0,
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* 
  提供一个用户注册的接口
  a) path 为: /register
  b) 请求方式为: POST
  c) 接收 username 和 password 参数
  d) admin 是已注册用户
  e) 注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
  f) 注册失败返回: {code: 1, msg: '此用户已存在'}
*/

// 注册的路由
router.post("/register", (req, res) => {
  // 从 req.body获取post参数, (前提使用body-parser中间件)
  const { username, password, type } = req.body;
  console.log(username, password, type);
  // 处理： 判断用户是否已经存在，如果存在，返回提示错误的信息，如果不存在，保存到数据库(注册)
  // 查询：(根据 username 来查询)
  UserModel.findOne({ username }, (err, userDoc) => {
    if (userDoc) {
      // 注册失败，已经拥有此用户
      res.send({ code: 1, msg: "注册失败，此用户已经存在" });
    } else {
      // 保存到数据库
      new UserModel({ username, type, password: md5(password) }).save(
        (err, user) => {
          // 生成一个 cookie(userid:user._id) 并交给浏览器保存
          res.cookie("userid", user._id, { maxAge: 1000 * 60 * 60 * 24 });
          // 返回包含 user 的 json数据
          let data = { username, type, _id: user._id };
          // 响应数据中不要携带 password
          res.send({ code: 0, data });
        }
      );
    }
  });
});

// 登录的路由
router.post("/login", (req, res) => {
  const { username, password, type } = req.body;

  // 在数据库查找是否有该数据
  UserModel.findOne(
    { username, password: md5(password) },
    filter,
    (err, user) => {
      if (user) {
        // 有数据，登录成功
        // 生成一个 cookie(userid:user._id) 并交给浏览器保存
        res.cookie("userid", user._id, { maxAge: 1000 * 60 * 60 * 24 });
        // 返回登录成功信息(包含user)
        res.send({ code: 0, msg: "登录成功!", data: user });
      } else {
        // 没有数据，登录失败
        res.send({ err, code: 1, msg: "用户名或密码不正确" });
      }
    }
  );
});

// 更新用户信息的路由
router.post("/update", (req, res) => {
  // 获取 cookie
  let userid = req.cookies.userid;
  // 检查是否登录 有 cookie
  if (!userid) {
    return res.send({ code: 1, msg: "请先登录" });
  }

  // 得到提交的用户数据
  const user = req.body;
  // 存在，根据userid 更新对应的 user文档数据
  UserModel.findByIdAndUpdate({ _id: userid }, user, (err, oldUser) => {
    if (!oldUser) {
      // 通知浏览器删除 userid cookie
      res.clearCookie("userid");
      // 返回一个提示信息
      res.send({ code: 1, msg: "请先登录" });
    } else {
      // 准备一个返回的user数据对象
      const { _id, username, type } = oldUser;
      // 合并对象
      const data = Object.assign({ _id, username, type }, user);
      res.send({ code: 0, data });
    }
  });
});

// 获取用户信息的路由(根据cookie中的userid)
router.get("/user", (req, res) => {
  // 从请求的cookie得到userid
  const userid = req.cookies.userid;
  // 如果不存在，直接返回一个提示信息
  if (!userid) {
    return res.send({ code: 1, msg: "请先登录" });
  }
  // 根据userid查询对应的user
  UserModel.findOne({ _id: userid }, filter, (error, user) => {
    res.send({ code: 0, data: user });
  });
});

// 获取用户列表
router.get("/userlist", (req, res) => {
  const { type } = req.query;
  // 查找，并且过滤密码
  UserModel.find({ type }, filter, (err, users) => {
    // 如果有数据，就返回
    res.send({ code: 0, data: users });
  });
});

/*获取当前用户所有相关聊天信息列表
 */
router.get("/msglist", function (req, res) {
  // 获取 cookie 中的 userid
  const userid = req.cookies.userid;
  // 查询得到所有 user 文档数组
  UserModel.find(function (err, userDocs) {
    // 用对象存储所有 user 信息: key 为 user 的_id, val 为 name 和 header 组成的 user 对象
    // const users = {}; // 对象容器
    /* userDocs.forEach((doc) => {
      users[doc._id] = { username: doc.username, header: doc.header };
    }); */

    const users = userDocs.reduce((users, user) => {
      users[user._id] = { username: user.username, header: user.header };
      return users;
    }, {});
    /*查询 userid 相关的所有聊天信息
参数 1: 查询条件
参数 2: 过滤条件
参数 3: 回调函数
*/
    ChatModel.find(
      { $or: [{ from: userid }, { to: userid }] },
      filter,
      function (err, chatMsgs) {
        // 返回包含所有用户和当前用户相关的所有聊天消息的数据
        res.send({ code: 0, data: { users, chatMsgs } });
      }
    );
  });
});
/*修改指定消息为已读
 */
router.post("/readmsg", function (req, res) {
  // 得到请求中的 from 和 to
  const from = req.body.from;
  const to = req.cookies.userid;

  /*更新数据库中的 chat 数据
参数 1: 查询条件
参数 2: 更新为指定的数据对象
参数 3: 是否 1 次更新多条, 默认只更新一条
参数 4: 更新完成的回调函数
*/
  ChatModel.update(
    { from, to, read: false },
    { read: true },
    { multi: true },
    function (err, doc) {
      console.log("/readmsg", doc);
      res.send({ code: 0, data: doc.nModified }); // 更新的数量
    }
  );
});

module.exports = router;
