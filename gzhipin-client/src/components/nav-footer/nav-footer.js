import React, { Component } from "react";
import { TabBar } from "antd-mobile";
import PropTypes from "prop-type";
import { withRouter } from "react-router-dom";

const Item = TabBar.Item;

// 希望在非路由组件中使用路由库的api
// withRoute()
class NavFooter extends Component {
  state = {};

  static propType = {
    navList: PropTypes.isRequired,
    unReaderCount: PropTypes.isRequired,
  };

  render() {
    // 未读 unReaderCount

    let { navList, unReaderCount } = this.props;
    console.log(unReaderCount);
    // 过滤掉hide为true的nav
    navList = navList.filter((nav) => !nav.hide);
    // 请求的path
    const path = this.props.location.pathname;

    return (
      <TabBar>
        {navList.map((nav) => (
          <Item
            key={nav.path}
            badge={nav.path === "/message" ? unReaderCount : 0}
            title={nav.title}
            icon={{ uri: require(`./images/${nav.icon}.png`) }}
            selectedIcon={{ uri: require(`./images/${nav.icon}-selected.png`) }}
            selected={path === nav.path}
            onPress={() => {
              this.props.history.replace(nav.path);
            }}
          />
        ))}
      </TabBar>
    );
  }
}
// 向外暴露withRouter() 包装产生的组件
// 内部会向组件中传入一些路由组件特有的属性，history/location/math
export default withRouter(NavFooter);
