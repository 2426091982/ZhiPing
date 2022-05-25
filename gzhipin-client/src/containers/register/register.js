/* 注册路由组件 */

import React, { Component } from "react";

// antd 组件
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Radio,
  Button,
} from "antd-mobile";
// 导入 Logo组件
import Logo from "../../components/logo/logo";
// 导入 connect 组件
import { connect } from "react-redux";
// 导入 register 异步action
import { register } from "../../redux/actions";
// 导入 Redirect 重定向组件
import { Redirect } from "react-router-dom";
const ListItem = List.Item;

// 注册组件
class Register extends Component {
  state = {
    username: "",
    password: "",
    // 确认密码
    confirmPassword: "",
    // 用户类型 大神 dashen  /  老板 laoban
    type: "dashen",
  };
  // 处理输入数据的改变，更新对应的状态
  handleChange = (typeState, val) => {
    // 改变setState状态
    this.setState({
      [typeState]: val, // 属性名不是 typeState ,而是 typeState 变量的值
    });
  };

  // 点击注册调用
  register = () => {
    // console.log(this.state);
    this.props.register(this.state);
  };

  // 跳转页面 path 路径
  hrefPath = (path) => {
    this.props.history.push(path);
  };

  render() {
    const {
      username,
      password,
      // 确认密码
      confirmPassword,
      // 用户类型 大神 dashen  /  老板 laoban
      type,
    } = this.state;

    // 结构 store
    const { msg, redirectTo } = this.props.user;
    // 如果 redirectTo 有值,就需要重定向到指定的路由
    if (redirectTo) {
      // 重定向路由
      return <Redirect to={redirectTo}></Redirect>;
    }

    return (
      <div>
        {/*  Nav组件 */}
        <NavBar className="navBar">企&nbsp;业&nbsp;直&nbsp;聘</NavBar>
        {/* 上下留白 */}
        <WhiteSpace size="xl" />
        {/* Logo组件 */}
        <Logo></Logo>
        {/* 上下留白 */}
        <WhiteSpace size="xl" />
        {/* 左右留白 */}
        <WingBlank>
          {msg ? <div className="error-msg">{msg}</div> : null}
          {/* 上下留白 */}
          <WhiteSpace size="xl" />
          <List>
            <InputItem
              clear
              type="text"
              onChange={(val) => {
                this.handleChange("username", val);
              }}
              placeholder="请输入用户名"
            >
              用户名:
            </InputItem>
            <InputItem
              clear
              type="password"
              onChange={(val) => {
                this.handleChange("password", val);
              }}
              placeholder="请输入密码"
            >
              密&nbsp;&nbsp;&nbsp;码:
            </InputItem>
            <InputItem
              clear
              type="password"
              onChange={(val) => {
                this.handleChange("confirmPassword", val);
              }}
              placeholder="请输入确认密码"
            >
              确认密码:
            </InputItem>
          </List>
          <ListItem>
            <span>用户类型：</span>
            &nbsp;&nbsp;&nbsp;
            <Radio
              checked={type === "dashen"}
              onChange={() => {
                this.handleChange("type", "dashen");
              }}
            >
              大神
            </Radio>
            &nbsp;&nbsp;&nbsp;
            <Radio
              checked={type === "laoban"}
              onChange={() => {
                this.handleChange("type", "laoban");
              }}
            >
              老板
            </Radio>
          </ListItem>
          {/* 上下留白 */}
          <WhiteSpace size="xl" />
          <Button type="primary" onClick={this.register}>
            注册
          </Button>
          {/* 上下留白 */}
          <WhiteSpace size="md" />
          <Button
            onClick={() => {
              this.hrefPath("login");
            }}
          >
            已有账户
          </Button>
        </WingBlank>
      </div>
    );
  }
}

export default connect((state) => ({ user: state.user }), { register })(
  Register
);
