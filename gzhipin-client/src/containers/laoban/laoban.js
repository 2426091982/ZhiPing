/* 
  老板主界面路由容器组件
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import UserList from "../../components/user-list/user-list";
import { getUserList } from "../../redux/actions";
class Laoban extends Component {
  state = {};

  //WARNING! To be deprecated in React v17. Use componentDidMount instead.
  componentWillMount() {
    // 获取userList
    this.props.getUserList("dashen");
  }
  render() {
    return <UserList userList={this.props.userList}></UserList>;
  }
}

export default connect((state) => ({ userList: state.userList }), {getUserList})(Laoban);
