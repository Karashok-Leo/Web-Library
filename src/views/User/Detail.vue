<template>
  <div class="detail">
    <Header />

    <div class="content">
      <div class="content-top">

        <el-card class="img-card">
          <img :src="bookInfo.image_url" />
        </el-card>
        <el-card class="info-card">
          <el-descriptions :title="bookInfo.book_name" :column="1" border>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Avatar />
                  </el-icon>
                  作者
                </div>
              </template>
              {{ bookInfo.author }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Reading />
                  </el-icon>
                  分类
                </div>
              </template>
              {{ bookInfo.category_name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <Check />
                  </el-icon>
                  图书状态
                </div>
              </template>
              {{ bookInfo.current_number > 0 ? '可借阅' : '已借出' }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <More />
                  </el-icon>
                  剩余数量
                </div>
              </template>
              {{ bookInfo.current_number }}本
              <!-- <el-tag size="small">School</el-tag> -->
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <MoreFilled />
                  </el-icon>
                  已被借出
                </div>
              </template>
              {{ bookInfo.borrow_count }}次
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="menu-card">
          <el-row class="menu-button">
            <el-button type="primary" :icon="Plus" :disabled="bookInfo.current_number <= 0" @click="borrow()">{{
              bookInfo.current_number <= 0 ? '已借出' : '借阅' }} </el-button>
          </el-row>
          <el-row class="menu-button">
            <el-button type="primary" :icon="Collection" @click="collect()">{{ collectId ? '取消收藏' : '收藏'
              }}</el-button>
          </el-row>
          <el-row class="menu-button">
            <el-button type="primary" :icon="Share" @click="share()">分享</el-button>
          </el-row>
        </el-card>
      </div>
      <div class="content-bottom">
        <!--简介-->
        <div class="desc">
          <div class="desc-title">简介</div>
          <p class="desc-content" style="">{{ bookInfo.text }}</p>
        </div>

        <!--评论-->
        <div class="comment">
          <div class="comment-title">发表新的评论</div>
          <div class="comment-publish">
            <el-icon>
              <Avatar />
            </el-icon>
            <el-input v-model="commentRef" style="width: 240px" placeholder="评论此书..." />
            <el-button class="comment-button" type="primary" @click="comment()" round>发送</el-button>
          </div>
          <div class="comment-content">
            <div class="comment-item" v-for="item in commentList">
              <div class="flex-item">
                <el-icon class="avator">
                  <Avatar />
                </el-icon>
                <div class="person">
                  <div class="name">{{ item.username }}</div>
                  <div class="time">{{ item.updated_at }}</div>
                </div>
              </div>
              <p class="comment-content">{{ item.content }}</p>
            </div>
            <div class="comment-empty">
              <el-empty description="没有更多了..." />
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="QRCodeDialog" title="借阅二维码" width="500">
      <el-image :src="QRCodeURL" lazy />
    </el-dialog>

    <Footer />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

// 组件
import Header from '@/views/Common/Header.vue'
import Footer from '@/views/Common/Footer.vue'

// API
import { getBookInfo, getCategoryInfo } from "@/api/book";
import { borrowBook } from '@/api/borrow'
import { getCollect, addCollect, deleteCollect } from "@/api/collect";
import { getCommentByBookId, leaveComment } from "@/api/comment";

// Element-Plus
import { Avatar, Reading, Check, More, MoreFilled, Plus, Collection, Share } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

import router from '@/router';
import { useRoute } from "vue-router/dist/vue-router";
import { useTokenStore } from '@/stores/token';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const tokenStore = useTokenStore();
const userStore = useUserStore();

// 书籍ID
const bookId = ref(null)

// 书籍信息
const bookInfo = ref({})

// 二维码弹窗
const QRCodeDialog = ref(false)

// 二维码URL
const QRCodeURL = ref('')

// 收藏ID
const collectId = ref(null)

// 评论数据
const commentList = ref([])

// 评论输入框
const commentRef = ref()

onMounted(() => {
  bookId.value = parseInt(route.path.split('/')[2]);
  refreshBookInfo();
  refreshCollectId();
  refreshCommentList();
})

// 刷新书籍信息
const refreshBookInfo = () => getBookInfo(bookId.value).then(result => {
  bookInfo.value = result.data.data;
  refreshCategoryName();
});

// 刷新分类名称
const refreshCategoryName = () => getCategoryInfo(bookInfo.value.category_id).then(result => bookInfo.value.category_name = result.data.data.category_name);

// 检查是否登录
const checkLogin = () => {
  if (!tokenStore.token) {
    ElMessageBox.alert('请先登录').then(() => router.push('/login'))
    return false;
  }
  else if (!userStore.userInfo.user_id && userStore.userInfo.admin_id) {
    ElMessageBox.alert('当前为管理员账户，请先作为用户登录')
      .then(() => router.push('/login'))
      .catch(() => { })
    return false;
  }
  return true;
}

// 获取收藏ID
const refreshCollectId = () => {
  if (!tokenStore.token || !userStore.userInfo.user_id) return;
  getCollect(userStore.userInfo.user_id).then(result => {
    result.data.data.forEach(collect => {
      if (collect.book_id === bookId.value) {
        collectId.value = collect.collection_id;
        return;
      }
    })
  })
  collectId.value = null;
}

// 借阅
const borrow = () => {
  if (!checkLogin()) return;
  if (bookInfo.value.current_number <= 0) {
    ElMessageBox.alert('该书已借出，请选择其他书籍');
    return;
  }
  ElMessageBox.confirm('是否确认借阅？').then(() => {
    borrowBook(bookId.value).then((result) => {
      const blob = new Blob([result.data], { type: "image/png" });
      QRCodeURL.value = URL.createObjectURL(blob);
      QRCodeDialog.value = true;
    })
  });
}

// 收藏
const collect = () => {
  if (!checkLogin()) return;
  let result = collectId.value ? deleteCollect(collectId.value) : addCollect(bookId.value, userStore.userInfo.user_id);
  result.then(() => refreshCollectId());
}

// 分享
const share = () => {
  console.log(bookInfo.value)
  let content = '分享一个非常好玩的网站 ' + window.location.href
  let shareHref = 'http://service.weibo.com/share/share.php?title=' + content
  window.open(shareHref)
}

const comment = () => {
  if (!checkLogin()) return;
  let result = leaveComment(commentRef.value, bookId.value);
  if (result.data.success) {
    commentRef.value = '';
    refreshCommentList();
  }
}

const refreshCommentList = () => getCommentByBookId(bookId.value).then(result => commentList.value = result.data.data);

</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  width: 1100px;
  margin: 4px auto;
}

.content-top {
  display: flex;
  margin: 89px 0 40px;
  overflow: hidden;

  .img-card {
    // -webkit-box-flex: 0;
    // -ms-flex: 0 0 235px;
    // flex: 0 0 235px;
    margin-right: 40px;

    img {
      // width: 200px;
      // height: 186px;
      // display: block;
    }
  }

  .info-card {
    // -webkit-box-flex: 1;
    // -ms-flex: 1;
    // flex: 1;
    // display: flex;
    // text-align: left;
    // padding: 0;
    margin-right: 40px;
    width: 400px;
    margin-bottom: auto;

    .cell-item {
      margin: auto;
      display: flex;
      align-items: center;
    }
  }

  .menu-card {
    display: flex;
    flex-direction: column;
    margin-bottom: auto;

    .menu-button {
      margin-top: 15px;
      width: 100%;
      color: #152844;
      font-weight: 600;
      font-size: 16px;
      line-height: 18px;
      height: 30px;
    }
  }

}

.desc {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;

  .desc-content {
    color: #484848;
    font-size: 16px;
    line-height: 26px;
    padding-left: 12px;
    margin: 11px 0;
    white-space: pre-wrap;
  }
}



.comment {
  .comment-title {
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    height: 22px;
    color: #152844;
    margin: 24px 0 12px;
  }

  .comment-publish {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;


    .content-input {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      background: #f6f9fb;
      border-radius: 4px;
      height: 32px;
      line-height: 32px;
      color: #484848;
      padding: 5px 12px;
      white-space: nowrap;
      outline: none;
      border: 0px;
    }

    .comment-button {
      margin-left: 10px;
      background: #4684e2;
      border-radius: 4px;
      -webkit-box-flex: 0;
      -ms-flex: 0 0 80px;
      flex: 0 0 80px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      height: 32px;
      line-height: 32px;
      outline: none;
      border: 0px;
      cursor: pointer;
    }
  }

  .comment-content {
    .comment-item {
      .flex-item {
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding-top: 16px;

        .avator {
          -webkit-box-flex: 0;
          -ms-flex: 0 0 40px;
          flex: 0 0 40px;
          width: 40px;
          height: 40px;
          margin-right: 12px;
          border-radius: 50%;
          cursor: pointer;
        }

        .person {
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
        }

        .name {
          color: #152844;
          font-weight: 600;
          font-size: 14px;
          line-height: 22px;
          height: 22px;
          cursor: pointer;
        }

        .time {
          color: #5f77a6;
          font-size: 12px;
          line-height: 16px;
          height: 16px;
          margin-top: 2px;
        }

        .float-right {
          color: #4684e2;
          font-size: 14px;
          float: right;

          span {
            margin-left: 19px;
            cursor: pointer;
          }

          .num {
            color: #152844;
            margin-left: 6px;
            cursor: auto;
          }
        }
      }
    }
  }

  .comment-content {
    margin-top: 8px;
    color: #484848;
    font-size: 14px;
    line-height: 22px;
    padding-bottom: 16px;
    border-bottom: 1px dashed #cedce4;
    margin-left: 52px;
    overflow: hidden;
    word-break: break-word;
  }
}
</style>