/* 
  大神信息完善的路由容器组件
*/

import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { NavBar, InputItem, Button, TextareaItem } from "antd-mobile";
import HeaderSelector from "../../components/header-selector/header-selector.js";
// 导入异步action
import { updateUser } from "../../redux/actions";

// 大神组件
class DashenInfo extends Component {
  state = {
    header: "", // 头像名称
    post: "", // 职位
    info: "", // 个人或职位要求
  };
  handleChange = (name, val) => {
    this.setState({
      [name]: val,
    });
  };

  // 保存 state
  save = () => {
    this.props.updateUser(this.state);
  };
  // 更新 header 状态
  setHeader = (header) => {
    this.setState({
      header,
    });
  };
  render() {
    const { header, type } = this.props.user;
    if (header) {
      // 说明信息已经完善,自动重定向到对应的主界面
      const path = type === "dashen" ? "/dashen" : "/laoban";
      return <Redirect to={path}></Redirect>;
    }
    return (
      <div>
        <NavBar>大神信息完善</NavBar>
        <HeaderSelector setHeader={this.setHeader}></HeaderSelector>
        <InputItem
          placeholder="请输入求职岗位"
          onChange={(val) => {
            this.handleChange("post", val);
          }}
        >
          求职岗位:
        </InputItem>
        <TextareaItem
          placeholder="请输入个人介绍"
          title="个人介绍:"
          rows={3}
          onChange={(val) => {
            this.handleChange("info", val);
          }}
        />

        <Button type="primary" onClick={this.save}>
          保&nbsp;&nbsp;&nbsp;存
        </Button>
      </div>
    );
  }
}

export default connect((state) => ({ user: state.user }), {updateUser})(DashenInfo);
