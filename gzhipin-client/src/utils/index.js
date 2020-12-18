/* 
  包含 n 个工具函数的模块
*/

/* 返回对应的路由路径 */
export function getRedirectTo(type, header) {
  /* 
  用户主界面路由
  dashen: /dashen
  laoban: /laoban
  用户信息完善界面路由
  dashen: /dasheninfo
  laoban: /laobaninfo
  判断是否已经完善信息 ? user.header是否有值
  判断用户类型: user.type
*/
  let path = "";
  // 判断类型
  if (type === "dashen") {
    path = "/dashen";
  } else {
    path = "/laoban";
  }
  // 判断是否有header值
  if (!header) {
    path += "info";
  }
  return path;
}
