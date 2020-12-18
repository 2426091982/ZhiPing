/* 测试使用mongoose操作 mongodb 数据库 */

// 导入 md5加密
const md5 = require("blueimp-md5");

// 1.1. 引入 mongoose
const mongoose = require("mongoose");
// 1.2. 连接指定数据库(URL 只有数据库是变化的)
mongoose.connect("mongodb://localhost:27017/gzhipin_test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// 1.3. 获取连接对象
let conn = mongoose.connection;
// 1.4 监听连接对象
conn.on("connected", function () {
  // 连接成功回调
  console.log("数据库连接成功,yes!");
});

// 2. 得到对应特定集合的 Model
// 2.1. 字义 Schema(描述文档结构)
const userSchema = mongoose.Schema({
  // 用户名
  username: {
    type: String,
    required: true,
  },
  // 密码
  password: {
    type: String,
    required: true,
  },
  // 用户类型：dashen / laoban
  type: {
    type: String,
    required: true,
  },
  // 用户头像
  header: {
    type: String,
  },
});
// 2.2. 定义 Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model("user", userSchema); // 集合的名称为: users

// 3.1. 通过 Model 实例的 save()添加数据
function testSave() {
  // user数据对象
  let user = {
    username: "Tom",
    password: md5("123456"),
    type: "dashen",
  };

  // 创建 UserModel 的实例
  const userModel = new UserModel(user);

  // 调用 save() 保存到数据库
  userModel.save((err, doc) => {
    console.log("save()", err, doc);
  });
}

// testSave();

// 3.2. 通过 Model 的 find()/findOne()查询多个或一个数据
function testFind() {
  // 查找多个
  UserModel.find({ id: 2 }, (err, users) => {
    // 如果有匹配返回的是 [user,user..] 如果没有一个匹配的返回 []
    console.log("find()", err, users);
  });
  // 查找一个
  UserModel.findOne({ _id: "5fd0a98fec8962a2b03fc54d" }, (err, user) => {
    //  如果有匹配返回的是一个user,如果没有一个匹配的返回 null
    console.log("findOne()", err, user);
  });
}

// testFind();

// 3.3. 通过 Model 的 findByIdAndUpdate()更新某个数据

function testUpdate() {
  // 根据 id 更新某个数据
  UserModel.findByIdAndUpdate(
    { _id: "5fd0a99b75c98d2ebc334346" },
    { username: "yjj" },
    (err, oldUser) => {
      console.log("findByIdAndUpdate()", err, oldUser);
    }
  );
}

// testUpdate();

// 3.4. 通过 Model 的 remove()删除匹配的数据
function testDelete() {
  /// 根据条件删除数据
  UserModel.remove({ _id: "5fd0a9bd6b03618e90326192" }, (err, res) => {
    console.log("remove()", err, res);
  });
}

testDelete();
