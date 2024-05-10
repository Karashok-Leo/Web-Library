<script setup>
import {
  Delete, Search
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import {ElMessage} from "element-plus";

//评论列表数据模型
const Comments = ref([
  {
    "user":"bookadmin",
    "bookName": "管理图书22",
    "comment": "6",
    "commentTime": "2024-05-08 11:29:02",
  },
  {
    "user":"bookadmin",
    "bookName": "管理图书22",
    "comment": "6",
    "commentTime": "2024-05-08 11:29:02",
  },
  {
    "user":"bookadmin",
    "bookName": "管理图书22",
    "comment": "6",
    "commentTime": "2024-05-08 11:29:02",
  },
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

//搜索输入
const input=ref();
// 选中的数据项
const selectedItems = ref([]);

//获取评论数据
const getComments =async () => {
  try {
    let result = await getCommentsService();
    //将评论数据存储到Comments中，用于渲染视图
    Comments.value = result.data;
    //更新总条数，用于分页显示
    total.value = result.data.length;
  } catch (error) {
    console.error("获取评论数据失败：", error);
  }
}
getComments()

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  getComments()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  getComments()
}

//模糊搜索
const inputSearch = async () => {
  const keyword = input.value.trim(); // 转换为小写并去除首尾空格
  if (!keyword) {
    await getComments(); // 如果搜索关键词为空，则显示所有评论列表
    return; // 如果搜索关键词为空，直接返回，不执行后续操作
  }
  let result = await getComments(); // 获取评论列表
  try {
    // 根据书名进行模糊搜索
    total.value = result.data.filter(comment =>
        comment.bookName.includes(keyword)
    ).length;
    Comments.value = result.data.filter( comment=>
        comment.bookName.includes(keyword)
    );
  } catch (error) {
    console.error('搜索评论时出错：', error);
    ElMessage.error(result.statusText || '搜索评论时出错：');
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
  deleteCommentService(selectedItems.value);
  // 清空选中项
  selectedItems.value = [];
  //刷新列表
  getComments();
};

//删除单个评论
const deleteComment = (row) => {
  // 调用后端删除数据的函数
  deleteCommentService(row);
  //刷新列表
  getComments();
};

</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>评论管理</span>
      </div>
    </template>

    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item >
        <el-input v-model="input" style="width: 240px" placeholder="请输入书名" clearabl :prefix-icon="Search"/>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="inputSearch">查询</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button  @click="deleteSelectedComments">批量删除</el-button>
      </el-form-item>
    </el-form>

    <!-- 评论列表 -->
    <el-table
        ref="multipleTableRef"
        :data="Comments.slice((pageNum-1)*pageSize,pageNum*pageSize)"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" type="index" prop="index" width="60"/>
      <el-table-column label="用户" width="150" prop="user"></el-table-column>
      <el-table-column label="书名" width="200" prop="bookName"></el-table-column>
      <el-table-column label="评论内容" prop="comment"></el-table-column>
      <el-table-column label="评论时间" prop="commentTime" width="200"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Delete" circle plain type="danger" @click="deleteComment(row)"></el-button>
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
        justify-content: flex-end" />
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
.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>