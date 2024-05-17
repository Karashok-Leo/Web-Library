<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>用户管理</span>
      </div>
    </template>

    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item>
        <el-input v-model="input" style="width: 240px" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="inputSearch">搜索</el-button>
        <el-button @click="deleteSelectedComments">批量删除</el-button>
      </el-form-item>
    </el-form>

    <!-- 用户列表 -->
    <el-table ref="multipleTableRef" :data="users.slice((pageNum - 1) * pageSize, pageNum * pageSize)" style="width: 100%"
      @selection-change="handleSelectionChange" :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{ 'text-align': 'center' }">
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户姓名" width="400" prop="username"></el-table-column>
      <el-table-column label="ID" prop="user_id"></el-table-column>
      <el-table-column label=性别 prop="sex"></el-table-column>
      <el-table-column label="邮箱" prop="email"> </el-table-column>
      <el-table-column label="年龄" prop="age"></el-table-column>
      <el-table-column label="操作" width="100">
        <template v-slot="scope">
          <el-button :icon="Edit" circle plain type="primary"
            @click="dialogVisible = true"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="delUser(scope.row.user_id)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <!-- 编辑用户弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑用户信息" width="40%" :before-close="handleClose1">
      <el-form ref="userEditForm" :model="userModel" label-width="100px" style="padding-right: 30px" :rules="userRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userModel.username" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userModel.password" style="width: 240px" type="password" placeholder="请输入密码"
            show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose1(() => { dialogVisible = false })">取消</el-button>
          <el-button type="primary" @click="editUserF(); dialogVisible = false">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分页条 -->
    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
      layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
      @current-change="onCurrentChange" style="margin-top: 20px;
        justify-content: flex-end" />
  </el-card>
</template>
<script setup>
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'

//导入token
import { useTokenStore } from '@/stores/token.js';
useTokenStore();
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus";
import { delUserService, userListService, deleteUserByGroupService, userService, editUserService } from "@/api/user.js";
//接收输入数据
const input = ref()
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(10)//每页条数
// 选中的数据项
const selectedItems = ref([]);

//用户数据模型
const users = ref([
  {
    "user_id": 0,
    "username": "string",
    "password": "string",
    "email": "string",
    "sex": "男",
    "age": 17,
    "image_url": "15"
  },
  {
    "user_id": 2,
    "username": "string",
    "password": "string",
    "email": "string",
    "sex": "男",
    "age": 17,
    "image_url": "15"
  },
  {
    "user_id": 3,
    "username": "string",
    "password": "string",
    "email": "string",
    "sex": "男",
    "age": 17,
    "image_url": "15"
  }
])

//添加表单数据模型
const userModel = ref({
  user_id: -1,
  username: "",
  password: "",
  email: "",
  sex: "",
  age: 1,
  image_url: ""
})

//表单验证规则
const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 10, message: '用户名长度在 1 到 10 个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' }
  ]
}

//重置用户模型
const getDefaultUserModel = () => ({
  user_id: -1,
  user_name: "",
  password: "",
  email: "",
  sex: "",
  age: '',
  image_url: ""
});

//获取用户列表数据
const userList = async () => {
  try {
    let result = await userListService();
    //渲染视图
    total.value = result.data.data.length;
    users.value = result.data.data;
  } catch (error) {
    ElMessage({ type: "error", message: "获取列表失败", });
  }
}
userList();

//用户删除
const delUser = async (id) => {
  ElMessageBox.confirm("确认删除该用户吗?", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "我再想想",
    type: "warning",
  }).then(async () => {
    //调用接口
    await delUserService(id);
    ElMessage({ type: "success", message: "删除成功", });
    await userList()
  }).catch(() => {
    ElMessage({ type: "info", message: "删除已取消", });
  })
}


//批量删除
// 处理选中事件
const handleSelectionChange = (selected) => {
  selectedItems.value = selected;
};
// 删除选中项
const deleteSelectedComments = () => {
  // 检查是否有选中项
  if (!Array.isArray(selectedItems.value) || selectedItems.value.length === 0) {
    ElMessage({ type: "info", message: "请先选择要删除的项", });
    return;
  }
  ElMessageBox.confirm("确认删除选中的项吗?", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      // 调用后端删除数据的函数
      await deleteUserByGroupService(selectedItems.value);
      // 清空选中项
      selectedItems.value = [];
      // 刷新列表
      await userList();
      ElMessage({ type: "success", message: "删除成功", });
    })
    .catch(() => {
      ElMessage({ type: "info", message: "删除已取消", });
    });
};

//编辑用户
const editUser = async (row) => {
  //获取编辑用户
  let result = await editUserService(row.user_id);
  if (result.data.success)
    userModel.value = result.data.data;
}
const editUserF = async () => {
  try {
    let result = await editUserService(userModel.value.user_id, userModel.value);
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

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
