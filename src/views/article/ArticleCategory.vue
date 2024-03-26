<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
const categorys = ref([
    // {
    //     "id": 3,
    //     "categoryName": "美食",
    //     "categoryAlias": "my",
    //     "createTime": "2023-09-02 12:06:59",
    //     "updateTime": "2023-09-02 12:06:59"
    // },
    // {
    //     "id": 4,
    //     "categoryName": "娱乐",
    //     "categoryAlias": "yl",
    //     "createTime": "2023-09-02 12:08:16",
    //     "updateTime": "2023-09-02 12:08:16"
    // },
    // {
    //     "id": 5,
    //     "categoryName": "军事",
    //     "categoryAlias": "js",
    //     "createTime": "2023-09-02 12:08:33",
    //     "updateTime": "2023-09-02 12:08:33"
    // }
])
//文章分类列表数据获取
import { articleCategoryListService, addCategoryService, updateCategoryService, deleteCategoryService } from '@/api/article.js'

const articleCategoryList = async () => {
    let result = await articleCategoryListService();

    categorys.value = result.data;
}

//获取文章分类列表调用---调用函数要在script标签里调用
articleCategoryList();

//控制添加分类弹窗
const dialogVisible = ref(false)

//添加分类数据模型
const categoryModel = ref({
    categoryName: '',
    categoryAlias: ''
})
//添加分类表单校验
const rules = {
    categoryName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
    ],
    categoryAlias: [
        { required: true, message: '请输入分类别名', trigger: 'blur' },
    ]
}

//调用添加分类接口
const addCategory = async () => {
    let result = await addCategoryService(categoryModel.value);

    ElMessage.success(result.message ? result.message : '添加成功')
    dialogVisible.value = false;
    articleCategoryList()
}
//编辑分类弹窗标题，设置默认值是空，绑定到<el-dialog v-model="dialogVisible" :title="title" width="30%">
const title = ref('')

//编辑分类回显
const updateCategoryEcho = (row) => {
    title.value = '修改分类'
    dialogVisible.value = true
    //将row中的数据赋值给categoryModel
    categoryModel.value.categoryName = row.categoryName
    categoryModel.value.categoryAlias = row.categoryAlias
    //修改的时候必须传递分类的id，所以扩展一个id属性
    categoryModel.value.id = row.id

}

//更新文章分类
const updateCategory = async () => {
    let result = await updateCategoryService(categoryModel.value);
    // alert(categoryModel.value.id)
    ElMessage.success(result.message ? result.message : '更新成功')
    articleCategoryList()

    dialogVisible.value = false;
}
//清空模型数据
const clearCategoryModel = () => {
    categoryModel.value.categoryName = ''
    categoryModel.value.categoryAlias = ''
}
const deleteCategory = (row) => {
    ElMessageBox.confirm(
        '确认要删除当前分类么?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //调用删除接口
            // alert('调用删除接口id:='+row.id);
            let result = await deleteCategoryService(row.id)
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            
            articleCategoryList()
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章分类</span>
                <div class="extra">
                    <el-button type="primary"
                        @click="dialogVisible = true; title = '添加分类'; clearCategoryModel()">添加分类</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categorys" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="分类名称" prop="categoryName"></el-table-column>
            <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <!-- <el-button :icon="Edit" circle plain type="primary" @click="dialogVisible = true;title='编辑分类'"></el-button> -->
                    <el-button :icon="Edit" circle plain type="primary" @click="updateCategoryEcho(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
    </el-card>

    <!-- 添加分类弹窗 title前面加上冒号才代表绑定了数据-->
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
        <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
            <el-form-item label="分类名称" prop="categoryName">
                <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="分类别名" prop="categoryAlias">
                <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="title === '添加分类' ? addCategory() : updateCategory()"> 确认 </el-button>
            </span>
        </template>
    </el-dialog>
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
</style>