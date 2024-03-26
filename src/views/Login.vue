<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
//控制注册与登录表单的显示， 默认显示登陆
const isRegister = ref(false)

//1.定义数据模型
const registerData = ref({
    username: '',
    password: '',
    rePassword: ''
});
//3.校验密码函数，这个函数必须要写在校验规则上面才能生效
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('Please input the password again'))
    } else if (value !== registerData.value.password) {
        callback(new Error("Two inputs don't match!"))
    } else {
        callback()
    }
}
//2.定义校验规则
const loginRules = {
    username: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        { min: 5, max: 16, message: 'Length should be 5 to 16', trigger: 'blur' },
    ],
    password: [
        { required: true, message: 'Please input password', trigger: 'blur' },
        { min: 5, max: 16, message: 'Length should be 5 to 16', trigger: 'blur' },
    ],
    rePassword: [
        { validator: checkRePassword, trigger: 'blur' }
    ]
}

//导入user.js的所有接口
import { userRegisterService, userLoginService } from '@/api/user.js'
import { ElMessage } from 'element-plus';

//导入路由的useRouter
import { useRouter } from 'vue-router';
const router = useRouter();

//导入useTokenStore函数，把token存到pinia中
import {useTokenStore} from '@/stores/token.js';
const tokenStore = useTokenStore();

//6.调用注册接口
const register = async () => {
    //给接口传递参数要记得带上.value
    let result = await userRegisterService(registerData.value);

    ElMessage.success(result.msg ? result.msg : '注册成功');

    router.push('/');
}

//6.调用登陆接口
const login = async () => {
    let result = await userLoginService(registerData.value);

    ElMessage.success(result.msg ? result.msg : '登陆成功');
    //把token存到pinia中
    tokenStore.setToken(result.data);

    //跳转到'/'这个路径的页面，也就是首页
    router.push('/');

}
//在登陆和注册表单切换的时候，清空初始数据
const clearData = () => {
    registerData.value = {
        username: '',
        password: '',
        rePassword: ''
    }

}
</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :rules="loginRules"
                :model="registerData"> <!--4. 绑定数据和校验规则 :rules="loginRules" :model="registerData" -->
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username"> <!-- 4.校验规则 prop="username" -->
                    <el-input :prefix-icon="User" placeholder="请输入用户名"
                        v-model="registerData.username"></el-input><!-- 4.绑定数据 v-model="registerData.username"  -->
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码"
                        v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register"> <!--5.绑定单击事件调用接口 -->
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false; clearData()">
                        <!--7.点击事件绑定属性和方法，之间用分号分隔 -->
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" :rules="loginRules" :model="registerData" v-else>
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true; clearData()">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>