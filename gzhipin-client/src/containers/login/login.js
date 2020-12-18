/* 注册路由组件 */

import React, { Component } from "react";

// antd 组件
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Button,
} from "antd-mobile";

// 导入 connect 组件
import { connect } from "react-redux";
// 导入 register 异步action
import { login } from "../../redux/actions";
// 导入 Redirect 重定向组件
import { Redirect } from "react-router-dom";

// 导入 Logo组件
import Logo from "../../components/logo/logo";

const ListItem = List.Item;

// 登录组件
class Login extends Component {
  state = {
    username: "",
    password: "",
  };
  // 处理输入数据的改变，更新对应的状态
  handleChange = (typeState, val) => {
    // 改变setState状态
    this.setState({
      [typeState]: val, // 属性名不是 typeState,而是typeState变量的值
    });
  };

  // 登录功能
  login = () => {
    this.props.login(this.state);
  };

  // 跳转页面 path 路径
  hrefPath = (path) => {
    this.props.history.push(path);
  };

  render() {
    const { username, password } = this.state;

    // 结构 store
    const { msg, redirectTo } = this.props.user;
    // 如果 redirectTo 有值,就需要重定向到指定的路由
    if (redirectTo) {
      return <Redirect to={redirectTo}></Redirect>;
    }
    return (
      <div>
        {/*  Nav组件 */}
        <NavBar className="navBar">奥&nbsp;力&nbsp;给&nbsp;直&nbsp;聘</NavBar>
        {/* 上下留白 */}
        <WhiteSpace size="xl" />
        {/* Logo组件 */}
        <Logo></Logo>
        {/* 上下留白 */}
        <WhiteSpace size="xl" />
        {/* 左右留白 */}
        <WingBlank>
          <List>
            <InputItem
              clear
              type="text"
              placeholder="请输入用户名"
              onChange={(val) => {
                this.handleChange("username", val);
              }}
            >
              用户名:
            </InputItem>
            <InputItem
              clear
              type="password"
              placeholder="请输入密码"
              onChange={(val) => {
                this.handleChange("password", val);
              }}
            >
              密&nbsp;&nbsp;&nbsp;码:
            </InputItem>
          </List>
          {/* 上下留白 */}
          <WhiteSpace size="xl" />
          <Button type="primary" onClick={this.login}>
            登录
          </Button>
          {/* 上下留白 */}
          <WhiteSpace size="md" />
          <Button
            onClick={() => {
              this.hrefPath("register");
            }}
          >
            还没有账户?
          </Button>
        </WingBlank>
      </div>
    );
  }
}

export default connect((state) => ({ user: state.user }), { login })(Login);
