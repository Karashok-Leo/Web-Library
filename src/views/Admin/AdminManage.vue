<script setup>
import {
  Edit,
  Delete, Search
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { Plus } from '@element-plus/icons-vue'

//显示弹窗
const dialogVisible=ref(false);
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数
//导入token
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();

//管理员列表数据模型
const Admins = ref([
  {
    "admin_id": 1,
    "username": "test",
    "is_super_admin": 1,
    "created_at": "2024-05-07 20:37:42",
    "updated_at": "2024-05-07 20:37:42",
    "password":"555"
  },
  {
    "admin_id": 2,
    "username": "test2",
    "is_super_admin": 0,
    "created_at": "2024-05-12 00:09:15",
    "updated_at": "2024-05-12 00:09:15",
    "password":"555"
  },
  {
    "admin_id": 2,
    "username": "test2",
    "is_super_admin": 0,
    "created_at": "2024-05-12 00:09:15",
    "updated_at": "2024-05-12 00:09:15",
    "password":"555"
  }
])

//搜索输入
const input=ref();
// 选中的数据项
const selectedItems = ref([]);
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const AdminModel = ref({
  admin_id: '',
  username: '',
  is_super_admin: '',
  created_at: '',
  updated_at: '',
  password:''
})

//重置管理员模型
const getDefaultAdminModel = () => ({
  admin_id: '',
  username: '',
  is_super_admin: '',
  created_at: '',
  updated_at: '',
  password:''
});

//获取管理员数据
const getAdmins =async () => {
  try {
    let result = await getAdminInfoListService();
    //将数据存储，用于渲染视图
    Admins.value = result.data;
    //更新总条数，用于分页显示
    total.value = result.data.length;
  } catch (error) {
    ElMessage({type: "error", message: "获取列表失败",});
  }
}
getAdmins()

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  //刷新列表
  getAdmins();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  //刷新列表
  getAdmins();
}

//添加管理员
import {ElMessage, ElMessageBox} from 'element-plus'
import {addAdminService, deleteAdminService, editAdminService, getAdminInfoListService} from "@/api/admin.js";
const addAdmin = async () => {
  try {
    //调用接口
    let result = await addAdminService(AdminModel.value);
    if (result.status === 200) {
      ElMessage.success(result.statusText || '添加成功');
    } else {
      ElMessage.error(result.statusText || '添加失败');
    }
    //管理员模型置空
    AdminModel.value = getDefaultAdminModel();
    //让抽屉消失
    visibleDrawer.value = false;
    //刷新当前列表
    await getAdmins();
  } catch (error) {
    console.error('添加管理员时出错：', error);
    ElMessage.error('添加管理员时出错，请重试');
    //让抽屉消失
    visibleDrawer.value = false;
  }
}

//取消添加管理员
const cancel = async () => {
  //管理员数据模型置空
  AdminModel.value = getDefaultAdminModel();
  //让抽屉消失
  visibleDrawer.value = false;
}

//模糊搜索
const inputSearch = async () => {
  const keyword = input.value.trim(); // 转换为小写并去除首尾空格
  if (!keyword) {
    await getAdmins(); // 如果搜索关键词为空，则显示所有评论列表
    return; // 如果搜索关键词为空，直接返回，不执行后续操作
  }
  try {
    let result = await getAdminInfoListService();
    // 根据管理员名进行模糊搜索
    total.value = result.data.filter(Admin =>
        Admin.username.includes(keyword)
    ).length;
    Admins.value = result.data.filter( Admin =>
        Admin.username.includes(keyword)
    );
  } catch (error) {
    console.error('搜索管理员时出错：', error);
    ElMessage({type: "error", message: "搜索管理员出错",});
  }
  input.value = ''; // 清空输入框
};

//删除管理员
const deleteAdmin = (row) => {
  ElMessageBox.confirm("确认删除该管理员吗?", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "我再想想",
    type: "warning",
  }).then(async ()=>{
    //调用接口
    let result = await deleteAdminService(row.id);
    ElMessage({type: "success", message: "删除成功",});
    await getAdmins();
  }).catch(()=>{
    ElMessage({type: "info", message: "删除已取消",});
  })
};

//修改管理员信息
//显示
const handleOpen=async (row) => {
  dialogVisible.value = true
  //获取编辑管理员
  AdminModel.value = row;
}
const editAdmin=async () => {
  //编辑管理员
  try {
    let result = await editAdminService(AdminModel.value.admin_id, AdminModel.value);
    if (result.status === 200) {
      ElMessage.success(result.statusText || '修改成功');
    } else {
      ElMessage.error(result.statusText || '修改失败');
    }
    dialogVisible.value = false;
  } catch (error) {
    console.error('编辑管理员时出错：', error);
    ElMessage.error('编辑管理员时出错，请重试');
  }
}

//弹窗关闭
const handleClose=()=>{
  //管理员模型置空
  AdminModel.value = getDefaultAdminModel();
  //弹窗关闭
  dialogVisible.value=false;
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>管理员管理</span>
        <div class="extra">
          <el-button type="primary" @click="visibleDrawer = true">添加管理员</el-button>
        </div>
      </div>
    </template>

    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item >
        <el-input v-model="input" style="width: 240px" placeholder="请输入姓名" clearabl :prefix-icon="Search"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="inputSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 管理员列表 -->
    <el-table
        ref="multipleTableRef"
        :data="Admins.slice((pageNum-1)*pageSize,pageNum*pageSize)"
        style="width: 100%"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="管理员编号" prop="admin_id"> </el-table-column>
      <el-table-column label="管理员姓名" width="100" prop="username"></el-table-column>
      <el-table-column label="超级管理员" prop="is_super_admin"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="handleOpen(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteAdmin(row)"></el-button>
        </template>
      </el-table-column>
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
        background
        :total="total"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        style="margin-top: 20px;
        justify-content: flex-end"
    />

    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawer" title="添加管理员" direction="rtl" size="50%">
      <!-- 添加管理员表单 -->
      <el-form :model="AdminModel" label-width="100px">
        <el-form-item label="管理员姓名">
          <el-input v-model="AdminModel.username" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="ID">
          <el-input v-model="AdminModel.admin_id" placeholder="请输入ID"></el-input>
        </el-form-item>
        <el-form-item label="超级管理员">
          <el-input v-model="AdminModel.is_super_admin" placeholder="是：填1；否：填0"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addAdmin">添加</el-button>
          <el-button type="info" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 编辑管理员弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑管理员信息" width="40%">
      <el-form
          ref="userEditForm"
          :model="AdminModel"
          label-width="100px"
          style="padding-right: 30px"
      >
        <el-form-item label="管理员姓名" prop="username">
          <el-input
              v-model="AdminModel.username"
              minlength="1"
              maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="超级管理员" prop="phone" >
          <el-input
              v-model="AdminModel.is_super_admin"
              minlength="1"
              maxlength="55"
          ></el-input>
        </el-form-item>
        <el-form-item label="password" prop="phone" >
          <el-input
              v-model="AdminModel.password"
              minlength="1"
              maxlength="55"
              show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="editAdmin" >确认</el-button>
        </div>
      </template>
    </el-dialog>
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