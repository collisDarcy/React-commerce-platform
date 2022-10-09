/*
  封装一个包含应用中所有接口请求函数的模块
  每个函数的返回值都是promise
*/
import ajax from "./ajax";
export const login = (username, password) => ajax('/login', { username, password }, 'POST');

export const getUserListMethod = (userInfo) => ajax('/users', userInfo, 'GET');

export const add = (user) => ajax('/add', user, 'POST');
