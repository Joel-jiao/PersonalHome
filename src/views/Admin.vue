<template>
  <el-container class="admin-container">
    <el-header class="admin-header" height="60px">
      <h1>后台管理</h1>
      <div class="admin-actions">
        <el-button link type="primary" @click="goHome">查看主页</el-button>
        <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
      </div>
    </el-header>

    <el-menu
      mode="horizontal"
      :default-active="activeMenu"
      router
      class="admin-nav"
    >
      <el-menu-item index="/admin/profile">个人信息</el-menu-item>
      <el-menu-item index="/admin/projects">项目管理</el-menu-item>
      <el-menu-item index="/admin/articles">文章管理</el-menu-item>
    </el-menu>

    <el-main class="admin-body">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
// 后台管理布局页：作为嵌套路由的父级，子页面显示在内部 <router-view> 中
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHomeStore } from '@/store/home.js'

const router = useRouter()
const route = useRoute()
const store = useHomeStore()

const activeMenu = computed(() => route.path)

function goHome() {
  router.push({ name: 'home' })
}

function handleLogout() {
  store.logout()
  router.replace({ name: 'login' })
}
</script>

<style scoped>
.admin-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 12px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--card-bg);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 4px 16px var(--shadow);
}

.admin-header h1 {
  font-size: 22px;
  background: linear-gradient(90deg, var(--text-color), var(--primary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.admin-actions {
  display: flex;
  gap: 12px;
}

.admin-nav {
  border-bottom: none;
}

.admin-body {
  background: var(--card-bg);
  padding: 24px 28px;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 16px var(--shadow);
  min-height: 300px;
}
</style>
