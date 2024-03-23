//导入路由器
import {createRouter,createWebHistory} from 'vue-router'

//导入组件
import LoginVue from '@/views/Login.vue';
import LayoutVue  from '@/views/Layout.vue';
import ArticleCategoryVue  from '@/views/article/ArticleCategory.vue';
import ArticleManageVue  from '@/views/article/ArticleManage.vue';
import UserAvatarVue  from '@/views/user/UserAvatar.vue';
import UserInfoVue  from '@/views/user/UserInfo.vue';
import UserResetPasswordVue  from '@/views/user/UserResetPassword.vue';


//定义路由关系

const routes =[
    {path:'/login',component:LoginVue},
    {path:'/',component:LayoutVue,
                        children:[
                                    {path:'/article/category',component:ArticleCategoryVue},
                                    {path:'/article/manage',component:ArticleManageVue},
                                    {path:'/user/avatar',component:UserAvatarVue},
                                    {path:'/user/info',component:UserInfoVue},
                                    {path:'/user/resetpassword',component:UserResetPasswordVue}
                                 ],
                        //用redirect重定向这个属性，设置中间默认显示区域，当访问'/'路径的页面时，会默认显示'/article/manage'路径下的内容
                        redirect:'/article/manage'
                        

    }
 

]

//创建路由器
const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

//导出路由
export default router