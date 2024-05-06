//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
//js文件中导入router的方法
import router from '@/router';
//导入token
import { useTokenStore } from '@/stores/token.js';
//组件库消息提示
import { ElMessage } from 'element-plus';
//定义一个变量,记录公共的前缀  ,  baseURL
const baseURL = '/api';
const instance = axios.create({ baseURL });


//添加响应拦截器
instance.interceptors.response.use(
    result => {
        //注意：判断条件要正确，statusCode==='0'则成功
        if (result.data.statusCode === 0) {
            return result;
        }
        //alert(result.message?result.message:'服务异常')
        ElMessage.error(result.data.message ? result.data.message : '服务异常')
        return Promise.reject(result.data)
    },
    err => {
        //401未登录
        if (err.response.status === 401) {
            ElMessage.error("请先登录")
            router.push('/login')
        } else {
            ElMessage.error(result.data.message ? result.data.message : '服务异常')
        }

        return Promise.reject(err);//异步的状态转化成失败的状态
    }
);

//添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        const tokenStore = useTokenStore();

        if (config.url === '/admins/register') {
            console.log('请求路径为注册页，无需设置请求头');
            return config;
        } else {
            if (tokenStore.token) {

                config.headers.Authorization = tokenStore.token
            } else {
                console.log('token为空')
            }
            return config;
        }
    },
    (err) => {
        Promise.reject(err)

    }
);

export default instance;