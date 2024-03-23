//导入request请求工具
import request from '@/utils/request.js'
//注册接口
export const userRegisterService =(registerData)=>{
    //借助于URLSearchParams往接口里传递参数
    const params = new URLSearchParams();
    for (let key in registerData) {
        //根据registerData的key，获取registerData对应的值
       params.append(key,registerData[key]);
    }

    return request.post('/user/register',params);

}

//登陆接口
export const userLoginService =(registerData)=>{

    //借助于URLSearchParams往接口里传递参数
    const params = new URLSearchParams();
    for (let key in registerData) {
        //根据registerData的key，获取registerData对应的值
       params.append(key,registerData[key]);
    }
    return request.post('/user/login',params);
}
