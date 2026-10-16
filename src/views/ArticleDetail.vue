<template>
  <div class="page-container">
    <el-button @click="goBack" style="margin-bottom:16px">返回列表</el-button>

    <el-card v-if="article" shadow="hover">
      <div style="margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--input-border)">
        <el-tag type="primary" size="small">{{ article.category }}</el-tag>
        <h1 style="font-size:26px;margin:10px 0 8px">{{ article.title }}</h1>
        <p style="margin:0;font-size:13px;opacity:0.6">{{ formatDate(article.createdAt) }}</p>
      </div>

      <div style="font-size:15px;line-height:1.9;opacity:0.9;white-space:pre-wrap">
        {{ article.content }}
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:24px;padding-top:20px;border-top:1px dashed var(--input-border)">
        <el-tag v-for="t in article.tags" :key="t" size="small" effect="plain">{{ t }}</el-tag>
      </div>

      <div style="display:flex;gap:12px;margin-top:28px">
        <el-button type="primary" @click="goBack">返回列表</el-button>
        <el-button @click="goHome">回到主页</el-button>
      </div>
    </el-card>

    <el-card v-else shadow="hover" style="text-align:center">
      <h2>未找到该文章</h2>
      <p style="opacity:0.7;margin:12px 0 20px">文章 ID：{{ route.params.id }}</p>
      <el-button type="primary" @click="goHome">回到主页</el-button>
    </el-card>
  </div>
</template>

<script setup>
// 文章详情页：通过动态路由参数 :id 从 articles store 获取对应文章
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticlesStore } from '@/store/articles.js'

const route = useRoute()
const router = useRouter()
const store = useArticlesStore()

const article = computed(() => store.getArticleById(route.params.id))

function goBack() {
  router.push({ name: 'article-list' })
}

function goHome() {
  router.push({ name: 'home' })
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<style scoped>
.page-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 12px;
}
</style>
