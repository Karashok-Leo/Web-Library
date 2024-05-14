<template>

    <el-header>
        <el-menu class="header" mode="horizontal" height="400px" router :ellipsis="false">
            <el-menu-item index="/">
                <img class="logo" src="/icon.svg" alt="Web Library logo" />
            </el-menu-item>
            <div class="gap" />
            <el-button class="login" type="primary" v-if="!tokenStore.token" @click="jumpToLogin()">登录</el-button>

            <el-sub-menu class="my" index="/user" v-if="tokenStore.token && userStore.userInfo?.user_id">
                <template #title>
                    <el-avatar class="avatar" block :src="userStore.userInfo?.image_url" />
                    我的
                </template>
                <el-menu-item index="/user/profile">个人资料</el-menu-item>
                <el-menu-item index="/user/borrow">借阅中心</el-menu-item>
                <el-menu-item index="/user/collect">我的收藏</el-menu-item>
                <el-menu-item index="/user/comment">我的评论</el-menu-item>
                <el-menu-item index="/logout">退出登录</el-menu-item>
            </el-sub-menu>

            <el-sub-menu class="my" index="/admin" v-if="tokenStore.token && userStore.userInfo?.admin_id">
                <template #title>
                    <el-avatar class="avatar" block :src="userStore.userInfo?.image_url" />
                    管理
                </template>
                <el-menu-item index="/admin/overview">总览</el-menu-item>
                <el-menu-item index="/admin/borrow">借阅管理</el-menu-item>
                <el-menu-item index="/admin/book">图书管理</el-menu-item>
                <el-menu-item index="/admin/comment">评论管理</el-menu-item>
                <el-menu-item index="/admin/category">分类管理</el-menu-item>
                <el-menu-item index="/admin/adminManage">管理员管理</el-menu-item>
                <el-menu-item index="/admin/user">用户管理</el-menu-item>
                <el-menu-item index="/admin/adminManage" v-if="userStore.userInfo?.is_super_admin">管理员管理
                </el-menu-item>
                <!-- <el-sub-menu>
                    <template #title>日志管理</template>
                    <el-menu-item index="/admin/login-log">登录日志</el-menu-item>
                    <el-menu-item index="/admin/option-log">操作日志</el-menu-item>
                    <el-menu-item index="/admin/error-log">错误日志</el-menu-item>
                </el-sub-menu> -->
                <el-menu-item index="/logout">退出登录</el-menu-item>
            </el-sub-menu>

        </el-menu>
    </el-header>

</template>

<script setup>

import router from '@/router';
import { useTokenStore } from '@/stores/token';
import { useUserStore } from '@/stores/user';

const tokenStore = useTokenStore();
const userStore = useUserStore();
const jumpToLogin = () => router.push('/login');


</script>


<style>
.header {
    .logo {
        height: 80%;
    }

    .gap {
        width: 100%;
    }

    .avatar {
        margin-right: 16px;
    }

    .login {
        width: 60px;
        height: 80%;
    }
}
</style>