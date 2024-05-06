import { createRouter, createWebHistory } from 'vue-router'

//导入组件
import LoginVue from '@/views/Login.vue'
// import LayoutVue from '@/views/Layout.vue'
// import UserVue from '@/views/user/User.vue'
// import CategoryVue from '@/views/category/Category.vue'
// import OrderVue from '@/views/order/Order.vue'

const routes = [
    {
        path: '/login',
        component: LoginVue
    }/* ,
    {
        path: '/',
        component: LayoutVue,
        redirect: '/category',
        children: [
            { path: '/category', component: CategoryVue },
            { path: '/order', component: OrderVue },
            { path: '/user', component: UserVue },
        ]
    }, */
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router