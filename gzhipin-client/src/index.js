/* 
  入口js
*/

import React from "react";
import ReactDom from "react-dom";

import "antd-mobile/dist/antd-mobile.css";

// 导入路由
import { BrowserRouter, Route, Switch } from "react-router-dom";

// 导入主路由组件
import Main from "./containers/main/main";
// 导入登录路由组件
import Login from "./containers/login/login";
// 导入注册路由组件
import Register from "./containers/register/register";

// 导入 Provider 组件
import { Provider } from "react-redux";
// 导入 store
import store from "./redux/store";
// 导入index 的css样式
import "./assets/css/index.css";

// import "./test/socketio_test";

ReactDom.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/register" component={Register}></Route>
        <Route component={Main}></Route>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
