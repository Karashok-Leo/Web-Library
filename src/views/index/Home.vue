<template>

    <Header class="header" />
    <el-container class="container">

        <div class="suggestion">
            <span class="demonstration">Motion blur the switch (default)</span>
            <el-carousel height="200px" motion-blur>
                <el-carousel-item v-for="item in 4" :key="item">
                    <h3 class="small justify-center" text="2xl">{{ item }}</h3>
                </el-carousel-item>
            </el-carousel>
        </div>

        <div class="content">

            <el-pagination class="pagination" :current-page="pageCurrent" :total="pageTotal" :page-size="pageSize"
                :page-sizes="[5, 10, 15, 20]" background layout="total, sizes, prev, pager, next, jumper"
                @size-change="onSizeChange" @current-change="onCurrentChange" />

            <div class="book-list">
                <div v-for="item in bookList" :key="item.id" @click="handleDetail(item)"
                    class="book-item">
                    <div class="book-cover">
                        <img :src="item.image_url" />
                    </div>
                    <div class="book-info">
                        <h3 class="info-name">{{ item.book_name }}</h3>
                        <p class="info-author"> {{ item.author }} </p>
                        <p class="info-text"> {{ item.text }} </p>
                    </div>
                </div>
                <el-empty v-if="bookList.length <= 0" description="暂无数据" />
            </div>

            <el-pagination class="pagination" :current-page="pageCurrent" :total="pageTotal" :page-size="pageSize"
                :page-sizes="[5, 10, 15, 20]" background layout="total, sizes, prev, pager, next, jumper"
                @size-change="onSizeChange" @current-change="onCurrentChange" />

        </div>

    </el-container>
    <Footer class="footer" />

</template>

<script setup>

import { onMounted, ref } from 'vue'
import router from '@/router'
import { getBookInfoList, getBookInfo } from '@/api/book'

import Header from '@/views/index/component/Header.vue'
import Footer from '@/views/index/component/Footer.vue'

// 图书列表
const bookList = ref([{
    "book_id": 1,
    "book_name": "newbook",
    "author": "author",
    "text": "this is text",
    "image_url": "this is a url",
    "borrow_count": 0,
    "current_number": 19,
    "number": 20,
    "category_id": 22,
    "product_id": 33,
    "created_at": "2024-05-11 15:20:14",
    "updated_at": "2024-05-11 15:22:01"
},
{
    "book_id": 2,
    "book_name": "book111",
    "author": "author",
    "text": "this is text",
    "image_url": "this is a url",
    "borrow_count": 0,
    "current_number": 10,
    "number": 10,
    "category_id": 3,
    "product_id": 46,
    "created_at": "2024-05-11 15:23:38",
    "updated_at": "2024-05-11 15:23:38"
},
{
    "book_id": 2,
    "book_name": "book111",
    "author": "author",
    "text": "this is text",
    "image_url": "this is a url",
    "borrow_count": 0,
    "current_number": 10,
    "number": 10,
    "category_id": 3,
    "product_id": 46,
    "created_at": "2024-05-11 15:23:38",
    "updated_at": "2024-05-11 15:23:38"
}])
//分页模型
const pageCurrent = ref(1)//当前页
const pageTotal = ref(1)//总页数
const pageSize = ref(10)//每页条数

onMounted(() => {
    // 获取图书列表
    refreshBookList()
});

// 获取并刷新评论记录
const refreshBookList = () => {
    getBookInfoList().then(result => bookList.value = result.data.data)
}

// 跳转到详情页
const handleDetail = (item) => {
  let text = router.resolve({name: 'detail', query: {id: item.book_id}})
  window.open(text.href, '_blank')
}

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    //刷新列表
    refreshBookList();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageCurrent.value = num
    //刷新列表
    refreshBookList();
}

</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.suggestion {
    width: 60%;
    margin-top: 50px;
    margin-left: 16%;
    margin-right: 16%;
    text-align: center;
}

.content {
    width: 60%;
    margin-left: 16%;
    margin-right: 16%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.demonstration {
    color: var(--el-text-color-secondary);
}

.pagination {
    margin-top: 50px;
    margin-bottom: 50px;
}

.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}

.book-list {
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;

    .book-item {
        min-width: 255px;
        max-width: 255px;
        position: relative;
        flex: 1;
        margin-right: 20px;
        height: fit-content;
        border-radius: 4px;
        overflow: hidden;
        margin-top: 16px;
        cursor: pointer;

        .book-cover {
            background: #eaf1f5;
            font-size: 0;
            text-align: center;
            height: 156px;
            padding: 8px 0;

            img {
                height: 100%;
                display: block;
                margin: 0 auto;
                border-radius: 4px;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
            }
        }

        .book-info {
            background: #f6f9fb;
            text-align: center;
            height: 108px;
            overflow: hidden;
            padding: 0 16px;

            .info-name {
                color: #1c355a;
                font-weight: 500;
                font-size: 16px;
                line-height: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                margin: 12px 0 8px;
            }

            .info-author {
                color: #6f6f6f;
                font-size: 12px;
                line-height: 14px;
                margin-top: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .info-text {
                color: #6f6f6f;
                font-size: 12px;
                line-height: 14px;
                margin-top: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

        }
    }
}
</style>