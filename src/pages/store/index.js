//该文件用于暴露一个store对象，整个应用只有一个store对象
import { createStore, applyMiddleware } from "redux";
//引入redux-devtools-extension
import { composeWithDevTools } from 'redux-devtools-extension'
//引入login组件中的reducer
import rootReducers from './Reducers';
//引入redux-thunk用于支持异步的action
import thunk from 'redux-thunk';

export default createStore(rootReducers, (composeWithDevTools(applyMiddleware(thunk))));