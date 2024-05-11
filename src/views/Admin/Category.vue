<script setup>
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage} from 'element-plus'

// 控制添加分类弹窗
const dialogVisible = ref(false)
const categories = ref([
  {
  "category_id": 3,
  "category_name": "美食",
  },
  {
    "category_id": 4,
    "category_name": "娱乐",

  },
  {
    "category_id": 5,
    "category_name": "军事",
  }
  ])
const title = ref('')
const selectedItems = ref([])

// 添加分类数据模型
const categoryModel = ref({
  category_name: '',
  category_id: ''
})

// 添加分类表单校验规则
const rules = {
  category_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
  ],
  category_id: [
    { required: true, message: '请输入分类ID', trigger: 'blur' },
    { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
  ]
}

// 获取所有分类列表
const fetchCategories = async () => {
  try {
    const result = await bookCategoryListService()
    categories.value = result.data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    ElMessage.error('获取分类列表失败')
  }
}
fetchCategories()

// 添加分类
const addCategory = async () => {
  try {
    const result = await bookCategoryAddService(categoryModel.value)
    ElMessage.success(result.msg ? result.msg : '添加成功')
    await fetchCategories()
    dialogVisible.value = false
  } catch (error) {
    console.error('Failed to add category:', error)
    ElMessage.error('添加分类失败')
  }
}

//展示编辑弹窗
const showDialog = (row) => {
  dialogVisible.value = true;
  title.value = '编辑分类'
  //数据拷贝
  categoryModel.value = row;
}
// 编辑分类
const editCategory = async () => {
  try {
    title.value="编辑分类";
    const result = await bookCategoryUpdateService(categoryModel.value)
    ElMessage.success(result.msg ? result.msg : '修改成功')
    await fetchCategories()
    dialogVisible.value = false
  } catch (error) {
    console.error('Failed to edit category:', error)
    ElMessage.error('修改分类失败')
  }
}

// 删除单个分类
const deleteCategory = async (category) => {
  try {
    await bookCategoryDeleteService(category.category_id)
    ElMessage.success('删除成功')
    await fetchCategories()
  } catch (error) {
    console.error('Failed to delete category:', error)
    ElMessage.error('删除分类失败')
  }
}

// 批量删除分类
// 处理选中事件
const handleSelectionChange = (selected) => {
  selectedItems.value = selected;
};
const deleteSelectedCategories = async () => {
  try {
    await deleteCommentService(selectedItems.value.map(item => item.category_id))
    ElMessage.success('批量删除成功')
    selectedItems.value = []
    await fetchCategories()
  } catch (error) {
    console.error('Failed to delete selected categories:', error)
    ElMessage.error('批量删除分类失败')
  }
}

//清空模型的数据
const clearData = () => {
  categoryModel.value.category_name = '';
  categoryModel.value.category_id = '';
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>图书分类</span>
        <div class="extra">
          <el-button type="primary" @click="dialogVisible = true; title = '添加分类'; clearData()">添加分类</el-button>
          <el-button @click="deleteSelectedCategories">批量删除</el-button>
        </div>
      </div>
    </template>
    <el-table
        ref="multipleTableRef"
        :data="categories"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类ID" prop="category_id"></el-table-column>
      <el-table-column label="分类名称" prop="category_name"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <!-- 添加分类弹窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="categoryModel.category_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类ID" prop="categoryAlias">
          <el-input v-model="categoryModel.category_id" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="title === '添加分类' ? addCategory() : editCategory()"> 确认 </el-button>
                </span>
      </template>
    </el-dialog>
  </el-card>
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