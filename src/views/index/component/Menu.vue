<template>

        <el-menu active-text-color="#ffd04b" background-color="#545c64" text-color="#fff" :default-active="$route.path"
            router>
            <el-menu-item index="profile">
                <el-icon>
                    <Edit />
                </el-icon>
                <span>个人资料</span>
            </el-menu-item>
            <el-menu-item index="borrow">
                <el-icon>
                    <Collection />
                </el-icon>
                <span>借阅中心</span>
            </el-menu-item>
            <el-menu-item index="message">
                <el-icon>
                    <Message />
                </el-icon>
                <span>我的消息</span>
            </el-menu-item>
            <el-menu-item index="logout">
                <el-icon>
                    <Setting />
                </el-icon>
                <span>退出登录</span>
            </el-menu-item>
        </el-menu>

</template>

<script setup>

import {
    Edit,
    Collection,
    Message,
    Setting,
} from '@element-plus/icons-vue';

</script>

<style scoped>

</style>