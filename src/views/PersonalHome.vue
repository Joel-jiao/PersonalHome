<template>
  <div class="container">
    <div class="header-row">
      <h1>个人主页</h1>
      <el-button :icon="theme === 'light' ? Moon : Sunny" circle @click="toggleTheme" />
    </div>
    <!-- 头像+大标题区域 -->
    <div class="avatar-wrap">
      <el-avatar :size="120" src="https://codeforces.com/userpic.codeforces.org/4767846/title/4db000a6113e7469.jpg" />
      <div class="name-title">
        <h2>{{ info.name || "你的名字" }}</h2>
        <p>{{ info.grade || "专业班级" }}</p>
        <el-link :href="'mailto:' + info.email" v-if="info.email" type="primary">{{ info.email }}</el-link>
        <span v-else class="placeholder-text">邮箱地址</span>
        <br>
        <el-link :href="info.github" target="_blank" v-if="info.github" type="primary">{{ info.github }}</el-link>
        <span v-else class="placeholder-text">GitHub主页</span>
        <p>{{ info.bio || "个人简介" }}</p>
      </div>
    </div>
    <!-- 公开展示页面只读：FormField 设为 readonly，仅展示 store 中的数据。
         所有内容修改统一在后台管理页（AdminProfile/AdminProjects）进行。 -->
    <FormField label="姓名" placeholder="（未填写）" v-model="info.name" readonly/>
    <FormField label="专业班级" placeholder="（未填写）" v-model="info.grade" readonly/>
    <!-- 联系方式模块 -->
    <div class="contact-section">
      <h3>📮 联系方式</h3>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="邮箱">
          <el-link :href="'mailto:' + info.email" v-if="info.email" type="primary">{{ info.email }}</el-link>
          <span v-else class="empty-tip">（未填写）</span>
        </el-descriptions-item>
        <el-descriptions-item label="GitHub">
          <el-link :href="info.github" target="_blank" v-if="info.github" type="primary">{{ info.github }}</el-link>
          <span v-else class="empty-tip">（未填写）</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="form-item">
      <label>技能 / 兴趣列表
        <el-button text size="small" @click="isExpand = !isExpand">
          {{ isExpand ? '收起' : '展开' }}
        </el-button>
      </label>
      <el-input
        v-model="searchKey"
        placeholder="搜索技能"
        :prefix-icon="Search"
        size="small"
        clearable
      />
      <div v-if="isExpand" class="skill-tags">
        <el-tag
          v-for="(skill, index) in filterSkills"
          :key="index"
          type="success"
          effect="light"
          class="skill-tag"
        >
          {{ skill }}
        </el-tag>
        <p v-if="filterSkills.length === 0" class="empty-tip">暂无匹配技能</p>
      </div>
    </div>
    <FormField
      label="个人简介"
      placeholder="（未填写）"
      multiline
      v-model="info.bio"
      readonly
    >
      简单介绍自己、项目经历或者爱好
    </FormField>
    <!-- 成长时间线：使用布局组件 el-row/el-col 与时间线组件 el-timeline 展示学习历程 -->
    <div class="timeline-section">
      <h3>📅 成长时间线</h3>
      <el-row justify="start">
        <el-col :span="24">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in info.timeline"
              :key="index"
              :timestamp="item.date"
              placement="top"
              type="primary"
              hollow
            >
              <h4 class="timeline-title">{{ item.title }}</h4>
              <p class="timeline-desc">{{ item.description }}</p>
            </el-timeline-item>
          </el-timeline>
        </el-col>
      </el-row>
    </div>
    <!-- 项目卡片区域 -->
    <div class="project-section">
      <section class="page-intro">
        <p class="eyebrow">PROJECT PORTFOLIO</p>
        <h1>项目作品展示</h1>
        <p>汇集个人开发项目，记录从构想到实现的完整过程。</p>
      </section>

      <section id="featured" class="section-block">
        <div class="section-heading">
          <h2>精选项目</h2>
          <span>{{ featuredProjects.length }} 个项目</span>
        </div>

        <div class="project-grid">
          <ProjectList :project="featuredProjects">
            <template #body="{ item }">
              <p class="description">{{ item.description }}</p>
              <ul class="tag-list">
                <li v-for="tag in item.technologies" :key="tag">{{ tag }}</li>
              </ul>
            </template>
            <template #actions="{ item }">
              <button class="primary" @click="showDetails(item)">查看详情</button>
              <button v-if="item.hasDemo" class="secondary" @click="showDemo(item)">
                在线演示
              </button>
            </template>
          </ProjectList>
        </div>
      </section>
    </div>

    <!-- 项目详情已改为独立路由页面 /project/:id，不再使用弹窗 -->
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted, onUnmounted} from 'vue'
import {storeToRefs} from 'pinia'
import {useRouter} from 'vue-router'
import {useHomeStore} from '@/store/home.js'
import FormField from "@/componets/FormField.vue";
import ProjectList from "@/componets/ProjectList.vue";
import {Search, Sunny, Moon} from '@element-plus/icons-vue'

// info 的数据源从组件本地 ref 切换为 Pinia 专用 store
// （localStorage 初始读取与自动持久化都已收敛到 store 内部）
const store = useHomeStore()
// storeToRefs：解构后仍保持响应式，模板里可继续直接写 info.xxx
const {info} = storeToRefs(store)

