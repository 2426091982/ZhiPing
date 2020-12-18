/* 主界面路由组件 */

import React, { Component } from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Cookies from "js-cookie"; // 获取cookies的插件, get(),set(),remove()
// 导入工具函数
import { getRedirectTo } from "../../utils/index";
import { getUser } from "../../redux/actions";

// 导入antd-mobile
import { NavBar } from "antd-mobile";

// 导入路由组件
// 老板信息完善组件
import LaobanInfo from "../laoban-info/laoban-info";
// 大神信息完善组件
import DashenInfo from "../dashen-info/dashen-info";
// 老板主界面
import Laoban from "../laoban/laoban";
// 大神主界面
import Dashen from "../dashen/dashen";
// 消息主界面
import Message from "../message/message";
// 个人中心主界面
import Personal from "../personal/personal";
// 404not found组件
import Notfound from "../../components/not-found/not-found";
// nav-footer底部
import NavFooter from "../../components/nav-footer/nav-footer";
// char聊天组件
import Char from "../chat/chat";

class Main extends Component {
  // 组件类和组件对象
  // 给组件对象添加属性
  navList = [
    // 包含所有导航组件的相关信息数据
    {
      path: "/laoban", // 路由路径
      component: Laoban,
      title: "大神列表",
      icon: "dashen",
      text: "大神",
    },
    {
      path: "/dashen", // 路由路径
      component: Dashen,
      title: "老板列表",
      icon: "laoban",
      text: "老板",
    },
    {
      path: "/message", // 路由路径
      component: Message,
      title: "消息列表",
      icon: "message",
      text: "消息",
    },
    {
      path: "/personal", // 路由路径
      component: Personal,
      title: "用户中心",
      icon: "personal",
      text: "个人",
    },
  ];

  componentWillMount() {
    // 登陆过(cookie中有userid),但是没有登录(redux的user中没有_id) 发请求获取对应的user
    const userid = Cookies.get("userid");
    const { _id } = this.props.user;
    console.log(userid, _id);
    if (userid && !_id) {
      // 发送异步请求，获取user
      console.log("发送异步请求");
      this.props.getUser();
    }
  }

  render() {
    // 读取 cookie 中的userid
    const userid = Cookies.get("userid");
    // 如果没有,自动重定向到登录界面
    if (!userid) {
      return <Redirect to="/login"></Redirect>;
    }
    // 如果有，读取redux中的user状态
    const { user, unReaderCount } = this.props;
    console.log(unReaderCount);
    // 如果user没有_id,返回null(不做任何显示)
    if (!user._id) {
      return null;
    } else {
      // 如果有 _id,显示对应的界面
      // 如果请求根路径根据 user 的 type 和 header 来计算出一个重定向的路由路径，并且自动重定向
      // 获取路径
      let path = this.props.location.pathname;
      if (path === "/") {
        // 得到一个重定向的路由路径
        path = getRedirectTo(user.type, user.header);
        // 跳转路由
        return <Redirect to={path}></Redirect>;
      }
    }

    // 检查用户是否登录，如果没有，自动重定向到登录页面
    /* const { user } = this.props;
    if (!user._id) {
      return <Redirect to="/login"></Redirect>;
    } */

    const { navList } = this;
    // 请求的路径
    const path = this.props.location.pathname;
    const currentNav = navList.find((nav) => {
      // 得到当前的nav,可能没有
      return nav.path === path;
    });

    if (currentNav) {
      // 决定哪个路由需要隐藏
      if (user.type === "laoban") {
        // 隐藏数组的第二个
        navList[1].hide = true;
      } else {
        // 隐藏数组的第一个
        navList[0].hide = true;
      }
    }

    return (
      <div>
        {/* 判断currentNav是否有值，有就使用NavBar组件 */}
        {currentNav ? (
          <NavBar className="sticky-header">{currentNav.title}</NavBar>
        ) : null}
        <Switch>
          {/* 老板路由 */}
          <Route path="/laobaninfo" component={LaobanInfo} />
          {/* 大神路由 */}
          <Route path="/dasheninfo" component={DashenInfo} />
          {/* 大神路由 */}
          <Route path="/chat/:userid" component={Char} />

          {
            /* 动态的注册路由 */
            navList.map((nav) => {
              return (
                <Route
                  key={nav.path}
                  path={nav.path}
                  component={nav.component}
                ></Route>
              );
            })
          }

          {/* 404notfound组件 */}
          <Route component={Notfound} />
        </Switch>
        {currentNav ? (
          <NavFooter navList={navList} unReaderCount={unReaderCount} />
        ) : null}
      </div>
    );
  }
}

export default connect(
  (state) => ({ user: state.user, unReaderCount: state.chat.unReaderCount }),
  { getUser }
)(Main);

/* 
  1. 实现自动登录
  1.componentDidMount()
  // 登陆过(cookie中有userid),但是没有登录(redux的user中没有_id) 发请求获取对应的user
  2.render()
    (1) 如果cookie 中没有 userid,直接重定向到login
    (2) 判断redux管理的user中是否有_id,没有暂时不做任何显示
    (3) 如果有，说明当前已经登录，显示对应的界面
    (4)  如果已经登录，如果请求根路径
    根据user的 type 和 header 来计算出一个重定向路由路径，并且自动重定向
*/
