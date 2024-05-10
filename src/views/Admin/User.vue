<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>用户管理</span>
        <div class="extra">
          <el-button type="primary" @click="visibleDrawer = true">添加用户</el-button>
        </div>
      </div>
    </template>

    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item>
        <el-input v-model="input" style="width: 240px" placeholder="请输入" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="inputSearch">搜索</el-button>
        <el-button @click="deleteSelectedComments">批量删除</el-button>
      </el-form-item>
    </el-form>

    <!-- 用户列表 -->
    <el-table
        ref="multipleTableRef"
        :data="users.slice((pageNum-1)*pageSize,pageNum*pageSize)"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户姓名" width="400" prop="user_name"></el-table-column>
      <el-table-column label="ID" prop="user_id"></el-table-column>
      <el-table-column label=性别 prop="sex"></el-table-column>
      <el-table-column label="邮箱" prop="email"> </el-table-column>
      <el-table-column label="年龄" prop="age"></el-table-column>
      <el-table-column label="操作" width="100">
        <template v-slot="scope">
          <el-button :icon="Edit" circle plain type="primary" @click="dialogVisible = true; editUser(scope.row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="delUser(scope.row.user_id)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <!-- 编辑用户弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑用户信息" width="40%" :before-close="handleClose1">
      <el-form
          ref="userEditForm"
          :model="userModel"
          label-width="100px"
          style="padding-right: 30px"
          :rules = "userRules"
      >
        <el-form-item label="用户姓名" prop="username">
          <el-input
              v-model="userModel.user_name"
              minlength="1"
              maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
              v-model="userModel.password"
              style="width: 240px"
              type="password"
              placeholder="请输入密码"
              show-password
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
              v-model="userModel.email"
              minlength="1"
              maxlength="55"
          ></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="userModel.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="userModel.sex" placeholder="请输入性别"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
              class="avatar-uploader"
              :auto-upload="true"
              :show-file-list="false"
              action="/api/upload"
              name="file"
              :headers="{ 'Authorization': tokenStore.token }"
              :on-success="uploadSuccess">
            <img v-if="userModel.avater_url" :src="userModel.avater_url" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose1(()=>{dialogVisible=false})">取消</el-button>
          <el-button type="primary" @click="editUserF(); dialogVisible = false">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawer" title="添加用户" :before-close="handleClose2" direction="rtl" size="50%">
      <!-- 添加用户表单 -->
      <el-form ref="userAddForm" :model="userModel" label-width="100px" :rules="userRules">
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="userModel.user_name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
              v-model="userModel.password"
              style="width: 240px"
              type="password"
              placeholder="请输入密码"
              show-password
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userModel.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="userModel.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="userModel.sex" placeholder="请输入性别"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
                     name="file" :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
            <img v-if="userModel.avater_url" :src="userModel.avater_url" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addUser">添加</el-button>
          <el-button type="info" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 分页条 -->
    <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 10, 15]"
        layout="jumper, total, sizes, prev, pager, next" background
        :total="total"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        style="margin-top: 20px;
        justify-content: flex-end"
    />
  </el-card>
</template>
<script setup>
import {
  Edit,
  Delete, Plus
} from '@element-plus/icons-vue'

//导入token
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {computed, ref} from 'vue'
import {userListService, userAddService, userService, delUserService, editUserService} from "@/api/user.js";

//接收输入数据
const input = ref()
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(10)//每页条数
// 选中的数据项
const selectedItems = ref([]);

//控制抽屉是否显示
const visibleDrawer = ref(false)
//用户数据模型
const users = ref([
  {
    "user_id": 0,
    "user_name": "string",
    "password": "string",
    "email": "string",
    "phone": "string",
    "sex":"男",
    "age":17,
    "avater_url":"15"
  },
  {
    "user_id": 2,
    "user_name": "string",
    "password": "string",
    "email": "string",
    "phone": "string",
    "sex":"男",
    "age":17,
    "avater_url":"15"
  },
  {
    "user_id": 3,
    "user_name": "string",
    "password": "string",
    "email": "string",
    "phone": "string",
    "sex":"男",
    "age":17,
    "avater_url":"15"
  }
])

//添加表单数据模型
const userModel = ref({
  id:-1,
  user_name: "",
  password: "",
  email: "",
  phone: "",
  sex:"",
  age:1,
  avater_url:""
})

