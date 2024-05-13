<template>
  <el-container id="components-layout-demo-custom-trigger">
    <el-header style="background: #545c64; padding: 0">
      <div class="header">
        <el-icon size="40px">
          <Platform />
        </el-icon>
        <span class="header-title">智能图书借阅管理系统</span>
        <div class="empty"></div>
        <span>管理员[{{ userStore.userInfo?.username }}]</span>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <span>设置</span>
            <el-icon>
              <CaretBottom />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="password" :icon="EditPen">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <!-- 左侧菜单 -->
      <el-aside width="200px">
        <div class="el-aside__logo"></div>
        <el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff" router>
          <el-menu-item index="/admin/overview">
            <el-icon>
              <View />
            </el-icon>
            <span>总览</span>
          </el-menu-item>
          <el-menu-item index="/admin/borrow">
            <el-icon>
              <List />
            </el-icon>
            <span>借阅管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/book">
            <el-icon>
              <Notebook />
            </el-icon>
            <span>图书管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/comment">
            <el-icon>
              <Comment />
            </el-icon>
            <span>评论管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/category">
            <el-icon>
              <Histogram />
            </el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/user">
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/adminManage" v-if="userStore.userInfo?.is_super_admin">
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>管理员管理</span>
          </el-menu-item>
<!--          <el-sub-menu>-->
<!--            <template #title>-->
<!--              <el-icon>-->
<!--                <Promotion />-->
<!--              </el-icon>-->
<!--              <i class="el-icon-folder"></i>-->
<!--              <span>日志管理</span>-->
<!--            </template>-->
<!--            <el-menu-item index="/admin/login-log">-->
<!--              <i class="el-icon-s-operation"></i>-->
<!--              <span>登录日志</span>-->
<!--            </el-menu-item>-->
<!--            <el-menu-item index="/admin/option-log">-->
<!--              <i class="el-icon-s-operation"></i>-->
<!--              <span>操作日志</span>-->
<!--            </el-menu-item>-->
<!--            <el-menu-item index="/admin/error-log">-->
<!--              <i class="el-icon-s-operation"></i>-->
<!--              <span>错误日志</span>-->
<!--            </el-menu-item>-->
<!--          </el-sub-menu>-->
        </el-menu>
      </el-aside>
      <el-main :style="{ margin: '16px 16px', minHeight: '200px' }">
        <router-view />
      </el-main>
    </el-container>
  </el-container>

  <!-- 添加修改密码弹窗 -->
  <el-dialog v-model="dialog" title="密码修改" width="30%">
    <el-form :model="passwordModel" label-width="100px" style="padding-right: 30px">
      <el-form-item label="旧密码" prop="oldpassword">
        <el-input v-model="passwordModel.old_pwd" minlength="3" maxlength="16"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newpassword">
        <el-input v-model="passwordModel.new_pwd" minlength="3" maxlength="16"></el-input>
      </el-form-item>
      <el-form-item label="重复新密码" prop="repassword">
        <el-input v-model="passwordModel.re_pwd" minlength="3" maxlength="16"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="editPassword"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '@/router/index.js';
import { useTokenStore } from '@/stores/token.js';
import { useUserStore } from '@/stores/user';
import {
  CaretBottom,
  Comment,
  EditPen,
  Histogram, List, Notebook,
  Platform,
  Promotion,
  SwitchButton,
  UserFilled, View
} from "@element-plus/icons-vue";
import { adminLogoutService, editPasswordService } from "@/api/admin.js";

// 使用自定义 hook 创建 token 存储实例
const tokenStore = useTokenStore();

// 响应式变量，控制对话框的显示与隐藏
const dialog = ref(false);

// 响应式对象，包含管理员用户名
const userStore = useUserStore();

//获取管理员信息
// const getCurrentAdmin =async () => {
//   try {
//     let result = await getAdminService();
//     userStore.userInfo.value = result.data;
//     console.log(userStore.userInfo.value)
//   } catch (error) {
//     ElMessage({type: "error", message: "获取当前管理员信息失败",});
//   }
// }
// getCurrentAdmin()

// 响应式对象，存储修改密码表单数据
const passwordModel = ref({
  old_pwd: null,
  new_pwd: null,
  re_pwd: null,
});

// 处理下拉菜单的点击事件
const handleCommand = (command) => {
  if (command === 'logout') {
    // 退出登录
    ElMessageBox.confirm(
      '确认要退出登录?',
      'Warning',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(async () => {
        tokenStore.removeToken();
        await adminLogoutService(); // 调用退出登录的函数
        await router.push('/Login');
        ElMessage({
          type: 'success',
          message: '已退出登录',
        });
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消登录',
        });
      });
  } else {
    // 显示修改密码对话框
    dialog.value = true;
  }
};

// 修改密码
const editPassword = async () => {
  // 调用修改密码的服务函数
  let result = await editPasswordService(passwordModel.value);
  dialog.value = false;
  ElMessage.success('密码修改成功，请重新登录');
  tokenStore.removeToken();
  await router.push('/user/Login');
};
</script>
<style scoped>
/* 添加自定义样式 */
.header {
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  margin-right: 20px;
}

.header-quit {
  cursor: pointer;
  margin-left: 20px;
  color: #1890ff;
}

.empty {
  flex: 1;
}
</style>
