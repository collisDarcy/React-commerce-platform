//该文件用于汇总所有的reducer为一个总的reducers
//引入combineReducers,用于汇总多个reducer
import { combineReducers } from 'redux';

import LoginReducer from '../../Login/reducer';

const rootReducer = combineReducers({
  LoginReducer
})
export default rootReducer;