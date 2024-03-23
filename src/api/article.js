//导入request请求工具
import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'

export const articleCategoryListService = () => {
    const tokenStore = useTokenStore();
    //在pinia中定义的响应式数据,都不需要.value
    // return request.get('/category', { headers: { 'Authorization': tokenStore.token } })
    return request.get('/category')
}

//文章分类列表

//新增文章分类

//获取文章分类详情

//更新文章分类

//删除文章分类

//新增文章

//文章列表(条件分页)

//获取文章详情

//更新文章

//删除文章

//