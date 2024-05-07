import { ref } from 'vue';

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

// 发送验证码
export const sendVerifyCodeService = (email) => {
    // const params = new URLSearchParams();
    // params.append('email', email);
    // return request.post('/admins/sendVerifyCode', params);
};