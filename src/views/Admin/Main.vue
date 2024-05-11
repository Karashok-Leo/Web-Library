<template>
  <el-container id="components-layout-demo-custom-trigger">
    <el-header style="background: #fff; padding: 0">
      <div class="header">
        <el-icon size="40px"><Platform /></el-icon>
        <span class="header-title">智能图书借阅管理系统</span>
        <div class="empty"></div>
        <span>管理员[{{ userStore.admin_user_name }}]</span>
        <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <span>设置</span>
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
          <template #dropdown>
            <el-dropdown-menu >
              <el-dropdown-item command="password" :icon="EditPen">修改个人信息</el-dropdown-item>
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
        <el-menu active-text-color="#ffd04b" background-color="#232323"  text-color="#fff" router>
          <el-menu-item index="/Overview">
            <el-icon><View />
            </el-icon>
            <span>总览</span>
          </el-menu-item>
          <el-menu-item index="/Borrow">
            <el-icon><List />
            </el-icon>
            <span>借阅管理</span>
          </el-menu-item>
          <el-menu-item index="/Book">
            <el-icon><Notebook />
            </el-icon>
            <span>图书管理</span>
          </el-menu-item>
          <el-menu-item index="/Comment">
            <el-icon><Comment />
            </el-icon>
            <span>评论管理</span>
          </el-menu-item>
          <el-menu-item index="/Category">
            <el-icon><Histogram />
            </el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="/User">
            <el-icon><UserFilled />
            </el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-sub-menu>
            <template #title>
              <el-icon>
                <Promotion />
              </el-icon>
              <i class="el-icon-folder"></i>
              <span>日志管理</span>
            </template>
            <el-menu-item index="/LoginLog">
              <i class="el-icon-s-operation"></i>
              <span>登录日志</span>
            </el-menu-item>
            <el-menu-item index="/OptionLog">
              <i class="el-icon-s-operation"></i>
              <span>操作日志</span>
            </el-menu-item>
            <el-menu-item index="/ErrorLog">
              <i class="el-icon-s-operation"></i>
              <span>错误日志</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main :style="{ margin: '16px 16px', minHeight: '200px' }">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import { ref } from 'vue';
import {
  CaretBottom,
  Comment,
  EditPen,
  Histogram,
  List,
  Notebook,
  Platform,
  Promotion,
  SwitchButton,
  UserFilled,
  View,
} from "@element-plus/icons-vue";

const userStore=ref({
  admin_user_name: 'Admin', // 替换为你的管理员用户名
});

const handleLogout = () => {
  // 实现退出登录功能的方法
};

const handleClick = (index) => {
  // 导航到相应的路由路径
  switch (index) {
    case '/category':
      this.$router.push({ path: '/category' });
      break;
    case '/order':
      this.$router.push({ path: '/order' });
      break;
    case '/user':
      this.$router.push({ path: '/user' });
      break;
      // 添加其他菜单项的处理逻辑
    default:
      break;
  }
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
  
