/*
  封装一个包含应用中所有接口请求函数的模块
  每个函数的返回值都是promise
*/
import ajax from "./ajax";
//用户登录的API的接口
export const login = (username, password) => ajax('/login', { username, password }, 'POST');
//获取用户列表的方法的接口
export const getUserListMethod = (userInfo) => ajax('/users', userInfo, 'GET');
//switch开关状态改变的接口
export const switchUserState = (userInfo) => ajax(`/users/${userInfo.id}/state/${userInfo.mg_state}`, {}, 'PUT');

//删除用户的接口
export const deleteCurrentUser = (userInfo) => ajax(`/users/${userInfo}`, {}, 'DELETE');
//添加用户的接口
export const add = (user) => ajax('/add', user, 'POST');