const searchKey = ref('')
const isExpand = ref(true)

// 编程式导航：点击「查看详情」跳转到动态路由项目详情页
const router = useRouter()
// 项目展示相关：featuredProjects 直接来自 store.info.projects
const featuredProjects = computed(() => info.value.projects)

// 筛选技能
const filterSkills = computed(() => {
  if (!searchKey.value.trim()) return info.value.skills
  return info.value.skills.filter(item => {
    return item.toLowerCase().includes(searchKey.value.toLowerCase())
  })
})
watch(searchKey, (newVal) => {
  console.log('搜索关键词变化：', newVal)
})

// 主题相关
// 读取 localStorage 中的主题并校验合法性，非法或缺失时回退到系统偏好
let initVal = localStorage.getItem('theme')
if (initVal !== 'light' && initVal !== 'dark') {
  const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  initVal = isSystemDark ? 'dark' : 'light'
}
const theme = ref(initVal)

// 仅把主题应用到 DOM，不写 localStorage（跟随系统时不应持久化）
function applyTheme() {
  document.documentElement.setAttribute('data-theme', theme.value)
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
}

// 用户主动切换主题：改 DOM + 写 localStorage（写一次后即视为用户已选择，
// handleSystemThemeChange 里的判断会让系统主题跟随失效）
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  applyTheme()
  localStorage.setItem('theme', theme.value)
}

// 监听系统主题切换：仅在用户未主动选择过主题（localStorage 无值）时跟随
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

function handleSystemThemeChange(e) {
  if (!localStorage.getItem('theme')) {
    theme.value = e.matches ? 'dark' : 'light'
    applyTheme()
  }
}

mediaQuery.addEventListener('change', handleSystemThemeChange)

// 项目卡片交互：点击「查看详情」编程式导航到项目详情页；点击「在线演示」跳转 GitHub 仓库
function showDetails(item) {
  router.push({ name: 'project-detail', params: { id: item.id } })
}

function showDemo(item) {
  if (info.value.github) {
    window.open(info.value.github, '_blank')
  } else {
    alert(`${item.name} 暂无在线演示链接`)
  }
}

// 页面挂载
onMounted(() => {
  applyTheme()
  console.log('个人主页加载完成！')
})
onUnmounted(() => {
  mediaQuery.removeEventListener('change', handleSystemThemeChange)
})
</script>

<style scoped>
.container {
  background: var(--card-bg);
  padding: 32px;
  border-radius: 16px;
  max-width: 620px;
  margin: 0 auto;
  box-shadow: 0 4px 16px var(--shadow);
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.header-row h1 {
  font-size: 26px;
  background: linear-gradient(90deg, var(--text-color), var(--primary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 头像区域 */
.avatar-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  animation: slideUp 0.7s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.name-title h2 {
  font-size: 28px;
  margin-bottom: 6px;
}

.name-title p {
  opacity: 0.7;
}

.placeholder-text {
  opacity: 0.5;
  font-size: 14px;
}

.form-item {
  margin: 22px 0;
}

label {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-weight: 500;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.skill-tag {
  transition: transform 0.2s;
}

.skill-tag:hover {
  transform: translateX(4px);
}

.empty-tip {
  padding: 12px;
  font-size: 13px;
  opacity: 0.5;
  text-align: center;
}

/* 成长时间线 */
.timeline-section {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px dashed var(--input-border);
}

.timeline-section h3 {
  font-size: 18px;
  margin-bottom: 16px;
  position: relative;
  padding-left: 12px;
}

.timeline-section h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: linear-gradient(180deg, #88ccff, #42b983);
}

.timeline-title {
  font-size: 15px;
  margin: 0 0 4px;
}

.timeline-desc {
  font-size: 13px;
  opacity: 0.75;
  margin: 0;
}

/* 项目卡片区域 */
.project-section,
.contact-section {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px dashed var(--input-border);
}

.project-section h3,
.contact-section h3 {
  font-size: 18px;
  margin-bottom: 16px;
  position: relative;
  padding-left: 12px;
}

.project-section h3::before,
.contact-section h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: linear-gradient(180deg, #88ccff, #42b983);
}

/* 项目展示区域 */
.page-intro {
  text-align: center;
  margin-bottom: 28px;
}

.page-intro .eyebrow {
  display: block;
  margin-bottom: 8px;
  color: var(--primary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
}

.page-intro h1 {
  margin: 0 0 8px;
  font-size: 26px;
  color: var(--text-color);
}

.page-intro > p {
  margin: 0;
  font-size: 14px;
  opacity: 0.7;
}

.section-block {
  margin-top: 24px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-heading h2 {
  margin: 0;
  font-size: 18px;
}

.section-heading span {
  font-size: 13px;
  opacity: 0.6;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

/* ProjectCard body 插槽内容 */
.description {
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-color);
  opacity: 0.85;
}

.tag-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-list li {
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 12px;
  background: rgba(66, 184, 131, 0.12);
  color: var(--primary);
}

/* ProjectCard actions 插槽中的按钮变体 */
.primary,
.secondary {
  flex: 1;
  padding: 9px 14px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity .2s, transform .2s;
}

.primary {
  background: linear-gradient(135deg, var(--primary), #2c8c65);
  color: #fff;
  border: none;
}

.secondary {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.primary:hover,
.secondary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--shadow);
}
</style>
