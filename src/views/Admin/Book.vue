<script setup>
import {
  Edit,
  Delete, Search
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { Plus } from '@element-plus/icons-vue'

//显示弹窗
const dialogVisible=ref(false);
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数
//导入token
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();

//图书列表数据模型
const Books = ref([
  {
    "book_id": 5,
    "book_name": "无感之谜",
    "author": "刘哈哈",
    "text": "暂无",
    "category_id": 332	,
    "product_id": 2,
    "number": 23,
    "current_count": 23,
    "borrow_count":14
  },
  {
    "book_id": 5,
    "book_name": "无感之谜",
    "author": "刘哈哈",
    "text": "暂无",
    "category_id": 332	,
    "product_id": 2,
    "number": 23,
    "current_count": 23,
    "borrow_count":14
  },
  {
    "book_id": 5,
    "book_name": "无感之谜",
    "author": "刘哈哈",
    "text": "暂无",
    "category_id": 332	,
    "product_id": 2,
    "number": 23,
    "current_count": 23,
    "borrow_count":14
  },
])
//文章分类数据模型
const categorys = ref([
  {
    "id": 3,
    "category_name": "美食",
  },
  {
    "id": 4,
    "category_name": "娱乐",
  },
  {
    "id": 5,
    "category_name": "军事",
  }
])

//搜索输入
const input=ref();
// 选中的数据项
const selectedItems = ref([]);
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const bookModel = ref({
  book_id: '',
  book_name: '',
  author: '',
  text: '',
  category_id: '',
  product_id: '',
  number: '',
  current_count: '',
  borrow_count:'',
  image_url:''
})

//重置图书模型
const getDefaultBookModel = () => ({
  book_id: '',
  book_name: '',
  author: '',
  text: '',
  category_id: '',
  product_id: '',
  number: '',
  current_count: '',
  borrow_count:'',
  image_url:''
});

//获取图书数据
const getBooks =async () => {
  try {
    let result = await getBooksService();
    //将评论数据存储到Comments中，用于渲染视图
    Books.value = result.data;
    //更新总条数，用于分页显示
    total.value = result.data.length;
  } catch (error) {
    console.error("获取图书数据失败：", error);
  }
}
getBooks()

//回显文章分类
const getCategorys = async () => {
  let result = await articleCategorysService();

  categorys.value = result.data;
}
getCategorys()

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  //刷新列表
  getBooks();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  //刷新列表
  getBooks();
}

//上传成功的回调函数
const uploadSuccess = (result) => {
  bookModel.value.image_url = result.data;
  console.log(result.data);
}

//添加图书
import { ElMessage } from 'element-plus'
const addBook = async (clickState) => {
  //调用接口
  let result = await bookAddService(bookModel.value);

  ElMessage.success(result.msg ? result.msg : '添加成功');

  //图书模型置空
  bookModel.value = getDefaultBookModel();

  //让抽屉消失
  visibleDrawer.value = false;

  //刷新当前列表
  await getBooks();
}

//取消添加图书
const cancel = async () => {
  //图书数据模型置空
  bookModel.value = getDefaultBookModel();
  //让抽屉消失
  visibleDrawer.value = false;
}

//模糊搜索
const inputSearch = async () => {
  const keyword = input.value.trim(); // 转换为小写并去除首尾空格
  if (!keyword) {
    await getBooks(); // 如果搜索关键词为空，则显示所有评论列表
    return; // 如果搜索关键词为空，直接返回，不执行后续操作
  }
  let result = await getBooks(); // 获取图书列表
  try {
    // 根据书名进行模糊搜索
    total.value = result.data.filter(book =>
        book.book_name.includes(keyword)
    ).length;
    Books.value = result.data.filter( book =>
        book.book_name.includes(keyword)
    );
  } catch (error) {
    console.error('搜索图书时出错：', error);
    ElMessage.error(result.statusText || '搜索图书时出错：');
  }
  input.value = ''; // 清空输入框
};

//批量删除
// 处理选中事件
const handleSelectionChange = (selected) => {
  selectedItems.value = selected;
};
// 删除选中项
const deleteSelectedComments = () => {
  // 调用后端删除数据的函数
  deleteBookService(selectedItems.value);
  // 清空选中项
  selectedItems.value = [];
  //刷新列表
  getBooks();
};

