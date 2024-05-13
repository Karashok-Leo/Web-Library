import request from '@/utils/request.js'

//管理员登出接口
export const adminLogoutService = () => request.post('/logout');

//密码修改
export const editPasswordService = (DataObj) => request.patch('/admins/edit', DataObj);

//管理员信息列表获取
export const getAdminInfoListService=()=>request.get('/adminInfo');

//添加管理员
export const addAdminService=(data)=>request.post('/adminInfo',data);

//删除管理员
export const deleteAdminService=(id)=>request.delete('/adminInfo/'+id);

//修改管理员信息
export const editAdminService=(id)=>request.put('/adminInfo/'+id);