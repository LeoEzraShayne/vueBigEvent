//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus'
//导入路由器，@代表导入router文件夹
import router from '@/router';


//定义一个变量,记录公共的前缀  ,  baseURL
// const baseURL = 'http://localhost:8080';
const baseURL ='/api'
const instance = axios.create({baseURL})


//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        if(result.data.code===0){
            return result.data;
        }
        ElMessage.error(result.data.msg?result.data.msg:'服务异常')
        return Promise.reject(result.data);
    },
    err=>{

        if(err.response.status===401){
            ElMessage.error('请先登录')
            //没登陆，跳转到登陆页面
            router.push('/login')
        }else{
            ElMessage.error('服务异常')
        }
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

import {useTokenStore} from '@/stores/token.js'
//添加请求拦截器
instance.interceptors.request.use(
    //请求前的回调
    (config)=>{
        //添加token
        const tokenStore = useTokenStore();
        //如果token存在就赋值
        if (tokenStore.token) {
            config.headers.Authorization = tokenStore.token
            console.log("interceptors-token="+tokenStore.token)
        }
        return config;
    },
    //请求错误的回调
    (err)=>{
        Promise.reject(err)
    }
)

export default instance;