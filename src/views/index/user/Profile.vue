<template>

    <el-card>
        <template #header>我的资料</template>
        <div class="block">
            <el-avatar :size="100" :src="profile.image_url" />
        </div>
        <el-descriptions title="基础信息">
            <el-descriptions-item label="用户名">{{ profile.username }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ profile.sex }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{ profile.age }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ profile.email }}</el-descriptions-item>
            <el-descriptions-item label="身份">{{ profile.status ? '教师' : '学生' }}</el-descriptions-item>
        </el-descriptions>
        <template #footer>Footer content</template>
    </el-card>

</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const profile = ref(userStore.userInfo);

</script>

<style lang="scss" scoped></style>