<template>

    <el-card class="page-container">
        <template #header>借阅记录</template>
  
        <el-table style="width: 100%" :data="borrowList.slice((pageCurrent - 1) * pageSize, pageCurrent * pageSize)"
            :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }">
            <el-table-column label="图书编号" prop="book_id"> </el-table-column>
            <el-table-column label="图书名称" prop="book_name"></el-table-column>
            <el-table-column label="借阅日期" prop="borrow_time"></el-table-column>
            <el-table-column label="归还日期" prop="return_time"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button plain type="primary" @click="jumpDetail(row)">查看详情</el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="暂无数据" />
            </template>
        </el-table>
  
        <el-pagination :current-page="pageCurrent" :total="pageTotal" :page-size="pageSize"
            :page-sizes="[5, 10, 15, 20]" background layout="total, sizes, prev, pager, next, jumper"
            @size-change="onSizeChange" @current-change="onCurrentChange" />
    </el-card>
  
  </template>
  
  <script setup>
  
  import { ref } from 'vue'
  import { onMounted } from 'vue';
  
  import router from '@/router';

  import {borrowBooksListByUserId, borrowBooksListService} from '@/api/borrow';
  
  // 借阅记录数据
  const borrowList = ref([])
  
  //分页模型
  const pageCurrent = ref(1)//当前页
  const pageTotal = ref(0)//总条数
  const pageSize = ref(10)//每页条数
  
  onMounted(() => {
    // 刷新借阅记录
    refreshBorrowList();
  })
  
  // 获取并刷新借阅记录
  const refreshBorrowList = async () => {
    let result = await borrowBooksListByUserId()
    if (result.data.success)
        borrowList.value = result.data.data;
    // 计算分条数
    pageTotal.value = borrowList.value.length;
  }
  
  // 跳转详情页
  const jumpDetail = (row) => router.push('/detail/' + row.book_id);
  
  //当每页条数发生了变化，调用此函数
  const onSizeChange = (size) => {
    pageSize.value = size
    //刷新列表
    refreshBorrowList();
  }
  //当前页码发生变化，调用此函数
  const onCurrentChange = (num) => {
    pageCurrent.value = num
    //刷新列表
    refreshBorrowList();
  }
  
  </script>
  
  <style lang="scss" scoped></style>