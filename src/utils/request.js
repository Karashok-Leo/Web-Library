//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
//js文件中导入router的方法
import router from '@/router'
//导入token
import { useTokenStore } from '@/stores/token.js';
//组件库消息提示
import { ElMessage } from 'element-plus'
//定义一个变量,记录公共的前缀  ,  baseURL
const baseURL = '/api';
const ignoreUrl = ['/adminLogin', '/emailLogin', '/userLogin', '/userRegister', '/captcha']; //忽略的请求路径
const instance = axios.create({ baseURL })

const isUrlIgnored = (url) => {
    let ignore = false;
    ignoreUrl.forEach(item => { if (url.startsWith(item)) ignore = true; });
    return ignore;
};

//添加响应拦截器
instance.interceptors.response.use(
    result => {
        if (result.data.success) return result;
        ElMessage.error(result.data.message ? result.data.message : '服务异常')
        console.log(result)
        return Promise.resolve(result.data)
    },
    err => {
        console.log(err)
        let result = err.response;
        if (err.response.status === 401) {
            ElMessage.error("请先登录")
            router.push('/login')
        } else ElMessage.error(result.data.message ? result.data.message : '服务异常')
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

//添加请求拦截器
instance.interceptors.request.use(
    config => {
        if (isUrlIgnored(config.url)) {
            console.log('请求路径为登录/注册页，无需设置请求头');
            return config;
        } else {
            const tokenStore = useTokenStore();
            if (tokenStore.token)
                config.headers.Authorization = tokenStore.token;
            else
                console.log('token为空')
            return config;
        }
    },
    err => {
        console.log(err)
        let result = err.request;
        ElMessage.error(request.data.message ? request.data.message : '服务异常')
        Promise.reject(err)
    }
)

export default instance;