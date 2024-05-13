<template>

    <Header class="header"/>
    <el-container class="content">
        <div class="sidebar">
            <h1>Username</h1>
            <Menu />
        </div>
        <el-main class="main">
            <router-view></router-view>
        </el-main>
    </el-container>
    <Footer class="footer"/>

</template>

<script setup>

import Header from '@/views/Common/Header.vue'
import Footer from '@/views/Common/Footer.vue'
import Menu from '@/views/Common/Menu.vue'

</script>

<style lang="scss" scoped>
</style>