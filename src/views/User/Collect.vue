<template>

    <el-card class="page-container">
        <template #header>收藏书目</template>

        <el-table style="width: 100%"
            :data="collectList.slice((pageCurrent - 1) * pageSize, pageCurrent * pageSize)"
            :cell-style="{ textAlign: 'center' }" :header-cell-style="{ 'text-align': 'center' }">
            <el-table-column label="图书编号" prop="book_id"> </el-table-column>
            <el-table-column label="图书名称" prop="book_name"></el-table-column>
            <el-table-column label="作者" prop="author"></el-table-column>
            <el-table-column label="分类" prop="category_name"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button plain type="primary" @click="jumpDetail(row)">查看详情</el-button>
                    <el-button plain type="danger" @click="unCollect(row)">取消收藏</el-button>
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

import { getCollect, deleteCollect } from '@/api/collect';
import { getBookInfo, getCategoryInfo } from '@/api/book';
import { ElMessage } from 'element-plus';

// 收藏列表
const collectList = ref([])

//分页模型
const pageCurrent = ref(1)//当前页
const pageTotal = ref(0)//总条数
const pageSize = ref(10)//每页条数

onMounted(() => {
    // 刷新列表
    refreshCollectList();
})

// 刷新收藏列表
const refreshCollectList = async () => {
    let result = await getCollect();
    if (result.data.success)
        collectList.value = result.data.data;
    // 获取图书信息
    collectList.value.forEach(async (collect) => {
        let bookInfo = await getBookInfo(collect.book_id);
        if (bookInfo.data.success) {
            collect.book_id = bookInfo.data.data.book_id;
            collect.book_name = bookInfo.data.data.book_name;
            collect.author = bookInfo.data.data.author;

            let categoryInfo = await getCategoryInfo(bookInfo.data.data.category_id);
            if (categoryInfo.data.success)
                collect.category_name = categoryInfo.data.data.category_name;
        }
    });
    console.log(collectList.value);
    // 计算总条数
    pageTotal.value = collectList.value.length;
}

// 跳转详情页
const jumpDetail = (collect) => router.push('/detail/' + collect.book_id);

const unCollect = async (collect) => {
    let result = await deleteCollect(collect.collection_id);
    if (result.data.success) {
        refreshCollectList();
        ElMessage.success('取消收藏成功');
    }
}

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    //刷新列表
    refreshCollectList();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageCurrent.value = num
    //刷新列表
    refreshCollectList();
}

</script>

<style lang="scss" scoped></style>