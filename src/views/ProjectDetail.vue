<template>
  <div class="page-container">
    <el-button @click="goBack" style="margin-bottom:16px">返回上一页</el-button>

    <el-card v-if="project" shadow="hover">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--input-border)">
        <span style="color:var(--primary);font-weight:700;letter-spacing:2px;font-size:13px">PROJECT {{ project.id }}</span>
        <h1 style="flex:1;font-size:26px;margin:0">{{ project.name }}</h1>
        <el-tag :type="project.status === '已完成' ? 'success' : 'warning'">{{ project.status }}</el-tag>
      </div>

      <h3 style="font-size:16px;margin:20px 0 10px;padding-left:12px;border-left:4px solid var(--primary)">项目简介</h3>
      <p style="font-size:15px;line-height:1.8;opacity:0.85">{{ project.description }}</p>

      <h3 style="font-size:16px;margin:20px 0 10px;padding-left:12px;border-left:4px solid var(--primary)">技术栈</h3>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        <el-tag v-for="tag in project.technologies" :key="tag" type="success" effect="light">{{ tag }}</el-tag>
      </div>

      <h3 style="font-size:16px;margin:20px 0 10px;padding-left:12px;border-left:4px solid var(--primary)">项目状态</h3>
      <p>{{ project.status === '已完成' ? '该项目已开发完成。' : '该项目正在开发中。' }}</p>
      <p v-if="project.hasDemo">该项目提供在线演示入口，可在个人主页点击「在线演示」查看。</p>

      <div style="display:flex;gap:12px;margin-top:28px">
        <el-button type="primary" @click="goBack">返回列表</el-button>
        <el-button @click="goHome">回到主页</el-button>
      </div>
    </el-card>

    <el-card v-else shadow="hover" style="text-align:center">
      <h2>未找到该项目</h2>
      <p style="opacity:0.7;margin:12px 0 20px">项目 ID：{{ route.params.id }}</p>
      <el-button type="primary" @click="goHome">回到主页</el-button>
    </el-card>
  </div>
</template>

<script setup>
// 项目详情页：通过动态路由参数 :id 获取对应项目数据
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useHomeStore } from '@/store/home.js'

const route = useRoute()       // 获取当前路由信息，读取动态参数
const router = useRouter()    // 编程式导航
const store = useHomeStore()
const { info } = storeToRefs(store)

// 根据路由参数 :id 在 store 中查找对应项目
const project = computed(() => {
  const id = Number(route.params.id)
  return info.value.projects.find(p => p.id === id)
})

// go(-1)：返回浏览器历史记录的上一页
function goBack() {
  router.go(-1)
}

// push：跳转到个人主页（命名路由）
function goHome() {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.page-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 12px;
}
</style>
