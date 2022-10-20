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
export const addUser = (formInfo) => ajax('/users', formInfo, 'POST');
//查询点击修改当前用户的信息
export const showCurrentUser = (id) => ajax(`/users/${id}`, {}, 'GET');
//修改用户信息并提交的接口
export const editUserInfo = (id, userInfo) => ajax(`/users/${id}`, { email: userInfo.email, mobile: userInfo.mobile }, 'PUT');
//获取角色列表的接口
export const rolesList = () => ajax('/roles', {}, 'GET');
//分配当前用户角色的接口
export const assignRole = (userId, roleId) => ajax(`/users/${userId}/role`, { rid: roleId }, 'PUT');
//获取角色列表数据
export const acquireRole = () => ajax('/roles', {}, 'GET');
//获取所有角色权限的接口
export const acquireRoleAuthority = () => ajax('/rights/tree', {}, 'GET');
//更新当前角色拥有权限的接口
export const updateRoleAuthority = (roleId, IdStr) => ajax(`/roles/${roleId}/rights`, { rids: IdStr }, 'POST');