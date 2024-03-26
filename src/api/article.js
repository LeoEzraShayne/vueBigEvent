//导入request请求工具
import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'

//文章分类列表
export const articleCategoryListService = () => {
    // const tokenStore = useTokenStore();
    //在pinia中定义的响应式数据,都不需要.value
    // return request.get('/category', { headers: { 'Authorization': tokenStore.token } })
    return request.get('/category')
}

//新增文章分类
export const addCategoryService = (categoryModel) => {
    return request.post('/category', categoryModel)
}

//更新文章分类
export const updateCategoryService = (categoryModel) => {
    return request.put('/category', categoryModel)
}

//删除文章分类 queryString格式，所以要把路径进行改变
export const deleteCategoryService =(id)=>{
    // alert('queryString格式，所以要把路径进行改变id:='+id);
    return request.delete('/category?id='+id)
}

//文章列表(条件分页) 请求参数格式：queryString
export const articleListService =(params)=>{
    return request.get('/article',{params:params})
}

//新增文章

//文章列表(条件分页)

//获取文章详情

//更新文章

//删除文章

//