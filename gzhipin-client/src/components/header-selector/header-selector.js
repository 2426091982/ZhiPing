/* 
  选择用户头像的UI组件
*/

import React, { Component } from "react";
// 导入列表和宫格
import { List, Grid } from "antd-mobile";
// 导入验证prop参数的插件
import PropTypes from "prop-types";
class HeaderSelector extends Component {
  // prop验证
  static propTypes = {
    setHeader: PropTypes.func.isRequired,
  };

  state = {
    icon: null, //图片对象，默认没有值
  };

  constructor(props) {
    super(props);
    // 准备需要显示的列表数据
    this.headerList = [];
    // 循环添加数据
    for (let i = 0; i < 20; i++) {
      this.headerList.push({
        text: "头像" + (i + 1),
        icon: require(`../../assets/images/头像${i + 1}.png`),
      });
    }
  }

  handleClick = ({ text, icon }) => {
    // 更新当前组件状态
    this.setState({ icon });
    // 调用函数更新父组件状态
    this.props.setHeader(text);
  };

  render() {
    const { icon } = this.state;

    // 头部界面查看是否有头像
    const listHeader = !icon ? (
      "请选择头像"
    ) : (
      <div>
        已选择头像: <img src={icon} />
      </div>
    );

    return (
      <div>
        <List renderHeader={() => listHeader}>
          <Grid
            onClick={(el) => {
              this.handleClick(el);
            }}
            columnNum={5}
            data={this.headerList}
          ></Grid>
        </List>
      </div>
    );
  }
}

export default HeaderSelector;
