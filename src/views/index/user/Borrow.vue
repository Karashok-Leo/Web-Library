<template>

    <el-card class="page-container">
        <template #header>
            <span>借阅记录</span>
        </template>

        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item>
                <el-input v-model="input" style="width: 240px" placeholder="请输入书名" clearabl :prefix-icon="Search" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="inputSearch">搜索</el-button>
                <el-button @click="deleteSelectedComments">批量删除</el-button>
            </el-form-item>
        </el-form>

        <!-- 图书列表 -->
        <el-table style="width: 100%" @selection-change="handleSelectionChange" :cell-style="{ textAlign: 'center' }"
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

        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px;
        justify-content: flex-end" />

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

import { ref } from 'vue'

// 借阅记录数据
const borrowList = ref([])
//显示还书弹窗
const dialogVisible = ref(false);
//分页模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

</script>

<style lang="scss" scoped></style>