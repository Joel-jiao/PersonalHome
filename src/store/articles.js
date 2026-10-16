// src/store/articles.js
// 文章专用 store：集中管理文章列表（标题/内容/分类/标签/创建时间）
// 数据自动持久化到 localStorage，刷新后不丢失
import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

// localStorage 存储键
const STORAGE_KEY = 'homeArticles'

// 默认示例文章（首次加载时使用）
const defaultArticles = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 入门',
    content: 'Vue 3 引入了组合式 API（Composition API），通过 setup 函数组织逻辑，\n让代码更易复用和维护。本文介绍 ref、reactive、computed 等核心 API 的用法。',
    category: '前端',
    tags: ['Vue', 'JavaScript'],
    createdAt: new Date('2025-09-01').toISOString()
  },
  {
    id: 2,
    title: 'Pinia 状态管理实践',
    content: 'Pinia 是 Vue 官方推荐的状态管理库，相比 Vuex 更简洁、TypeScript 友好。\n使用 defineStore 定义 store，配合 storeToRefs 保持解构后的响应式。',
    category: '前端',
    tags: ['Pinia', 'Vue'],
    createdAt: new Date('2025-09-15').toISOString()
  }
]

// 深拷贝，避免引用共享污染默认值
const clone = (data) => JSON.parse(JSON.stringify(data))

export const useArticlesStore = defineStore('articles', () => {
  // state：从 localStorage 读取，没有则使用默认数据
  const saved = localStorage.getItem(STORAGE_KEY)
  const initial = saved ? JSON.parse(saved) : clone(defaultArticles)
  const articles = ref(initial)

  // 自动持久化：articles 任意变更后写入 localStorage
  watch(articles, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  // getters
  const total = computed(() => articles.value.length)
  // 按分类分组，供列表页筛选
  const categories = computed(() => {
    const set = new Set(articles.value.map(a => a.category).filter(Boolean))
    return Array.from(set)
  })

  // actions
  function addArticle(article) {
    const maxId = articles.value.reduce((max, a) => Math.max(max, a.id || 0), 0)
    articles.value.push({
      id: maxId + 1,
      title: (article.title || '').trim() || '未命名文章',
      content: article.content || '',
      category: (article.category || '').trim() || '未分类',
      tags: Array.isArray(article.tags) ? article.tags : [],
      createdAt: new Date().toISOString()
    })
    return true
  }

  function removeArticle(id) {
    const idx = articles.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      articles.value.splice(idx, 1)
      return true
    }
    return false
  }

  function updateArticle(id, partial) {
    const art = articles.value.find(a => a.id === id)
    if (art) {
      Object.assign(art, partial)
      return true
    }
    return false
  }

  function getArticleById(id) {
    return articles.value.find(a => a.id === Number(id))
  }

  return {
    articles,
    total,
    categories,
    addArticle,
    removeArticle,
    updateArticle,
    getArticleById
  }
})
