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
const ignored = [
    { url: '/adminLogin' },
    { url: '/emailLogin' },
    { url: '/userLogin' },
    { url: '/userRegister' },
    { url: '/captcha' },
    { url: '/bookInfo', method: 'get' },
    { url: '/categoryInfo', method: 'get' },
    { url: '/comment/book' }
]; //忽略的请求路径
const instance = axios.create({ baseURL })

const isUrlIgnored = (url, method) => {
    let ignore = false;
    ignored.forEach(item => { if (url.startsWith(item.url) && item.method && method === item.method) ignore = true; });
    return ignore;
};

//添加响应拦截器
instance.interceptors.response.use(
    result => {
        if (result.status === 200) return result;
        ElMessage.error(result.data.message ? result.data.message : '服务异常')
        console.log(result)
        return Promise.resolve(result)
    },
    err => {
        let response = err.response;
        if (response.status === 401) {
            ElMessage.error("请先登录")
            router.push('/login')
        }
        else if (response.status === 403) {
            ElMessage.error("请先登录")
            router.push('/login/admin')
        }
        else ElMessage.error(response.data.message ?? '响应服务异常')
        console.log(err)
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

//添加请求拦截器
instance.interceptors.request.use(
    config => {
        console.log('正在请求路径：' + config.url);
        if (isUrlIgnored(config.url, config.method)) {
            console.log('该请求路径无需设置请求头');
            return config;
        } else {
            const tokenStore = useTokenStore();
            if (tokenStore.token)
                config.headers.Authorization = tokenStore.token;
            else
                console.log('Token为空, 未设置请求头')
            return config;
        }
    },
    err => {
        ElMessage.error(err.request.data.message ?? '请求服务异常')
        console.log(err)
        Promise.reject(err)
    }
)

export default instance;