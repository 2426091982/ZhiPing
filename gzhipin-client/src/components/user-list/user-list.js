/* 
  显示指定用户列表的UI组件
*/
import React, { Component } from "react";
// prop类型验证
import PropTypes from "prop-type";

// antd框架
import { Card, WingBlank, WhiteSpace } from "antd-mobile";

import { withRouter } from "react-router-dom";

// 进出场动画
import QueueAnim from "rc-queue-anim";

const Header = Card.Header;
const Body = Card.Body;

class UserList extends Component {
  static propsTypes = {
    userList: PropTypes.isRequired,
  };
  state = {};
  render() {
    // 获取userList
    const { userList } = this.props;
    return (
      <div>
        <WingBlank style={{ marginBottom: 60, marginTop: 50 }}>
          <QueueAnim type="scale" delay={100}>
            {userList.map((user) => (
              <div key={user._id}>
                <WhiteSpace />
                <Card
                  onClick={() => {
                    this.props.history.push(`/chat/${user._id}`);
                  }}
                >
                  <Header
                    thumb={require(`../../assets/images/${user.header}.png`)}
                    extra={user.username}
                  ></Header>
                  <Body>
                    <div>职位:{user.post}</div>
                    {user.company ? <div>公司:{user.company}</div> : null}
                    {user.salary ? <div>月薪:{user.salary}</div> : null}
                    <div>描述:{user.info}</div>
                  </Body>
                </Card>
              </div>
            ))}
          </QueueAnim>
        </WingBlank>
      </div>
    );
  }
}

export default withRouter(UserList);
