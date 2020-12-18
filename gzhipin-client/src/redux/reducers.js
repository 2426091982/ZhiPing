/* 
  包含n个reducer函数：根据老的state和指定的action返回义工新的state
*/
import { combineReducers } from "redux";

// 导入 action-types
import {
  // 授权成功
  AUTH_SUCCESS,
  // 错误提示
  ERROR_MSG,
  // 接收用户
  RECEIVE_USER,
  // 重置用户
  RESET_USER,
  // 接收用户列表
  RECEIVE_USER_LIST,
  // 接收所有相关消息
  RECEIVE_MSG_LIST,
  // 接收到消息
  RECEIVE_MSG,
  // 读了消息
  MSG_READ,
} from "./action-types";

// 导入工具函数
import { getRedirectTo } from "../utils/index";

const initUser = {
  username: "", //用户名
  type: "", // 用户类型 dashen / laoban
  msg: "", // 错误提示信息
  redirectTo: "", // 需要自动重定向的路由路径
};

// 产生 user 状态的 reducer
function user(state = initUser, action) {
  switch (action.type) {
    case AUTH_SUCCESS: // data是 user
      const { type, header } = action.data;
      console.log(action);
      // 返回新的 state
      return { ...action.data, redirectTo: getRedirectTo(type, header) };
    case ERROR_MSG: // data 是 msg
      // 返回新的 state
      return { ...state, msg: action.data };
    case RECEIVE_USER: // data 是 user
      // 返回新的 state
      return action.data;
    case RESET_USER: // data 是 msg
      // 返回新的 state
      return { ...initUser, msg: action.data };
    default:
      return state;
  }
}

const initUserList = [];
// 产生 userlist 状态的reducer
function userList(state = initUserList, action) {
  switch (action.type) {
    case RECEIVE_USER_LIST:
      return action.data;
    default:
      return state;
  }
}

const initChat = {
  users: {}, // 所有用户信息的对象 属性名:userid 属性值是:{username,header}
  chatMsgs: [], // 当前用户所有相关msg的数组
  unReaderCount: 0, // 总的未读数量
};

// 产生聊天状态的reducer
function chat(state = initChat, action) {
  switch (action.type) {
    case RECEIVE_MSG_LIST: // data:{users,chatMsgs}
      const { users, chatMsgs, userid } = action.data;
      return {
        users,
        chatMsgs,
        unReaderCount: chatMsgs.reduce(
          (preTotal, msg) =>
            preTotal + (!msg.read && msg.to === userid ? 1 : 0),
          0
        ),
      };
    case RECEIVE_MSG: // data: chatMsg
      const { chatMsg } = action.data;
      return {
        users: state.users,
        // 合并消息列表
        chatMsgs: [...state.chatMsgs, chatMsg],
        unReaderCount:
          state.unReaderCount +
          (!chatMsg.read && chatMsg.to === action.data.userid ? 1 : 0),
      };
    case MSG_READ:
      const { from, to, count } = action.data;
      // 是否读了msg
      state.chatMsgs.forEach((msg) => {
        if (msg.from === from && msg.to === to && !msg.read) {
          msg.read = true;
        }
      });
      return {
        users: state.users,
        // 合并消息列表
        chatMsgs: state.chatMsgs.map((msg) => {
          if (msg.from === from && msg.to === to && !msg.read) {
            return { ...msg, read: true };
          } else {
            /// 不需要
            return msg;
          }
        }),
        unReaderCount: state.unReaderCount - count,
      };
    default:
      return state;
  }
}

// 改名
export default combineReducers({ user, userList, chat });
// 向外暴露状态的结构： {user: {},userList:{},chat:{}}
