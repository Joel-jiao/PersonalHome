<template>
  <el-header height="64px" class="global-header">
    <div class="header-inner">
      <div class="logo">我的项目</div>
      <el-menu
        mode="horizontal"
        :default-active="activeMenu"
        router
        active-class="router-link-active"
        class="nav-menu"
        background-color="transparent"
        text-color="rgba(255, 255, 255, 0.85)"
        active-text-color="#42b983"
      >
        <el-menu-item
          v-for="item in navRoutes"
          :key="item.path"
          :index="item.path"
        >
          {{ item.meta.title }}
        </el-menu-item>
        <el-menu-item
          v-if="isAuthed"
          index="/admin"
        >
          后台管理
        </el-menu-item>
      </el-menu>
      <div class="auth-actions">
        <el-button v-if="!isAuthed" @click="goLogin">登录</el-button>
        <el-button v-else @click="handleLogout">退出登录</el-button>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useHomeStore } from '@/store/home.js'

const router = useRouter()
const store = useHomeStore()
const { isAuthed } = storeToRefs(store)

// 过滤路由表：只展示 meta.showInNav 为 true 的路由（排除 404、登录、后台等）
const navRoutes = computed(() =>
    router.options.routes.filter(r => r.meta?.showInNav)
)

// 当前激活的菜单：处理嵌套路由模糊匹配（如 /admin/profile 激活 /admin）
const activeMenu = computed(() => {
    const path = router.currentRoute.value.path
    // 后台管理嵌套路由匹配
    if (path.startsWith('/admin')) return '/admin'
    return path
})

// 跳转登录页，携带当前路径以便登录后跳回
function goLogin() {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
}

// 退出登录：清除认证状态并跳回个人主页
function handleLogout() {
    store.logout()
    router.push({ name: 'home' })
}
</script>

<style scoped>
.global-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    color: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
}

.header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
}

.logo {
    font-size: 22px;
    font-weight: bold;
    background: linear-gradient(90deg, #88ccff, #42b983);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 1px;
    flex-shrink: 0;
}

.nav-menu {
    flex: 1;
    border-bottom: none;
}

.nav-menu .router-link-active {
    border-bottom: 2px solid #42b983 !important;
}

.auth-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}
</style>
