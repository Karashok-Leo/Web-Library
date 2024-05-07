<template>

    <div class="login-box">
        <div class="content">
            <h2>{{ (isAdmin ? '管理员' : (identity ? '教师' : '学生')) + (isRegister ? '注册' : '登录') }}</h2>

            <el-form ref="loginForm" size="large" autocomplete="off" :rules="loginRules" :model="loginData"
                v-if="!isRegister">
                <el-form-item prop="username">
                    <el-input class="form-item" :prefix-icon="User" placeholder="请输入用户名" v-model="loginData.username" />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input class="form-item" name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="loginData.password" />
                </el-form-item>
                <el-form-item>
                    <el-button id="submit" class="form-item" type="primary" plain auto-insert-space @click="submit">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>

            <el-form ref="registerForm" size="large" autocomplete="off" :rules="registerRules" :model="registerData"
                v-if="isRegister">
                <el-form-item prop="username">
                    <el-input class="form-item" :prefix-icon="User" placeholder="请输入用户名"
                        v-model="registerData.username" />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input class="form-item" name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="registerData.password" />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input class="form-item" name="password" :prefix-icon="Lock" type="password"
                        placeholder="请再次输入密码" v-model="registerData.repassword" />
                </el-form-item>
                <el-form-item prop="email">
                    <el-input class="form-item" name="email" :prefix-icon="Lock" type="email" placeholder="请输入邮箱"
                        v-model="registerData.email" />
                </el-form-item>
                <div class="form-item" style="display: flex;">
                    <el-form-item>
                        <el-input name="verifyCode" :prefix-icon="Lock" type="text" placeholder="请输入验证码"
                            v-model="registerData.verifyCode"/>
                    </el-form-item>
                    <el-button id="sendCode" class="form-item" type="primary" plain auto-insert-space
                        :disabled="verifyCounting" @click="sendVerifyCode">
                        {{ verifyCounting ? verifyCounting + '秒后重新获取' : '发送验证码' }}
                    </el-button>
                </div>
                <el-form-item>
                    <el-button id="submit" class="form-item" type="primary" plain auto-insert-space @click="submit">
                        注册
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>

    <el-link class="identity" type="info" :underline="false" v-if="!isAdmin" @click="identity = !identity">
        {{ '我是' + (identity ? '学生' : '教师') }}
    </el-link>
    <el-link class="admin" type="info" :underline="false"
        @click="isAdmin = !isAdmin; isRegister = false; clearFormData(); updateBackground()">
        {{ '我是' + (isAdmin ? '用户' : '管理员') }}
    </el-link>

    <el-link class="forget" type="primary" :underline="false" v-if="!isAdmin" :disabled="isRegister">
        忘记密码？
    </el-link>
    <el-link class="register" type="info" :underline="false" v-if="!isAdmin"
        @click="isRegister = !isRegister; clearFormData()">
        {{ isRegister ? '登录' : '注册' }}
    </el-link>


</template>

<script setup>
import { ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

//导入封装好的api接口
import { studentRegisterService, studentLoginService, teacherRegisterService, teacherLoginService, adminRegisterService, adminLoginService } from '@/api/account.js';
import { verifyCounting, startCounting, sendVerifyCodeService } from '@/api/verify';

import { useRouter } from 'vue-router';
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();
const router = useRouter();

const updateBackground = () => {
    document.body.style.backgroundColor = isAdmin.value ? '#f5d9ea' : '#eff0f4';
};

//控制登录身份
// false:学生  true:教师
const identity = ref(false);
// false:用户  true:管理员
const isAdmin = ref(false);

//控制注册与登录表单的显示，默认显示登录
const isRegister = ref(false);

//定义登录表单数据模型
const loginData = ref({
    username: '',
    password: ''
});

//定义注册表单数据模型
const registerData = ref({
    username: '',
    password: '',
    repassword: '',
    email: '',
    verifyCode: ''
});

//定义登录表单校验规则
const loginRules = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 5, max: 16, message: '5-16位非空字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: "密码不能为空", trigger: 'blur' },
        { min: 5, max: 16, message: "5-16位非空字符", trigger: 'blur' }
    ]
};

