import { createRouter, createWebHistory } from 'vue-router'

//导入组件
import HomeVue from '@/views/User/Home.vue'
import DetailVue from '@/views/User/Detail.vue'
import LoginVue from '@/views/User/Login.vue'
import AdminLoginVue from '@/views/User/AdminLogin.vue'
import { Logout } from '@/views/User/Logout.js'
import LayoutVue from '@/views/User/Layout.vue'
import ProfileVue from '@/views/User/Profile.vue'
import BorrowVue from '@/views/User/Borrow.vue'
import CollectVue from '@/views/User/Collect.vue'
import CommentVue from '@/views/User/Comment.vue'

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
import AdminManage from '@/views/Admin/AdminManage.vue'

const routes = [
    {
        path: '/',
        redirect: '/home' // 默认重定向到首页
    },
    {
        path: '/home',
        component: HomeVue // 首页
    },
    {
        path: '/detail/:id',
        component: DetailVue // 书籍详情页
    },
    {
        path: '/login',
        component: LoginVue // 登录页面
    },
    {
        path: '/login/admin',
        component: AdminLoginVue // 登录页面
    },
    {
        path: '/logout',
        redirect: () => Logout() // 登出后重定向到登录页面
    },
    {
        path: '/admin',
        component: Main,
        children: [
            { path: '/admin', redirect: '/admin/overview' }, // 默认重定向到概览页面
            { path: '/admin/overview', component: Overview }, // 总览页面
            { path: '/admin/comment', component: Comment }, // 评论管理页面
            { path: '/admin/user', component: User }, // 用户管理页面
            { path: '/admin/adminManage', component: AdminManage},//管理员管理
            { path: '/admin/book', component: Book }, // 图书管理页面
            { path: '/admin/borrow', component: Borrow }, // 借阅管理页面
            { path: '/admin/category', component: Category }, // 分类管理页面
            { path: '/admin/error-log', component: ErrorLog }, // 错误日志页面
            { path: '/admin/option-log', component: OptionLog }, // 操作日志页面
            { path: '/admin/login-log', component: LoginLog }, // 登录日志页面
        ]
    },
    {
        path: '/user',
        component: LayoutVue,
        redirect: '/user/profile',
        children: [
            { path: '/user/profile', component: ProfileVue }, // 个人资料页面
            { path: '/user/borrow', component: BorrowVue }, // 借阅列表页面
            { path: '/user/collect', component: CollectVue }, // 收藏列表页面
            { path: '/user/comment', component: CommentVue } // 评论列表页面
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router