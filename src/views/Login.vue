<template>

    <div class="login-box">
        <div class="content">
            <h2>{{ identityMap[identity] + (isRegister ? '注册' : '登录') }}</h2>

            <el-form ref="form" size="large" autocomplete="off" :rules="rules" :model="formData">
                <el-form-item prop="username">
                    <el-input class="form-item" :prefix-icon="User" placeholder="请输入用户名" v-model="formData.username" />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input class="form-item" name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="formData.password" />
                </el-form-item>
                <el-form-item prop="password" v-if="isRegister">
                    <el-input class="form-item" name="password" :prefix-icon="Lock" type="password"
                        placeholder="请再次输入密码" v-model="formData.repassword" />
                </el-form-item>
                <el-form-item>
                    <el-button id="submit" class="form-item" type="primary" plain auto-insert-space @click="submit">
                        {{ isRegister ? '注册' : '登录' }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>

    <el-link class="student" type="info" :underline="false" @click="identity = 0">
        我是学生
    </el-link>
    <el-link class="teacher" type="info" :underline="false" @click="identity = 1">
        我是教师
    </el-link>
    <el-link class="admin" type="info" :underline="false" @click="identity = 2">
        我是管理员
    </el-link>

    <el-link class="forget" type="primary" :underline="false">
        忘记密码？
    </el-link>
    <el-link class="register" type="info" :underline="false" @click="isRegister = !isRegister; clearFormData()">
        {{ isRegister ? '登录' : '注册' }}
    </el-link>


</template>

<script setup>
import { ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

//导入封装好的api接口
import { studentRegisterService, studentLoginService, teacherRegisterService, teacherLoginService, adminRegisterService, adminLoginService } from '@/api/account.js';

import { useRouter } from 'vue-router';
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();
const router = useRouter();

//控制登录身份 0:学生 1:教师 2:管理员
const identity = ref(0);
const identityMap = ref(['学生', '教师', '管理员']);

//控制注册与登录表单的显示，默认显示登录
const isRegister = ref(false);

//定义数据模型
const formData = ref({
    username: '',
    password: '',
    repassword: ''
});

//定义表单校验规则
const rules = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 5, max: 16, message: '5-16位非空字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: "密码不能为空", trigger: 'blur' },
        { min: 5, max: 16, message: "5-16位非空字符", trigger: 'blur' }
    ],
    repassword: [
        {
            validator: (rule, value, callback) => {
                if (value === '')
                    callback(new Error('请再次输入密码'));
                else if (value !== formData.value.password)
                    callback(new Error('两次输入密码不一致'));
                else
                    callback();
            },
            trigger: 'blur'
        }
    ]
};

const clearFormData = () => {
    this.$refs.form.resetFields();
    formData.value = {
        username: '',
        password: '',
        repassword: ''
    };
};

const submit = () => {
    if (isRegister.value)
        register();
    else
        login();
};

const register = async () => {
    let DataObj = {
        username: formData.value.username,
        password: formData.value.password
    };
    let result = await adminRegisterService(DataObj);
    isRegister.value = false;
    ElMessage.success('注册成功');
};

const login = async () => {
    let result = await adminLoginService(formData.value);
    console.log('login:' + result.data);
    ElMessage.success('登录成功');
    tokenStore.setToken(result.data.message);
    //console.log(result.data);
    console.log("登录成功后看有没有" + tokenStore.token);
    router.push('/');
};
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    height: 100vh;
    background-color: #eff0f4;
    overflow: hidden;
}

.login-box {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    // margin: 150px auto;
    justify-content: space-between;
}

.login-box .content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    width: 500px;
    height: 500px;
    padding: 80px 20px;
    box-shadow:
        inset 30px 30px 30px rgba(0, 0, 0, 0.05),
        40px 50px 30px rgba(0, 0, 0, 0.05),
        40px 45px 45px rgba(0, 0, 0, 0.05),
        inset -30px -30px 40px rgba(255, 255, 255, 0.9);
}

.login-box .content {
    border-radius: 52% 48% 33% 67% / 38% 45% 55% 62%;
    transition: 0.5s;
}