//表单验证规则
const userRules = {
  user_name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 10, message: '用户名长度在 1 到 10 个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^[1][3-9][0-9]{9}$/, message: '请输入正确的电话号码', trigger: 'blur' }
  ]
}

//重置用户模型
const getDefaultUserModel = () => ({
  id:-1,
  user_name: "",
  password: "",
  email: "",
  phone: "",
  sex:"",
  age:17,
  avater_url:""
});

//获取用户列表数据
const userList=async () => {
  let result = await userListService();

  //渲染视图
  total.value = result.data.length;
  users.value = result.data;
}
userList();

//添加用户
import {ElMessage, ElMessageBox} from 'element-plus'
const addUser = async () => {
  try {
    // 调用接口添加用户
    let result = await userAddService(userModel.value);
    ElMessage.success(result.statusText ? result.statusText : '添加成功');
    // 让抽屉消失
    visibleDrawer.value = false;
    // 用户模型重置
    userModel.value = getDefaultUserModel();
    // 刷新当前列表
    await userList();
  } catch (error) {
    console.error('添加用户失败:', error);
    ElMessage.error('添加用户失败，请重试');
  }
};
//取消添加图书
const cancel = async () => {
  //图书数据模型置空
  userModel.value = getDefaultUserModel();
  //让抽屉消失
  visibleDrawer.value = false;
}

//用户删除
const delUser= async (id) =>{
  ElMessageBox.confirm("确认删除该用户吗?", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "我再想想",
    type: "warning",
  }).then(async ()=>{
    //调用接口
    let result = await delUserService(id);
    ElMessage({type: "success", message: "删除成功",});
    await userList()
  }).catch(()=>{
    ElMessage({type: "info", message: "删除已取消",});
  })
}
//批量删除
// 处理选中事件
const handleSelectionChange = (selected) => {
  selectedItems.value = selected;
};
// 删除选中项
const deleteSelectedComments = () => {
  // 调用后端删除数据的函数
  deleteUsersService(selectedItems.value);
  // 清空选中项
  selectedItems.value = [];
  //刷新列表
  userList();
};

//编辑用户
const editUser = async (row) =>{
  //获取编辑用户
  let result = await userService(row.id);
  userModel.value = result.data;
}
const editUserF = async () =>{
  try {
    let result = await editUserService(userModel.value.id, userModel.value);
    if (result.status === 200) {
      ElMessage.success(result.statusText || '修改成功');
    } else {
      ElMessage.error(result.statusText || '修改失败');
    }
  } catch (error) {
    console.error('编辑用户时出错：', error);
    ElMessage.error('编辑用户时出错，请重试');
  }
}

// 模糊搜索用户
const inputSearch = async () => {
  const keyword = input.value.trim(); // 转换为小写并去除首尾空格
  if (!keyword) {
    await userList(); // 如果搜索关键词为空，则显示所有用户列表
    return; // 如果搜索关键词为空，直接返回，不执行后续操作
  }
  let result = await userListService(); // 获取所有用户
  try {
    // 根据用户名、邮箱、电话进行模糊搜索
    total.value = result.data.data.filter(user =>
        user.username.includes(keyword)
    ).length;
    users.value = result.data.data.filter(user =>
        user.username.includes(keyword)
    );
  } catch (error) {
    console.error('搜索用户时出错：', error);
    ElMessage.error(result.statusText || '搜索用户时出错：');
  }
  input.value = ''; // 清空输入框
};

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  userList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  userList()
}

//关闭抽屉
const handleClose2 = (done) => {
  ElMessageBox.confirm('你确定要关闭这个抽屉吗?')
      .then(() => {
        //userModel还原
        userModel.value = getDefaultUserModel();
        done()
      })
      .catch(() => {
        // catch error
      })
}

//控制修改用户弹窗
const dialogVisible = ref(false);
const handleClose1 = (done) => {
  ElMessageBox.confirm('你确定要关闭这个弹窗吗?')
      .then(() => {
        //userModel还原
        userModel.value = getDefaultUserModel();
        done()
      })
      .catch(() => {
        // catch error
      })
}
//上传成功的回调函数
const uploadSuccess = (result) => {
  userModel.value.avater_url = result.data;
  console.log(result.data);
}
</script>
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