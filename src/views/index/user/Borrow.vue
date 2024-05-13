<template>

    <el-card class="page-container">
        <template #header>借阅记录</template>

        <el-table style="width: 100%" :data="borrowList.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
            @selection-change="handleSelectionChange" :cell-style="{ textAlign: 'center' }"
            :header-cell-style="{ 'text-align': 'center' }">
            <el-table-column label="图书编号" prop="book_id"> </el-table-column>
            <el-table-column label="图书名称" prop="book_name"></el-table-column>
            <el-table-column label="作者" prop="author"></el-table-column>
            <el-table-column label="当前状态" prop="text"></el-table-column>
            <el-table-column label="借阅日期" prop="number"></el-table-column>
            <el-table-column label="归还日期" prop="borrow_count"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="handleOpen(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteBook(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="暂无数据" />
            </template>
        </el-table>

        <el-pagination :current-page="pageCurrent" :total="pageTotal" :page-size="pageSize"
            :page-sizes="[5, 10, 15, 20]" background layout="total, sizes, prev, pager, next, jumper"
            @size-change="onSizeChange" @current-change="onCurrentChange" />

        <!-- 编辑图书弹窗 -->
        <el-dialog v-model="dialogVisible" title="归还图书" width="40%">
            <el-form :model="bookModel" label-width="100px" style="padding-right: 30px">
                <el-form-item label="图书名称" prop="username">
                    <el-input v-model="bookModel.book_name" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="bookModel.author" style="width: 240px" placeholder="请输入名字" />
                </el-form-item>
                <el-form-item label="图书编号" prop="email">
                    <el-input v-model="bookModel.book_id" minlength="1" maxlength="55"></el-input>
                </el-form-item>
            </el-form>
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

import { onMounted, ref } from 'vue'

// 借阅记录数据
const borrowList = ref([])
//显示还书弹窗
const dialogVisible = ref(false);
//分页模型
const pageCurrent = ref(1)//当前页
const pageTotal = ref(1)//总页数
const pageSize = ref(10)//每页条数

onMounted(() => {
    //获取借阅记录
    refreshBorrowList()
})

const refreshBorrowList = () => {
    //刷新借阅记录
}

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