<script setup>
import { ref } from 'vue'

//登录日志列表数据模型
const LoginLogs = ref([
  {
    "User":"admin123",
    "IP":"127.0.0.1",
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    "LoginTime":"2024-05-08 22:26:54"
  },
  {
    "User":"admin123",
    "IP":"127.0.0.1",
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    "LoginTime":"2024-05-08 22:26:54"
  },
  {
    "User":"admin123",
    "IP":"127.0.0.1",
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    "LoginTime":"2024-05-08 22:26:54"
  },
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(10)//总条数
const pageSize = ref(3)//每页条数

//获取登录日志数据
const getLoginLogs =async () => {
  try {
    let result = await getLoginLogService();
    //将登录日志数据存储到LoginLog中，用于渲染视图
    LoginLogs.value = result.data;
    //更新总条数，用于分页显示
    total.value = result.data.length;
  } catch (error) {
    console.error("获取登录日志数据失败：", error);
  }
}
getLoginLogs()

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  //刷新
  getLoginLogs();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  //刷新
  getLoginLogs();
}

</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>登录日志</span>
      </div>
    </template>

    <!-- 登录日志列表 -->
    <el-table
        :data="LoginLogs.slice((pageNum-1)*pageSize,pageNum*pageSize)"
        border
        style="width: 100%"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column label="序号" prop="index" width="60" type="index"/>
      <el-table-column label="用户" prop="User" width="150"></el-table-column>
      <el-table-column label="IP地址" prop="IP" width="150"></el-table-column>
      <el-table-column label="User-Agent"  prop="User-Agent"></el-table-column>
      <el-table-column label="登陆时间"  prop="LoginTime" width="300"></el-table-column>
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
        background :total="total" @size-change="onSizeChange"
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