/* 
  提示找不到页面的UI路由组件
*/

import React, { Component } from "react";
import { Button } from "antd-mobile";
class NotFound extends Component {
  state = {};
  render() {
    return (
      <div>
        <div>
          <h2>抱歉，找不到该文件</h2>
          <Button
            type="primary"
            onClick={() => this.props.history.replace("/")}
          >
            回到首页
          </Button>
        </div>
      </div>
    );
  }
}

export default NotFound;
