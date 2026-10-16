// src/router/routes.js
// 路由配置：命名路由、动态路由、嵌套路由、通配符 404、重定向、
// 路由元信息（meta）、全局前置守卫（beforeEach）实现访问控制与页面标题更新
import { createRouter, createWebHistory } from 'vue-router'
import { useHomeStore } from '@/store/home.js'
import '@/assets/global.css'

// 页面组件
import PersonalHome from '@/views/PersonalHome.vue'
import ProjectDetail from '@/views/ProjectDetail.vue'
import Login from '@/views/Login.vue'
import Admin from '@/views/Admin.vue'
import AdminProfile from '@/views/AdminProfile.vue'
import AdminProjects from '@/views/AdminProjects.vue'
import AdminArticles from '@/views/AdminArticles.vue'
import ArticleList from '@/views/ArticleList.vue'
import ArticleDetail from '@/views/ArticleDetail.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
    {
        // 根路径重定向到个人主页（redirect）
        path: '/',
        redirect: { name: 'home' }
    },
    {
        // 命名路由：个人主页（公开展示页面）
        path: '/home',
        name: 'home',
        component: PersonalHome,
        meta: {
            title: '个人主页',
            showInNav: true   // 在顶部导航栏显示
        }
    },
    {
        // 文章列表页（公开）
        path: '/articles',
        name: 'article-list',
        component: ArticleList,
        meta: {
            title: '文章列表',
            showInNav: true
        }
    },
    {
        // 动态路由：项目详情页，通过 :id 传递路由参数
        path: '/project/:id',
        name: 'project-detail',
        component: ProjectDetail,
        meta: {
            title: '项目详情'
        }
    },
    {
        // 动态路由：文章详情页
        path: '/article/:id',
        name: 'article-detail',
        component: ArticleDetail,
        meta: {
            title: '文章详情'
        }
    },
    {
        // 身份认证页面：登录
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            title: '登录'
        }
    },
    {
        // 嵌套路由：后台管理（父路由提供布局，子路由渲染在内部 RouterView 中）
        path: '/admin',
        name: 'admin',
        component: Admin,
        redirect: { name: 'admin-profile' },  // 进入 /admin 默认显示个人信息
        meta: {
            title: '后台管理',
            requiresAuth: true   // 访问该路由需要登录
        },
        children: [
            {
                // 子路由：个人信息管理
                path: 'profile',
                name: 'admin-profile',
                component: AdminProfile,
                meta: {
                    title: '个人信息管理',
                    requiresAuth: true
                }
            },
            {
                // 子路由：项目管理
                path: 'projects',
                name: 'admin-projects',
                component: AdminProjects,
                meta: {
                    title: '项目管理',
                    requiresAuth: true
                }
            },
            {
                // 子路由：文章管理
                path: 'articles',
                name: 'admin-articles',
                component: AdminArticles,
                meta: {
                    title: '文章管理',
                    requiresAuth: true
                }
            }
        ]
    },
    {
        // 通配符路由：匹配所有未定义路径，展示 404 页面
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound,
        meta: {
            title: '页面未找到'
        }
    }
]

const router = createRouter({
    // 使用 History 模式（createWebHistory），URL 无 # 号
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    // 路由切换时自动滚动到顶部
    scrollBehavior() {
        return { top: 0 }
    }
})

// 全局前置守卫：在每次路由切换前执行
// 1. 根据路由 meta.title 更新浏览器标签页标题
// 2. 对 requiresAuth 路由进行登录校验，未登录则跳转登录页并携带 redirect
router.beforeEach((to, from) => {
    // 更新页面标题
    document.title = to.meta.title ? `${to.meta.title} - 个人主页` : '个人主页'

    // 访问控制：需要认证但未登录
    const store = useHomeStore()
    if (to.meta.requiresAuth && !store.isAuthed) {
        return {
            name: 'login',
            query: { redirect: to.fullPath }  // 登录后跳回目标页
        }
    }

    // 已登录用户访问登录页时，直接进入后台
    if (to.name === 'login' && store.isAuthed) {
        return { name: 'admin' }
    }
})

export default router