//删除单本图书
const deleteBook = (row) => {
  // 调用后端删除数据的函数
  deleteBookService(row);
  //刷新列表
  getBooks();
};

//修改图书信息
//显示
const handleOpen=async (row) => {

  dialogVisible.value = true
  //获取编辑图书
  let result = await getBookService(row.book_id);
  bookModel.value = result.data;
}
const editBook=async (id) => {
  //编辑图书
  try {
    let result = await editBookService(bookModel.value.book_id, bookModel.value);
    if (result.status === 200) {
      ElMessage.success(result.statusText || '修改成功');
    } else {
      ElMessage.error(result.statusText || '修改失败');
    }
  } catch (error) {
    console.error('编辑用户时出错：', error);
    ElMessage.error('编辑用户时出错，请重试');
  }
}
//弹窗关闭
const handleClose=()=>{
  //图书模型置空
  bookModel.value = getDefaultBookModel();
  //弹窗关闭
  dialogVisible.value=false;
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>图书管理</span>
        <div class="extra">
          <el-button type="primary" @click="visibleDrawer = true">添加图书</el-button>
        </div>
      </div>
    </template>

    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item >
        <el-input v-model="input" style="width: 240px" placeholder="请输入书名" clearabl :prefix-icon="Search"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="inputSearch">搜索</el-button>
        <el-button @click="deleteSelectedComments">批量删除</el-button>
      </el-form-item>
    </el-form>

    <!-- 图书列表 -->
    <el-table
        ref="multipleTableRef"
        :data="Books.slice((pageNum-1)*pageSize,pageNum*pageSize)"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="图书名称" width="100" prop="book_name"></el-table-column>
      <el-table-column label="作者" prop="author"></el-table-column>
      <el-table-column label="图书编号" prop="book_id"> </el-table-column>
      <el-table-column label="图书简介" prop="text"></el-table-column>
      <el-table-column label="库存数量" prop="number"></el-table-column>
      <el-table-column label="借阅数量" prop="borrow_count"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="handleOpen(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteBook(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <!-- 分页条 -->
    <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 10, 15]"
        layout="jumper, total, sizes, prev, pager, next"
        background
        :total="total"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        style="margin-top: 20px;
        justify-content: flex-end"
    />

    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawer" title="添加图书" direction="rtl" size="50%">
      <!-- 添加图书表单 -->
      <el-form :model="bookModel" label-width="100px">
        <el-form-item label="图书名称">
          <el-input v-model="bookModel.book_name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="bookModel.author" placeholder="请输入名字"></el-input>
        </el-form-item>
        <el-form-item label="图书分类">
          <el-select placeholder="请选择" v-model="bookModel.categoryId">
            <el-option v-for="c in categorys" :key="c.id" :label="c.category_name" :value="c.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图书封面">
          <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
                     name="file" :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
            <img v-if="bookModel.image_url" :src="bookModel.image_url" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="图书简介">
          <div class="editor">
            <quill-editor theme="snow" v-model:content="bookModel.text" contentType="html">
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addBook">添加</el-button>
          <el-button type="info" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 编辑图书弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑图书信息" width="40%">
      <el-form
          ref="userEditForm"
          :model="bookModel"
          label-width="100px"
          style="padding-right: 30px"
      >
        <el-form-item label="图书名称" prop="username">
          <el-input
              v-model="bookModel.book_name"
              minlength="1"
              maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="password">
          <el-input
              v-model="bookModel.password"
              style="width: 240px"
              placeholder="请输入名字"
              show-password
          />
        </el-form-item>
        <el-form-item label="借阅简介" prop="phone" >
          <el-input
              v-model="bookModel.text"
              minlength="1"
              maxlength="55"
          ></el-input>
        </el-form-item>
        <el-form-item label="图书编号" prop="email">
          <el-input
              v-model="bookModel.book_id "
              minlength="1"
              maxlength="55"
          ></el-input>
        </el-form-item>
        <el-form-item label="图书分类" prop="phone" >
          <el-input
              v-model="bookModel.category_id"
              minlength="1"
              maxlength="55"
          ></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="phone" >
          <el-input
              v-model="bookModel.number"
              minlength="1"
              maxlength="55"
          ></el-input>
        </el-form-item>
        <el-form-item label="借阅数量" prop="phone" >
          <el-input
              v-model="bookModel.borrow_count"
              minlength="1"
              maxlength="55"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="editBook" >确认</el-button>
        </div>
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