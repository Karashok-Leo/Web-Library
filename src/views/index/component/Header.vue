<template>

    <el-header>
        <el-menu class="header" mode="horizontal" height="400px" router :ellipsis="false">
            <el-menu-item index="/">
                <img class="logo" src="/icon.svg" alt="Web Library logo" />
            </el-menu-item>
            <div class="gap" />
            <el-button class="login" type="primary" v-if="!tokenStore.token" @click="jumpToLogin()">登录</el-button>
            <el-sub-menu class="my" index="my" v-if="tokenStore.token">
                <template #title>
                    <el-avatar class="avatar" block :src="userStore.userInfo ? userStore.userInfo.image_url : ''" />
                    我的
                </template>
                <el-menu-item index="/user/profile">个人资料</el-menu-item>
                <el-menu-item index="/user/borrow">借阅中心</el-menu-item>
                <el-menu-item index="/user/collect">我的收藏</el-menu-item>
                <el-menu-item index="/user/comment">我的评论</el-menu-item>
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