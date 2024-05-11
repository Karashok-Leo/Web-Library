import { ref } from 'vue';
import request from '@/utils/request';

// 验证码倒计时
export const verifyCounting = ref(0);

// 开始倒计时
export const startCounting = () => {
    verifyCounting.value = 60;
    let timer = setInterval(() => {
        verifyCounting.value--;
        if (verifyCounting.value === 0) {
            clearInterval(timer);
            verifyCounting.value = 0;
        }
    }, 1000);
};

// 发送验证码 0:注册 1:登录
export const sendVerifyCodeService = (email, mode) => request.get(`/captcha?email=${email}&mode=${mode}`);