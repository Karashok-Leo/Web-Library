import request from '@/utils/request.js'

//获取用户列表
export const userListService=()=>request.get('/userInfo');

//获取用户
export const userService=(id)=>request.get('/userInfo/'+id);

//编辑用户信息
export const editUserService=(id,data)=>request.put('/userInfo/'+id,data)

//删除用户
export const delUserService=(id)=>request.delete('/userInfo/'+id);

//批量删除用户
export const deleteUserByGroupService=(data)=>request.delete('/userInfo',data);