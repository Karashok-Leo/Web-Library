import { createRouter, createWebHistory } from 'vue-router'

//导入组件
import LoginVue from '@/views/index/user/Login.vue'
import Main from '@/views/Admin/Main.vue'
import Comment from '@/views/Admin/Comment.vue'
import Overview from '@/views/Admin/Overview.vue'
import User from '@/views/Admin/User.vue'
import Book from '@/views/Admin/Book.vue'
import Borrow from '@/views/Admin/Borrow.vue'
import Category from '@/views/Admin/Category.vue'
import ErrorLog from '@/views/Admin/ErrorLog.vue'
import OptionLog from '@/views/Admin/OptionLog.vue'
import LoginLog from '@/views/Admin/LoginLog.vue'
import LayoutVue from '@/views/index/user/Layout.vue'
import ProfileVue from '@/views/index/user/Profile.vue'
import BorrowVue from '@/views/index/user/Borrow.vue'
import MessageVue from '@/views/index/user/Message.vue'

const routes = [
    {
        path: '/login',
        component: LoginVue
    },
    {
        path: '/admin',
        component: Main,
        children: [
            { path: '', redirect: 'overview' }, // 默认重定向到概览页面
            { path: 'overview', component: Overview }, // 总览页面
            { path: 'comment', component: Comment }, // 评论管理页面
            { path: 'user', component: User }, // 用户管理页面
            { path: 'book', component: Book }, // 图书管理页面
            { path: 'borrow', component: Borrow }, // 借阅管理页面
            { path: 'category', component: Category }, // 分类管理页面
            { path: 'error-log', component: ErrorLog }, // 错误日志页面
            { path: 'option-log', component: OptionLog }, // 操作日志页面
            { path: 'login-log', component: LoginLog }, // 登录日志页面
        ]
    },
    {
        path: '/',
        component: LayoutVue,
        children: [
            { path: '/profile', component: ProfileVue },
            { path: '/borrow', component: BorrowVue },
            { path: '/message', component: MessageVue }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router