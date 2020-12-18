/* 
  消息主界面路由容器组件
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { List, Badge } from "antd-mobile";
const Item = List.Item;
const Brief = Item.Brief;

/* 
  对chatMsgs按chat_id进行分组，并得到每个组的lastMsg组成的数组
  
*/
function getLastMsgs(chatMsgs, userid) {
  // 1. 找出每个聊天的lastMsg,并用一个对象容器来保存{chat_id,// lastMsg}
  let lastMsgObjs = {};
  console.log(chatMsgs);
  chatMsgs.forEach((msg) => {
    // 对msg进行个体的统计
    if (msg.to === userid && !msg.read) {
      msg.unReadCount = 1;
    } else {
      msg.unReadCount = 0;
    }

    // 得到msg的聊天标识id
    const chatId = msg.chat_id;
    // 获取已保存的当前组件的lastMsg
    let lastMsg = lastMsgObjs[chatId];
    // 没有
    if (!lastMsg) {
      // 当前msg就是所在组的lastMsg
      lastMsgObjs[chatId] = msg;
      //  没有
    } else {
      // 有
      // 保存已经统计的未读数量
      const unReadCount = lastMsg.unReadCount + msg.unReadCount;
      // 如果msg比lastMsg晚,就将msg保存为lastMsg
      if (msg.create_time > lastMsg.create_time) {
        lastMsgObjs[chatId] = msg;
      }
      // 累加 unReadCount 并保存为lastMsg上
      lastMsgObjs[chatId].unReadCount = unReadCount;
    }
  });
  // 2. 得到所有lastMsg的数组
  const lastMsgs = Object.values(lastMsgObjs);
  // 3. 对数组进行排序(按create_time降序)
  lastMsgs.sort(function (m1, m2) {
    // 如果结果<0,将m1放在前面，如果结果为0，不变，如果结果>0,m2前面
    return m2.create_time - m1.create_time;
  });

  // 返回lastMsgs
  return lastMsgs;
}

// 消息组件
class Message extends Component {
  state = {};
  render() {
    const { user } = this.props;
    const { users, chatMsgs } = this.props.chat;

    // 对chatMsgs 按chat_id进行分组
    const lastMsgs = getLastMsgs(chatMsgs, user._id);
    return (
      <List style={{ marginTop: 50, marginBottom: 50 }}>
        {lastMsgs.map((msg) => {
          // 得到目标用户的id
          let targetUserId = msg.to === user._id ? msg.from : msg.to;
          // 得到目标用户的信息
          const targetUser = users[targetUserId];
          return (
            <Item
              onClick={() => {
                this.props.history.push(`/chat/${targetUserId}`);
              }}
              key={targetUser._id}
              extra={<Badge text={msg.unReadCount} />}
              thumb={
                targetUser.header
                  ? require(`../../assets/images/${targetUser.header}.png`)
                  : null
              }
              arrow="horizontal"
            >
              {targetUser.username}
              <Brief> {msg.content}</Brief>
            </Item>
          );
        })}
      </List>
    );
  }
}

export default connect(
  (state) => ({ user: state.user, chat: state.chat }),
  {}
)(Message);
