<template>
  <div class="page-container">
    <div class="page-intro" style="text-align:center;margin-bottom:24px">
      <p style="color:var(--primary);font-weight:700;letter-spacing:2px">ARTICLES</p>
      <h1 style="font-size:26px;margin:8px 0">文章列表</h1>
      <p style="opacity:0.7">共 {{ total }} 篇文章，记录学习与开发心得。</p>
    </div>

    <!-- 分类筛选 -->
    <div class="filter-bar" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px">
      <el-button
        v-for="cat in ['', ...categories]"
        :key="cat || 'all'"
        :type="activeCategory === cat ? 'primary' : 'default'"
        size="small"
        round
        @click="activeCategory = cat"
      >{{ cat || '全部' }}</el-button>
    </div>

    <!-- 文章卡片列表 -->
    <div class="article-list" style="display:flex;flex-direction:column;gap:14px">
      <el-card
        v-for="art in filteredArticles"
        :key="art.id"
        shadow="hover"
        class="article-card"
        style="cursor:pointer;border-left:4px solid var(--primary)"
        @click="goDetail(art.id)"
      >
        <template #header>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <el-tag size="small">{{ art.category }}</el-tag>
            <span style="font-size:12px;opacity:0.7">{{ formatDate(art.createdAt) }}</span>
          </div>
        </template>
        <h3 style="margin:0 0 8px;font-size:18px">{{ art.title }}</h3>
        <p style="margin:0 0 12px;font-size:14px;line-height:1.6;opacity:0.85">{{ excerpt(art.content) }}</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          <el-tag v-for="t in art.tags" :key="t" size="small" effect="plain">{{ t }}</el-tag>
        </div>
      </el-card>
      <el-empty v-if="filteredArticles.length === 0" description="暂无文章" />
    </div>
  </div>
</template>

<script setup>
// 公开文章列表页：数据来自 articles store，支持按分类筛选
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useArticlesStore } from '@/store/articles.js'

const store = useArticlesStore()
const { articles, total, categories } = storeToRefs(store)

const router = useRouter()
const activeCategory = ref('')

const filteredArticles = computed(() => {
  if (!activeCategory.value) return articles.value
  return articles.value.filter(a => a.category === activeCategory.value)
})

function goDetail(id) {
  router.push({ name: 'article-detail', params: { id } })
}

function excerpt(content) {
  const text = (content || '').replace(/\n/g, ' ')
  return text.length > 80 ? text.slice(0, 80) + '...' : text
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