.login-box .content:hover {
    border-radius: 50%;
}

.login-box .content::before {
    content: "";
    position: absolute;
    top: 20%;
    left: 20%;
    width: 15%;
    height: 15%;
    background-color: #fff;
    border-radius: 50%;
    opacity: 0.9;
}

.login-box .content::after {
    content: "";
    position: absolute;
    top: 90px;
    left: 110px;
    width: 15px;
    height: 15px;
    background-color: #fff;
    border-radius: 50%;
    opacity: 0.9;
}

.login-box .content .form-item {
    position: relative;
    width: 225px;
    box-shadow:
        15px 15px 10px rgba(0, 0, 0, 0.05),
        15px 10px 15px rgba(0, 0, 0, 0.025);
}

.login-box .content .form-item::before {
    content: "";
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 65%;
    height: 5px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
}

#submit {
    left: 25%;
    width: 50%;
    color: #fff;
    border-radius: 25px;
    background-color: #ff0f5b;
    box-shadow:
        inset 2px 5px 10px rgba(0, 0, 0, 0.1),
        15px 15px 10px rgba(0, 0, 0, 0.05),
        15px 10px 15px rgba(0, 0, 0, 0.025);
    transition: 0.5s;
}

#submit:hover {
    left: 0%;
    width: 100%;
}

.el-link {
    position: absolute;
    width: 150px;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    text-decoration: none;
    color: #fff;
    font-size: 20px;
    transition: 0.25s;
}

.el-link::before {
    content: "";
    position: absolute;
    top: 20%;
    left: 20%;
    width: 15%;
    height: 15%;
    border-radius: 50%;
    background: #fff;
    opacity: 0.45;
}

.el-link:hover {
    border-radius: 50%;
}

.student {
    top: 25%;
    left: 27%;
    background: #16e771;
    border-radius: 48% 52% 34% 66% / 56% 49% 51% 44%;
    box-shadow:
        inset 10px 10px 10px rgba(1, 254, 127, 0.05),
        15px 25px 10px rgba(1, 254, 47, 0.1),
        15px 20px 20px rgba(1, 254, 64, 0.1),
        inset -10px -10px 15px rgba(255, 255, 255, 0.5);
}

.teacher {
    top: 8%;
    left: 45%;
    background: #ffd025;
    border-radius: 56% 44% 37% 63% / 50% 38% 62% 50%;
    box-shadow:
        inset 10px 10px 10px rgba(254, 203, 1, 0.05),
        15px 25px 10px rgba(254, 208, 1, 0.1),
        15px 20px 20px rgba(254, 203, 1, 0.1),
        inset -10px -10px 15px rgba(255, 255, 255, 0.5);
}

.admin {
    top: 25%;
    right: 27%;
    background: #fa32ae;
    border-radius: 52% 48% 50% 50% / 60% 62% 38% 40%;
    box-shadow:
        inset 10px 10px 10px rgba(254, 1, 208, 0.05),
        15px 25px 10px rgba(254, 1, 212, 0.1),
        15px 20px 20px rgba(254, 1, 199, 0.1),
        inset -10px -10px 15px rgba(255, 255, 255, 0.5);
}

.forget {
    bottom: 15%;
    right: 33%;
    background: #c61dff;
    border-radius: 44% 56% 65% 35% / 57% 58% 42% 43%;
    box-shadow:
        inset 10px 10px 10px rgba(190, 1, 254, 0.05),
        15px 25px 10px rgba(190, 1, 254, 0.1),
        15px 20px 20px rgba(190, 1, 254, 0.1),
        inset -10px -10px 15px rgba(255, 255, 255, 0.5);
}

.register {
    bottom: 15%;
    left: 33%;
    background: #01b4ff;
    color: #fff;
    border-radius: 49% 51% 52% 48% / 63% 59% 41% 37%;
    box-shadow:
        inset 10px 10px 10px rgba(1, 180, 255, 0.05),
        15px 25px 10px rgba(1, 180, 255, 0.1),
        15px 20px 20px rgba(1, 180, 255, 0.1),
        inset -10px -10px 15px rgba(255, 255, 255, 0.5);
}
</style>