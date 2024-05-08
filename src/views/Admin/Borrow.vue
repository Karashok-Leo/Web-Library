<script setup>
import {
  Edit,
  Delete, Search
} from '@element-plus/icons-vue'

import { ref } from 'vue'

//图书分类数据模型
const categorys = ref([
  {
    "id": 3,
    "categoryName": "美食",
    "categoryAlias": "my",
    "createTime": "2023-09-02 12:06:59",
    "updateTime": "2023-09-02 12:06:59"
  },
  {
    "id": 4,
    "categoryName": "娱乐",
    "categoryAlias": "yl",
    "createTime": "2023-09-02 12:08:16",
    "updateTime": "2023-09-02 12:08:16"
  },
  {
    "id": 5,
    "categoryName": "军事",
    "categoryAlias": "js",
    "createTime": "2023-09-02 12:08:33",
    "updateTime": "2023-09-02 12:08:33"
  }
])


//图书列表数据模型
const books = ref([
  {
    "id": 5,
    "title": "陕西旅游攻略",
    "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
    "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
    "state": "上架",
    "categoryId": 2,
    "createTime": "2023-09-03 11:55:30",
    "updateTime": "2023-09-03 11:55:30",
    "checked":false
  },
  {
    "id": 5,
    "title": "陕西旅游攻略",
    "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
    "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
    "state": "上架",
    "categoryId": 2,
    "createTime": "2023-09-03 11:55:30",
    "updateTime": "2023-09-03 11:55:30",
    "checked":false
  },
  {
    "id": 5,
    "title": "陕西旅游攻略",
    "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
    "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
    "state": "上架",
    "categoryId": 2,
    "createTime": "2023-09-03 11:55:30",
    "updateTime": "2023-09-03 11:55:30",
    "checked":false
  },
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  bookList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  bookList()
}

//显示
const handleOpen=()=>{
  dialogVisible.value=true
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>借阅管理</span>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item >
        <el-input v-model="input" style="width: 240px" placeholder="请输入书名" clearabl :prefix-icon="Search"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="inputSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 图书列表 -->
    <el-table
        ref="multipleTableRef"
        :data="books"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" type="index"  prop="index" width="60"/>
      <el-table-column label="用户" width="400" prop="title"></el-table-column>
      <el-table-column label="图书" prop="categoryName"></el-table-column>
      <el-table-column
          prop="statues"
          label="状态"
          width="100"
          :filters="[
        { text: '借出', value: '借出' },
        { text: '已还', value: '已还' },
      ]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
      >
        <template #default="scope">
          <el-tag
              :type="scope.row.tag === '借出' ? '' : 'success'"
              disable-transitions
          >{{ scope.row.tag }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="借出时间" prop="state"></el-table-column>
      <el-table-column label="应还时间" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button circle plain type="primary" @click="handleOpen">还书</el-button>
          <el-button circle plain type="primary">延期</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 分页条 -->
    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
                   layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
                   @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
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

/* 抽屉样式 */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>