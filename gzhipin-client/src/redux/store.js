/* 
  redux最核心的store对象模块
*/
// 导入reducers函数
import reducers from "./reducers";
// 导入createStore
import { createStore, applyMiddleware } from "redux";

import thunk from "redux-thunk";

import { composeWithDevTools } from "redux-devtools-extension";

// 创建store对象
let store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

// 向外暴露 store对象
export default store;
