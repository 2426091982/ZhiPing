/* 
  老板信息完善的路由容器组件
*/

import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { NavBar, InputItem, TextareaItem, Button } from "antd-mobile";
import HeaderSelector from "../../components/header-selector/header-selector.js";

// 导入异步action
import { updateUser } from "../../redux/actions";

// 老板组件
class LaobanInfo extends Component {
  state = {
    header: "", // 头像名称
    post: "", // 职位
    info: "", // 个人或职位要求
    company: "", // 公司名称
    salary: "", // 工资
  };
  handleChange = (name, val) => {
    this.setState({
      [name]: val,
    });
  };

  //
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
        <NavBar>老板信息完善</NavBar>
        {/* 传递函数给 headerSelect组件 */}
        <HeaderSelector setHeader={this.setHeader}></HeaderSelector>
        <InputItem
          clear
          placeholder="请输入招聘职位"
          onChange={(val) => {
            this.handleChange("post", val);
          }}
        >
          招聘职位:
        </InputItem>
        <InputItem
          clear
          placeholder="请输入公司名称"
          onChange={(val) => {
            this.handleChange("company", val);
          }}
        >
          公司名称:
        </InputItem>
        <InputItem
          clear
          placeholder="请输入职位薪资"
          onChange={(val) => {
            this.handleChange("salary", val);
          }}
        >
          职位薪资:
        </InputItem>
        <TextareaItem
          placeholder="请添加职位要求"
          title="职位要求"
          rows={3}
          clear
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

export default connect((state) => ({ user: state.user }), { updateUser })(
  LaobanInfo
);
