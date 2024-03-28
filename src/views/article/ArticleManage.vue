<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';

//文章分类数据模型
const categorys = ref('')

//用户搜索时选中的分类id
const categoryId = ref('')

//用户搜索时选中的发布状态
const state = ref('')

//文章列表数据模型
const articles = ref('')


//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(2)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    articleList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    articleList()
}

//回显文章分类
import { articleCategoryListService, articleListService, addArticaleService, updateArticleService, deleteArticleService } from '@/api/article.js'

const articleCategoryList = async () => {
    let result = await articleCategoryListService();
    categorys.value = result.data;

}

articleCategoryList();

//文章列表(条件分页)
const articleList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let result = await articleListService(params);
    total.value = result.data.total;
    articles.value = result.data.items;

    //为文章列表中添加categoryName属性，它是articles的扩展属性
    //根据categoryId设置categoryName
    for (let i = 0; i < articles.value.length; i++) {
        //先获取含有categoryId的实例对象articles
        let article = articles.value[i];

        //遍历分类列表categorys获取id
        for (let index = 0; index < categorys.value.length; index++) {

            //获取articles中的categoryId和分类列表categorys的id进行对比，如果相同，就根据categorys的categoryId设置articles的categoryName
            if (article.categoryId === categorys.value[index].id) {

                article.categoryName = categorys.value[index].categoryName
            }
        }
    }
}

articleList();

//添加文章抽屉组件
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content: '',
    state: ''
})

// 1. 由于这个请求时el-upload自动发送的异步请求，并没有使用咱们的request.js请求工具，所以在请求的路ing上，需要加上/api, 这个时候请求代理才能拦截到这个请求，转发到后台服务器上
// 2. 要携带请求头，还需要导入pinia状态才可以使用
import { useTokenStore } from '@/stores/token';
const tokenStore = useTokenStore();

const uploadSuccess = (result) => {
    //img就是后台响应的数据，格式为：{code:状态码，message：提示信息，data: 图片的存储地址}
    articleModel.value.coverImg = result.data
    // console.log('result.data=' + result.data);
}

//新增文章
const addArticle = async (state) => {
    articleModel.value.state = state

    let result = await addArticaleService(articleModel.value)
    console.log("result.code=" + result.code);
    ElMessage.success(result.message ? result.message : '添加成功')

    articleList()

    visibleDrawer.value = false;

}

const title = ref('')
const updateArticleEcho = (row) => {
    title.value = '编辑文章'
    visibleDrawer.value = true

    articleModel.value.title = row.title,
        articleModel.value.categoryId = row.categoryId,
        articleModel.value.coverImg = row.coverImg,
        articleModel.value.content = row.content,
        articleModel.value.state = row.state,
        articleModel.value.id = row.id

    console.log("编辑文章title=" + title.value);
    console.log("updateArticleEcho.title=" + articleModel.value.title);
}
//更新文章 todo
const updateArticle = async () => {

    let result = await updateArticleService(articleModel.value)

    ElMessage.success(result.message ? result.message : '更新成功')

    console.log("updateArticle.result.message=" + result.message);

    articleList()
    visibleDrawer.value = false

}

//删除文章
const deleteDialog = (row) => {
    ElMessageBox.confirm(
        '确认要删除当前文章么?',
        '温馨提示',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(async () => {
            let result = await deleteArticleService(row.id)
            
            ElMessage.success(result.message ? result.message : '删除成功')
            articleList()
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}
//清空模型数据 content数据不能被清空 todo
const clearArticleModel = () => {
    articleModel.value.title = '',
        articleModel.value.categoryId = '',
        articleModel.value.coverImg = '',
        articleModel.value.content = '',
        articleModel.value.state = ''
}

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary"
                        @click="visibleDrawer = true; title = '添加文章'; clearArticleModel()">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="文章分类：">
                <el-select placeholder="请选择" v-model="categoryId" style="width: 200px">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state" style="width: 200px">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="articleList">搜索</el-button>
                <el-button @click="categoryId = ''; state = ''">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
            <el-table-column label="分类" prop="categoryName"></el-table-column>
            <el-table-column label="发表时间" prop="createTime"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="updateArticleEcho(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteDialog(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[2, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>

    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%">
        <!-- 添加文章表单 -->
        <el-form :model="articleModel" label-width="100px">
            <el-form-item label="文章标题">
                <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类">
                <el-select placeholder="请选择" v-model="articleModel.categoryId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章封面">


                <!-- 将来当点击+图标，选择本地图片后，el-upload这个组件会自动发送请求，把图片上传到指定的服务器上，而不需要我们自己使用axios发送异步请求，所以需要给el-upload标签添加一些属性，控制请求的发送

    auto-upload:是否自动上传 true自动上传,false

    action: 服务器接口路径 ，upload涉及到跨域，所以要用代理的方式来解决，所以路径前要加上“/api”

    name: 上传的文件字段名

    headers: 设置上传的请求头,一定是headers

    on-success: 上传成功的回调函数 action是请求服务器调用接口，on-success是接受请求后的结果-->

                <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="true" action="/api/upload"
                    name="file" :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                    <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="文章内容">
                <div class="editor">
                    <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html">
                    </quill-editor>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="title === '添加文章' ? addArticle('已发布') : updateArticle()">发布</el-button>
                <el-button type="info" @click="addArticle('草稿')">草稿</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>