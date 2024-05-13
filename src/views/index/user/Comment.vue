<template>

    <el-card class="page-container">
        <template #header>评论记录</template>

        <el-table style="width: 100%" :data="commentList.slice((pageCurrent - 1) * pageSize, pageCurrent * pageSize)"
            :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }">
            <el-table-column label="图书编号" prop="book_id"> </el-table-column>
            <el-table-column label="图书名称" prop="book_name"></el-table-column>
            <el-table-column label="评论内容" prop="content"></el-table-column>
            <el-table-column label="日期" prop="created_at"></el-table-column>
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

import { getCommentByUserId } from '@/api/comment';
import { getBookInfo } from '@/api/book';

// 借阅记录数据
const commentList = ref([])

//分页模型
const pageCurrent = ref(1)//当前页
const pageTotal = ref(1)//总条数
const pageSize = ref(10)//每页条数

onMounted(() => {
    // 刷新评论记录
    refreshCommentList()
})

// 获取并刷新评论记录
const refreshCommentList = async () => {
    let result = await getCommentByUserId()
    if (result.data.success)
        commentList.value = result.data.data;
    // 获取图书名称
    commentList.value.forEach(async (comment) => {
        let bookInfo = await getBookInfo(comment.book_id);
        if (bookInfo.data.success)
            comment.book_name = bookInfo.data.data.book_name;
    });
    // 计算分条数
    pageTotal.value = commentList.value.length;
}

// 跳转详情页
const jumpDetail = (collect) => router.push('/detail/' + collect.book_id);

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    //刷新列表
    refreshCommentList();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageCurrent.value = num
    //刷新列表
    refreshCommentList();
}

</script>

<style lang="scss" scoped></style>