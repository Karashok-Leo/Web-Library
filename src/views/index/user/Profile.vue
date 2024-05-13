<template>

    <el-card>
        <template #header>我的资料</template>
        <div class="block">
            <el-avatar :size="100" :src="profile.image_url" @click="editAvatarDialog = true" />
        </div>
        <el-descriptions title="基础信息">

            <el-descriptions-item label="用户名">
                <el-input v-model="profile.username" style="width: 240px" placeholder="请输入用户名"
                    @change="editProfile" />
            </el-descriptions-item>

            <el-descriptions-item label="性别">
                <el-radio-group v-model="profile.sex" size="large" @change="editProfile">
                    <el-radio-button label="男" value="0" />
                    <el-radio-button label="女" value="1" />
                    <el-radio-button label="你不需要知道这么多..." value="2" />
                </el-radio-group>
            </el-descriptions-item>

            <el-descriptions-item label="年龄">
                <el-input-number v-model="profile.age" :min="0" :max="9000" @change="editProfile" />
            </el-descriptions-item>

            <el-descriptions-item label="邮箱">{{ profile.email }}</el-descriptions-item>

            <el-descriptions-item label="身份">{{ profile.status ? '教师' : '学生' }}</el-descriptions-item>

        </el-descriptions>
        <template #footer>Footer content</template>
    </el-card>

    <el-dialog v-model="editAvatarDialog" title="编辑头像" width="800">
        <el-input v-model="editAvatarUrl" style="width: 240px" placeholder="请输入头像URL" />
        <el-avatar :size="400" :src="editAvatarUrl" v-if="editAvatarUrl" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editAvatarDialog = false">取消</el-button>
        <el-button type="primary" @click="editAvatarDialog = false; profile.image_url = editAvatarUrl; editProfile()">
          确定
        </el-button>
      </div>
    </template>
    </el-dialog>

</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { editProfileService } from '@/api/account';
import { ElMessage } from 'element-plus';

const userStore = useUserStore();

const profile = ref(userStore.userInfo);

const editAvatarDialog = ref(false);
const editAvatarUrl = ref('');

const editProfile = async () => {
    let result = await editProfileService(profile.value.user_id, {
        username: profile.value.username,
        sex: profile.value.sex,
        age: profile.value.age,
        status: profile.value.status,
        image_url: profile.value.image_url
    });
    if (result.data.success) {
        userStore.setUser();
        ElMessage.success('修改成功');
    } else
        ElMessage.error('修改失败');
};

</script>

<style lang="scss" scoped></style>