
import { useTokenStore } from '@/stores/token';
import { useUserStore } from '@/stores/user';
import { userLogoutService } from '@/api/account'

export const Logout = () => {
    userLogoutService().then(response => {
        useTokenStore().removeToken()
        useUserStore().removeUser()
    });
    return '/'
};