/*使用 axios 封装的 ajax 请求函数
函数返回的是 promise 对象
*/

import axios from "axios";

export default function ajax(url = "", data = {}, type = "GET") {
  if (type === "GET") {
    // 准备 url query 参数数据
    let dataStr = "";
    // 数据拼接字符串
    Object.keys(data).forEach((key) => {
      dataStr += key + "=" + data[key] + "&";
    });

    if (dataStr) {
      // 截取字符串到最后一个 & 符号的位置不包括 &
      dataStr = dataStr.substring(0, dataStr.length - 1);
      // 组合字符串
      url = url + "?" + dataStr;
    }
    // 发送 get 请求
    return axios.get(url);
  } else {
    // 发送 post 请求
    return axios.post(url, data); // data: 包含请求体数据的对象
  }
}
