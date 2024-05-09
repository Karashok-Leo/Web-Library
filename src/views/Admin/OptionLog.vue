<script setup>
import {
 Search
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import {ElMessage} from "element-plus";

//操作日志列表数据模型
const OptionLogs = ref([
  {
    "requestWay": "GET",
    "requestURL": "/myapp/admin/tag/list",
    "optionIP": "127.0.0.1",
    "optionTime": "2024-05-09 12:33:46",
    "timeConsume":"31ms"
  },
  {
    "requestWay": "GET",
    "requestURL": "/myapp/admin/tag/list",
    "optionIP": "127.0.0.1",
    "optionTime": "2024-05-09 12:33:46",
    "timeConsume":"31ms"
  },
  {
    "requestWay": "GET",
    "requestURL": "/myapp/admin/tag/list",
    "optionIP": "127.0.0.1",
    "optionTime": "2024-05-09 12:33:46",
    "timeConsume":"31ms"
  },
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

//搜索输入
const input=ref();

//获取登录日志数据
const getOptionLogs =async () => {
  try {
    let result = await getOptionLogService();
    //将登录日志数据存储到LoginLog中，用于渲染视图
    OptionLogs.value = result.data;
    //更新总条数，用于分页显示
    total.value = result.data.length;
  } catch (error) {
    console.error("获取操作日志数据失败：", error);
  }
}
getOptionLogs()

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  //刷新
  getOptionLogs();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  //刷新
  getOptionLogs();
}

//模糊搜索
const inputSearch = async () => {
  const keyword = input.value.trim(); // 转换为小写并去除首尾空格
  if (!keyword) {
    await getOptionLogs(); // 如果搜索关键词为空，则显示所有操作日志列表
    return; // 如果搜索关键词为空，直接返回，不执行后续操作
  }
  let result = await getOptionLogs(); // 获取操作日志列表
  try {
    // 根据请求方式、请求URL、操作IP进行模糊搜索
    total.value = result.data.filter(log =>
        log.requestWay.includes(keyword) ||
        log.requestURL.includes(keyword) ||
        log.optionIP.includes(keyword)
    ).length;
    OptionLogs.value = result.data.filter(log =>
        log.requestWay.includes(keyword) ||
        log.requestURL.includes(keyword) ||
        log.optionIP.includes(keyword)
    );
  } catch (error) {
    console.error('搜索操作日志时出错：', error);
    ElMessage.error(result.statusText || '搜索操作日志时出错：');
  }
  input.value = ''; // 清空输入框
};
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>操作日志</span>
      </div>
    </template>

    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item >
        <el-input v-model="input" style="width: 240px" placeholder="请输入" clearabl :prefix-icon="Search"/>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="inputSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作日志列表 -->
    <el-table
        :data="OptionLogs.slice((pageNum-1)*pageSize,pageNum*pageSize)"
        border
        style="width: 100%"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column label="序号" type="index"  prop="index" width="60"/>
      <el-table-column label="请求方式" width="150" prop="requestWay"></el-table-column>
      <el-table-column label="请求URL" width="500" prop="requestURL"></el-table-column>
      <el-table-column label="操作IP" prop="optionIP"></el-table-column>
      <el-table-column label="操作时间" prop="optionTime"></el-table-column>
      <el-table-column label="耗时" prop="timeConsume" width="100"></el-table-column>
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