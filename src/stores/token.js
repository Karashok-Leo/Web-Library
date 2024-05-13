//定义store
import { defineStore } from "pinia";
import { ref } from 'vue'

export const useTokenStore = defineStore(
    'token',
    () => {
        // Token
        const token = ref('')

        // 修改Token
        const setToken = (newToken) => {
            token.value = newToken
        }

        // 移除Token
        const removeToken = () => {
            token.value = ''
        }

        return {
            token, setToken, removeToken
        }
    },
    {
        persist: true
    }
)