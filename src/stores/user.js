//定义store
import { defineStore } from "pinia";
import { ref } from 'vue'
import { getUserInfoService } from "@/api/account";

export const useUserStore = defineStore(
    'user',
    () => {
        // UserInfo
        const userInfo = ref(null)

        // 修改UserInfo
        const setUser = async () => {

            let user = await getUserInfoService();
            if (user.data.success) {
                userInfo.value = user.data.data;
                console.log(user.data.data);
            } else
                console.log('setUser失败');
        }

        const removeUser = () => userInfo.value = null;

        return {
            userInfo, setUser, removeUser
        }
    },
    {
        persist: true
    }
)