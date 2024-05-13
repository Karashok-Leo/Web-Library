import request from '@/utils/request.js'

//用户登录接口
export const userLoginService = (data) => request.post('/userLogin', data);

//用户注册接口
export const userRegisterService = (data) => request.post('/userRegister', data);

//编辑用户资料
export const editProfileService = (userId, data) => request.put('/userInfo/' + userId, data);

//用户退出接口
export const userLogoutService = () => request.post('/logout');

//管理员登录接口
export const adminLoginService = (data) => request.post('/adminLogin', data);

//密码修改
export const editPasswordService = (DataObj) => request.patch('/admins/edit', DataObj);

//获取用户信息
export const getUserInfoService = () => request.get('/currentUser');