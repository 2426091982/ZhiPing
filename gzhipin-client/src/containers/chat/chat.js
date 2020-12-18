import React, { Component } from "react";
import { NavBar, List, InputItem, Grid, Icon } from "antd-mobile";
import { connect } from "react-redux";
import { sendMsg, readMsg } from "../../redux/actions";
// 进出场动画
import QueueAnim from "rc-queue-anim";

const Item = List.Item;
class Chat extends Component {
  state = {
    content: "", // 要发送的内容
    isShow: false, // 是否显示表情列表
  };

  // 在第一次render()之前回调
  componentWillMount() {
    // 初始化表情列表数据
    const emojis = [
      "😀",
      "😁",
      "😂",
      "😃",
      "😄",
      "😅",
      "😆",
      "😉",
      "😊",
      "😋",
      "😎",
      "😍",
      "😘",
      "😗",
      "😙",
      "😚",
      "😇",
      "😐",
      "😑",
      "😶",
      "😏",
      "😣",
      "😥",
      "😮",
      "😯",
      "😪",
      "😫",
      "😴",
      "😌",
      "😛",
      "😜",
      "😝",
      "😒",
      "😓",
      "😔",
      "😕",
      "😲",
      "😷",
      "😖",
      "😞",
      "😟",
      "😤",
      "😢",
      "😭",
      "😦",
      "😧",
      "😨",
      "😬",
      "😰",
      "😱",
      "😳",
      "😵",
      "😡",
      "😠",
    ];
    this.emojis = emojis.map((emoji) => ({ text: emoji }));
    // 初始化显示列表
    window.scrollTo(0, document.body.scrollHeight);
  }

  componentWillUnmount() {
    // 在退出之前
    // 发请求更新消息的未读状态
    const from = this.props.match.params.userid;
    const to = this.props.user._id;
    this.props.readMsg(from, to);
  }

  componentDidUpdate() {
    // 更新显示列表
    window.scrollTo(0, document.body.scrollHeight);
  }

  // 点击发送消息
  handleSend = () => {
    // 收集数据
    // 我的id
    const from = this.props.user._id;
    // 要发送的id
    const to = this.props.match.params.userid;
    // 发送内容
    const content = this.state.content.trim();
    // 发送请求(发消息)
    if (content) {
      this.props.sendMsg({ from, to, content });
      // 清除输入数据
      this.setState({ content: "", isShow: false });
    }
  };

  // 显示隐藏表情组件
  toggleShow = () => {
    // 取反
    const isShow = !this.state.isShow;

    // 设置值
    this.setState({
      isShow,
    });

    // 如果显示
    if (isShow) {
      // 异步手动派发 resize 事件,解决表情列表显示的 bug
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 0);
    }
  };
  render() {
    const { user } = this.props;
    const { users, chatMsgs } = this.props.chat;

    // 计算当前聊天的chatId
    const meId = user._id;
    if (!users[meId]) {
      // 如果还没有获取数据，直接不做任何显示
      return null;
    }
    const targetId = this.props.match.params.userid;
    const chatId = [meId, targetId].sort().join("_");

    // 对chatMsgs 进行过滤
    const msgs = chatMsgs.filter((msg) => msg.chat_id === chatId);

    // 得到目标用户的header图片对像
    const targetHeader = users[targetId].header;
    const targetIcon = targetHeader
      ? require(`../../assets/images/${targetHeader}.png`)
      : null;

    return (
      <div id="chat-page">
        <NavBar
          onLeftClick={() => {
            // 返回上一层路由
            this.props.history.goBack();
          }}
          icon={<Icon type="left"></Icon>}
          className="sticky-header"
        >
          {users[targetId].username}
        </NavBar>
        <List style={{ marginTop: 50, marginBottom: 50 }}>
          <QueueAnim type="scale" delay={100}>
            {msgs.map((msg) => {
              if (targetId === msg.from) {
                // 对方发给我的
                return (
                  <Item key={msg._id} thumb={targetIcon}>
                    {msg.content}
                  </Item>
                );
              } else {
                // 我发给对方
                return (
                  <Item key={msg._id} className="chat-me" extra="我">
                    {msg.content}
                  </Item>
                );
              }
            })}
          </QueueAnim>
        </List>
        <div className="am-tab-bar">
          <InputItem
            placeholder="请输入"
            onChange={(val) => this.setState({ content: val })}
            onFocus={() => {
              this.setState({ isShow: false });
            }}
            value={this.state.content}
            extra={
              <span>
                <span style={{ marginRight: 5 }} onClick={this.toggleShow}>
                  😁
                </span>
                <span onClick={this.handleSend}>发送</span>
              </span>
            }
          />
          {this.state.isShow ? (
            <Grid
              data={this.emojis}
              columnNum={8}
              carouselMaxRow={4}
              isCarousel={true}
              onClick={(item) => {
                this.setState({ content: (this.state.content += item.text) });
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default connect((state) => ({ user: state.user, chat: state.chat }), {
  sendMsg,
  readMsg,
})(Chat);
