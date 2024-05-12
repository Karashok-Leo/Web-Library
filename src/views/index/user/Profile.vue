<template>

    <el-card>
        <template #header>我的资料</template>
        <div class="block">
            <el-avatar :size="100" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
        </div>
        <el-descriptions title="基础信息">
            <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
            <el-descriptions-item label="性别">kooriookami</el-descriptions-item>
            <el-descriptions-item label="年龄">kooriookami</el-descriptions-item>
            <el-descriptions-item label="邮箱">18100000000</el-descriptions-item>
        </el-descriptions>
        <template #footer>Footer content</template>
    </el-card>

</template>

<script setup>

</script>

<style lang="scss" scoped></style>