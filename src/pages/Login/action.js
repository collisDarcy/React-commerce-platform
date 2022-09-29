import { USER_LOGIN, USER_LOGOUT, LOGIN_SUCCESS, LOGIN_INFO } from './actionTypes'

//箭头函数返回一个字面量的对象使用圆括号包括一个花括号
export const loginAction = (flag, username) => ({
  type: USER_LOGIN,
  flag,
  username
})

export const loginSuccessAction = (flag, username) => ({
  type: LOGIN_SUCCESS,
  flag,
  username
})

export const userLoginInfo = (flag, username) => ({
  type: LOGIN_INFO,
  flag,
  username
})
export const logoutAction = (flag) => ({
  type: USER_LOGOUT,
  flag
})
