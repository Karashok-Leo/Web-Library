<template>

    <el-header>
        <el-menu class="header" mode="horizontal" height="400px" router :ellipsis="false">
            <el-menu-item index="/">
                <img class="logo" src="/public/icon.svg" alt="Web Library logo" />
            </el-menu-item>
            <div class="gap" />
            <el-sub-menu class="my" index="my">
                <template #title>我的</template>
                <el-menu-item index="/user/profile">个人资料</el-menu-item>
                <el-menu-item index="/user/borrow">借阅中心</el-menu-item>
                <el-menu-item index="/user/message">我的消息</el-menu-item>
                <el-menu-item index="/user/logout">退出登录</el-menu-item>
            </el-sub-menu>
        </el-menu>
    </el-header>

</template>

<script setup>

</script>


<style>
.header {
    .logo {
        height: 80%;
    }

    .gap {
        width: 100%;
    }
}
</style>