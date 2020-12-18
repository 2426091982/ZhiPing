const {ChatModel} = require("../db/models");

module.exports = function (server) {
  const io = require("socket.io")(server);
  // 监视客户端与服务器的连接
  io.on("connection", function (socket) {
    console.log("有一个客户端连接上了服务器");

    // 绑定监听，接收客户端发送的消息
    socket.on("sendMsg", function ({ from, to, content }) {
      console.log("服务器接收客户端发送的消息", { from, to, content });

      // 处理数据(保存消息)
      // 准备chatMsg对象的相关数据
      // from_to 或者 to_from
      const chat_id = [from, to].sort().join("_");
      // 创建时间
      const create_time = Date.now();
      new ChatModel({ from, to, content, chat_id, create_time }).save(
        (err, chatMsg) => {
          // 向所有连接上的客户端发消息,包含目标和我
          io.emit("receiveMsg", chatMsg);
        }
      );
    });
  });
};
