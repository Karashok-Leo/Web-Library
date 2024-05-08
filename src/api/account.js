import request from '@/utils/request.js'

//用户登录接口
export const userLoginService = (data) => {
    return request.post('/userLogin', data)
}

//用户注册接口
export const userRegisterService = (data) => {
    return request.post('/userRegister', data)
}

//管理员登录接口
export const adminLoginService = (data) => {
    return request.post('/adminLogin', data)
}

//密码修改
export const editPasswordService = (DataObj) => {
    const url = '/admins/edit'
    return request.patch(url, DataObj)
}