//定义注册表单校验规则
const registerRules = {
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
    ],
    email: [
        { required: true, message: '邮箱不能为空', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
};

const clearFormData = () => {
    loginData.value = {
        username: '',
        password: ''
    };
    registerData.value = {
        username: '',
        password: '',
        repassword: '',
        email: '',
        verifyCode: ''
    };
};

const submit = () => {
    if (isRegister.value)
        register();
    else
        login();
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

const register = async () => {
    let DataObj = {
        username: formData.value.username,
        password: formData.value.password
    };
    let result = await adminRegisterService(DataObj);
    isRegister.value = false;
    ElMessage.success('注册成功');
};

const sendVerifyCode = async () => {
    // let result = await sendVerifyCodeService(registerData.value.email);
    // console.log('sendVerifyCode:' + result.data);
    if (/* result.data.code === 200 */true) {
        startCounting();
        ElMessage.success('验证码发送成功');
    } else
        ElMessage.error('验证码发送失败');
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
    overflow: hidden;
    background-color: #eff0f4;
}

.login-box {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;

    .content {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        width: 600px;
        height: 600px;
        padding: 80px 20px;
        box-shadow:
            inset 30px 30px 30px rgba(0, 0, 0, 0.05),
            40px 50px 30px rgba(0, 0, 0, 0.05),
            40px 45px 45px rgba(0, 0, 0, 0.05),
            inset -30px -30px 40px rgba(255, 255, 255, 0.9);
    }

    .content {
        border-radius: 52% 48% 33% 67% / 38% 45% 55% 62%;
        transition: 0.5s;

        &:hover {
            border-radius: 50%;
        }

        .form-item {
            position: relative;
            width: 300px;
            box-shadow:
                15px 15px 10px rgba(0, 0, 0, 0.05),
                15px 10px 15px rgba(0, 0, 0, 0.025);
        }
    }
}

// .login-box .content::before {
//     content: "";
//     position: absolute;
//     top: 20%;
//     left: 20%;
//     width: 15%;
//     height: 15%;
//     background-color: #fff;
//     border-radius: 50%;
//     opacity: 0.9;
// }

// .login-box .content::after {
//     content: "";
//     position: absolute;
//     top: 15%;
//     left: 15%;
//     width: 12%;
//     height: 12%;
//     background-color: #fff;
//     border-radius: 50%;
//     opacity: 0.9;
//     box-shadow:
//         inset 15px 15px 10px rgba(0, 0, 0, 0.05),
//         inset 15px 10px 15px rgba(0, 0, 0, 0.025);
// }

#sendCode {
    width: 145px;
    margin-left: 5%;
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

    &::before {
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

    &:hover {
        left: 0%;
        width: 100%;
    }
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

    &::before {
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

    &:hover {
        border-radius: 50%;
    }
}

.identity {
    top: 10%;
    left: 27%;
    background: #16e771;
    border-radius: 48% 52% 34% 66% / 56% 49% 51% 44%;
    box-shadow:
        inset 10px 10px 10px rgba(1, 254, 127, 0.05),
        15px 25px 10px rgba(1, 254, 47, 0.1),
        15px 20px 20px rgba(1, 254, 64, 0.1),
        inset -10px -10px 15px rgba(255, 255, 255, 0.5);
}

.admin {
    top: 10%;
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
    bottom: 10%;
    right: 27%;
    background: #c61dff;
    border-radius: 44% 56% 65% 35% / 57% 58% 42% 43%;
    box-shadow:
        inset 10px 10px 10px rgba(190, 1, 254, 0.05),
        15px 25px 10px rgba(190, 1, 254, 0.1),
        15px 20px 20px rgba(190, 1, 254, 0.1),
        inset -10px -10px 15px rgba(255, 255, 255, 0.5);
}

.register {
    bottom: 10%;
    left: 27%;
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