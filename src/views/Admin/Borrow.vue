<script setup>
import {
 Search
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import {ElMessage} from "element-plus";
//借阅列表数据
const borrowBooks = ref([
  {
    "book_id": 5,
    "book_name": "无感之谜",
    "user_name": "28038329@qq.com",
    "state": "已还",
    "categoryId": 2,
    "borrowTime": "2023-09-03 11:55:30",
    "backTime": "2023-09-03 11:55:30",
  },
  {
    "book_id": 5,
    "book_name": "生活图书25",
    "user_name": "1010177289@qq.com",
    "state": "借出",
    "categoryId": 2,
    "borrowTime": "2023-09-03 11:55:30",
    "backTime": "2023-09-03 11:55:30",
  },
  {
    "book_id": 5,
    "book_name": "生活图书27",
    "user_name": "111199",
    "state": "已还",
    "categoryId": 2,
    "borrowTime": "2023-09-03 11:55:30",
    "backTime": "2023-09-03 11:55:30",
  },
])
//借阅列表数据模型
const borrowBooksModle = ref([
])
//搜索输入
const input=ref();
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数
// 假设 statusFilters 包含所有可能的状态过滤器
const statusFilters = [
  { text: '借出', value: '借出' },
  { text: '已还', value: '已还' },
];

// 获取所有分类列表
const fetchBorrowBooks = async () => {
  try {
    const result = await borrowBooksListService()
    borrowBooks.value = result.data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    ElMessage.error('获取分类列表失败')
  }
}
fetchBorrowBooks()

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  fetchBorrowBooks()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  fetchBorrowBooks()
}

//模糊搜索
const inputSearch = async () => {
  const keyword = input.value.trim(); // 转换为小写并去除首尾空格
  if (!keyword) {
    await fetchBorrowBooks(); // 如果搜索关键词为空，则显示所有列表
    return; // 如果搜索关键词为空，直接返回，不执行后续操作
  }
  let result = await getBorrowBooks(); // 获取图书列表
  try {
    // 根据书名进行模糊搜索
    total.value = result.data.filter(book =>
        book.book_name.includes(keyword)
    ).length;
    borrowBooks.value = result.data.filter( book =>
        book.book_name.includes(keyword)
    );
  } catch (error) {
    console.error('搜索图书时出错：', error);
    ElMessage.error(result.statusText || '搜索图书时出错：');
  }
  input.value = ''; // 清空输入框
};

// 过滤器方法
const filterTag = (value, row) => {
  // 根据状态过滤
  return row.state === value;
};

// 还书操作
const backBook = (row) => {
  // 执行还书操作
  row.state="已还";
  editBorrowBooks(row);
  fetchBorrowBooks();
};

// 延期操作
const delayTime = (row) => {
  // 执行延期操作
  // 将日期字符串解析为 Date 对象
  const date = new Date(row.backTime);
  date.setHours(date.getDay() + 30);
  // 将新日期对象转换为字符串
  row.backTime= date.toISOString();
  delayBorrowBooks(row);
  fetchBorrowBooks();
};
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>借阅管理</span>
      </div>
    </template>

    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item >
        <el-input v-model="input" style="width: 240px" placeholder="请输入书名" clearabl :prefix-icon="Search"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="inputSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 借阅列表 -->
    <el-table
        ref="multipleTableRef"
        :data="borrowBooks"
        style="width: 100%"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" type="index"  prop="index" width="60"/>
      <el-table-column label="用户" width="400" prop="user_name"></el-table-column>
      <el-table-column label="图书" prop="book_name"></el-table-column>
      <el-table-column
          prop="state"
          label="状态"
          width="100"
          :filters="statusFilters"
          :filter-method="filterTag"
          filter-placement="bottom-end"
      >
        <template #default="scope">
          <el-tag :type="scope.row.state === '借出' ? 'danger' : 'success'" disable-transitions>
            {{ scope.row.state }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="借出时间" prop="borrowTime"></el-table-column>
      <el-table-column label="应还时间" prop="backTime"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button circle plain type="primary" @click="backBook(row)">还书</el-button>
          <el-button circle plain type="primary" @click="delayTime(row)">延期</el-button>
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