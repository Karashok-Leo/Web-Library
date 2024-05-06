import request from '@/utils/request.js'

//注册接口
export const adminRegisterService = (DataObj) => {
    //借助urlsearchParams完成传递
    const params = new URLSearchParams()
    for (let key in DataObj)
        params.append(key, DataObj[key]);
    console.log("register" + params)
    return request.post('/admins/register', params)
}

//登录接口
export const adminLoginService = (registerData) => {
    const params = new URLSearchParams();
    for (let key in registerData)
        params.append(key, registerData[key])
    return request.post('/tokens/login', params)
}

//密码修改
export const editPasswordService = (DataObj) => {
    const url = '/admins/edit'
    return request.patch(url, DataObj)
}