<template>

    <el-link class="student" type="info" :underline="false">
        我是学生
    </el-link>
    <el-link class="teacher" type="info" :underline="false" @click="">
        我是教师
    </el-link>
    <el-link class="admin" type="info" :underline="false" @click="">
        我是管理员
    </el-link>

    <div class="login-box">
        <div class="content">
            <h2>登录</h2>
            <el-form-item prop="username">
                <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username" />
            </el-form-item>
            <el-form-item prop="password">
                <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                    v-model="registerData.password" />
            </el-form-item>
            <el-form-item>
                <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
            </el-form-item>
        </div>
    </div>

    <el-link class="forget" type="primary" :underline="false">
        忘记密码？
    </el-link>
    <el-link class="register" type="info" :underline="false" @click="isRegister = true; clearRegisterData()">
        注册
    </el-link>


</template>

<script setup>
import { ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

//控制注册与登录表单的显示， 默认显示登录
const isRegister = ref(false);

//定义数据模型
const registerData = ref({
    username: '',
    password: '',
    repassword: ''
});

//密码校验
const checkRePassword = (rule, value, callback) => {
    if (value === '')
        callback(new Error('亲，再次确认密码'));
    else if (value !== registerData.value.password)
        callback(new Error('亲，确保两次输入密码一致'));
    else
        callback();
};

//elementplus提供的校验规则
//定义表单校验规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 16, message: '5-16位非空字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: "请输入密码", trigger: 'blur' },
        { min: 5, max: 16, message: "5-16位非空字符", trigger: 'blur' }
    ],
    repassword: [
        { validator: checkRePassword, trigger: 'blur' }
    ]
};

import { useRouter } from 'vue-router';
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();
const router = useRouter();

//导入封装好的api接口
import { adminRegisterService, adminLoginService } from '@/api/admin.js';

const register = async () => {
    let DataObj = {
        username: registerData.value.username,
        password: registerData.value.password
    };
    let result = await adminRegisterService(DataObj);
    isRegister.value = false;
    ElMessage.success('注册成功了亲');
};

const login = async () => {
    let result = await adminLoginService(registerData.value);
    console.log('login:' + result.data);
    ElMessage.success('登录成功了亲');
    tokenStore.setToken(result.data.message);
    //console.log(result.data);
    console.log("登录成功后看有没有" + tokenStore.token);
    router.push('/');
};

const clearRegisterData = () => {
    registerData.value = {
        username: '',
        password: '',
        repassword: ''
    };
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