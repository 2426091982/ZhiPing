/* 
  包含n个action creator
  异步action
  同步action
*/

// 导入 socket.io
import io from "socket.io-client";

// 导入 action-types
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  MSG_READ,
} from "./action-types";

// axios
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqChatMsgList,
  reqReadMsg,
} from "../api/index.js";

/* 单例对象
 */

// 初始化io
function initIo(dispatch, userid) {
  // 1. 创建对象之前: 判断对象是否已经存在，只有不存在创建才去创建
  if (!io.socket) {
    // 1.连接服务器,得到与服务器的连接对象
    io.socket = io("ws://localhost:3000"); //2. 创建对象之后: 保存对象
    // 绑定监听，接收服务器发送的消息
    io.socket.on("receiveMsg", function (chatMsg) {
      console.log("客户端接收服务器端发送的数据", chatMsg);
      // 只有当chatMsg是与当前用户相关的消息，才去分发同步action保存消息
      if (userid === chatMsg.from || userid === chatMsg.to) {
        dispatch(receiveMsg(chatMsg, userid));
      }
    });
  }
}

// 异步获取消息列表数据 (在注册，登录，自动登录时调用)
async function getMsgList(dispatch, userid) {
  // 初始化io
  initIo(dispatch, userid);
  const response = await reqChatMsgList();
  const result = response.data;
  if (result.code === 0) {
    const { users, chatMsgs } = result.data;
    // 分发同步action
    dispatch(receiveMsgList({ users, chatMsgs, userid }));
  }
}

// 发送消息的异步action
export const sendMsg = ({ from, to, content }) => {
  return (dispatch) => {
    console.log("客户端向服务器发消息", { from, to, content });
    // 发消息
    io.socket.emit("sendMsg", { from, to, content });
  };
};

// 读取消息的异步action
export const readMsg = (from, to) => {
  return async (dispatch) => {
    let response = await reqReadMsg(from);
    let result = response.data;
    if (result.code === 0) {
      const count = result.data;
      dispatch(msgRead({ count, from, to }));
    }
  };
};

// 授权成功的同步action
const authSuccess = (user) => ({ type: AUTH_SUCCESS, data: user });
// 错误提示信息的同步action
const errorMsg = (msg) => ({ type: ERROR_MSG, data: msg });
// 接收用户的同步action
const receiveUser = (user) => ({ type: RECEIVE_USER, data: user });
// 重置用户的同步action
export const resetUser = (msg) => ({ type: RESET_USER, data: msg });

// 接收用户列表的同步action
const receiveUserList = (userList) => ({
  type: RECEIVE_USER_LIST,
  data: userList,
});

// 接收消息列表的同步action
export const receiveMsgList = ({ users, chatMsgs, userid }) => ({
  type: RECEIVE_MSG_LIST,
  data: { users, chatMsgs, userid },
});

// 接收一个消息的同步action
const receiveMsg = (chatMsg, userid) => ({
  type: RECEIVE_MSG,
  data: { chatMsg, userid },
});

// 读取了某个聊天消息的同步action
const msgRead = ({ count, from, to }) => ({
  type: MSG_READ,
  data: { count, from, to },
});

// 注册异步 action
export const register = (user) => {
  // 获取值
  const { username, password, confirmPassword, type } = user;
  // 做表单的前台检查，如果不通过，返回一个 errorMsg 的同步 action
  if (!username) {
    // 发送 action
    return errorMsg("用户名必须指定");
  } else if (password !== confirmPassword) {
    // 发送 action
    return errorMsg("两次密码要一致");
  }

  // 表单数据合法，返回一个发 ajax 请求的异步 action 函数
  return async (dispatch) => {
    // 请求注册接口
    const response = await reqRegister({ username, password, type });
    // 获取 data
    const res = response.data; // {code:0/1,data:user,msg:''}

    if (res.code === 0) {
      // 获取关于用户的消息
      getMsgList(dispatch, res.data._id);
      // 授权成功的同步 action
      dispatch(authSuccess(res.data));
    } else {
      // 分发错误提示信息的同步action
      dispatch(errorMsg(res.msg));
    }
  };
};

// 登录异步 action
export const login = (user) => {
  // 获取值
  const { username, password } = user;
  // 做表单的前台检查，如果不通过，返回一个 errorMsg 的同步 action
  if (!username) {
    // 发送 action
    return errorMsg("用户名必须指定");
  } else if (!password) {
    // 发送 action
    return errorMsg("密码必须一致");
  }
  return async (dispatch) => {
    // 请求登录接口
    const response = await reqLogin({ username, password });
    // 获取data
    const res = response.data; // {code:0/1,data:user,msg:''}

    if (res.code === 0) {
      // 获取关于用户的消息
      getMsgList(dispatch, res.data._id);
      // 授权成功的同步 action
      dispatch(authSuccess(res.data));
    } else {
      // 分发错误提示信息的同步action
      dispatch(errorMsg(res.msg));
    }
  };
};

// 更新异步 action
export const updateUser = (user) => {
  return async (dispatch) => {
    const response = await reqUpdateUser(user);
    const result = response.data;
    if (result.code === 0) {
      // 更新成功: data
      dispatch(receiveUser(result.data));
    } else {
      // 更新失败:msg
      dispatch(resetUser(result.msg));
    }
  };
};

// 获取用户异步action
export const getUser = () => {
  return async (dispatch) => {
    // 执行异步ajax请求
    const response = await reqUser();
    // 获取数据
    const result = response.data;
    if (result.code === 0) {
      // 获取关于用户的消息
      getMsgList(dispatch, result.data._id);
      // 成功获取数据
      dispatch(receiveUser(result.data));
    } else {
      // 失败
      dispatch(resetUser(result.msg));
    }
  };
};

// 获取用户列表异步action
export const getUserList = (type) => {
  return async (dispatch) => {
    // 获取数据
    const response = await reqUserList(type);
    const result = response.data;
    if (result.code === 0) {
      // 分发同步action
      // result.data是数组
      dispatch(receiveUserList(result.data));
    }
  };
};
