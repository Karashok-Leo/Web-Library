<template>

    <el-card class="page-container">
        <template #header>评论记录</template>

        <el-table style="width: 100%" :data="commentList.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
            @selection-change="handleSelectionChange" :cell-style="{ textAlign: 'center' }"
            :header-cell-style="{ 'text-align': 'center' }">
            <el-table-column label="图书编号" prop="book_id"> </el-table-column>
            <el-table-column label="图书名称" prop="book_name"></el-table-column>
            <el-table-column label="评论内容" prop="content"></el-table-column>
            <el-table-column label="日期" prop="number"></el-table-column>
            <el-table-column label="操作">
                <el-button :icon="Delete" circle plain type="danger" @click="deleteBook(row)"></el-button>
            </el-table-column>
            <template #empty>
                <el-empty description="暂无数据" />
            </template>
        </el-table>

        <el-pagination :current-page="pageCurrent" :total="pageTotal" :page-size="pageSize"
            :page-sizes="[5, 10, 15, 20]" background layout="total, sizes, prev, pager, next, jumper"
            @size-change="onSizeChange" @current-change="onCurrentChange" />

        <!-- 编辑图书弹窗 -->
        <el-dialog v-model="dialogVisible" title="删除评论" width="40%">
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="editBook">确认</el-button>
                </div>
            </template>
        </el-dialog>
    </el-card>

</template>

<script setup>

import { ref } from 'vue'

// 借阅记录数据
const commentList = ref([])
//显示删除弹窗
const dialogVisible = ref(false);
//分页模型
const pageCurrent = ref(1)//当前页
const pageTotal = ref(1)//总页数
const pageSize = ref(10)//每页条数

onMounted(() => {
    // 刷新评论记录
    refreshCommentList()
})

// 获取并刷新评论记录
const refreshCommentList = () => {
    getBooks()
}

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