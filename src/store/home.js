// src/store/home.js
// 个人主页专用 store：集中管理 info（姓名/班级/简介/联系方式/技能/项目）
// 以及后台管理所需的身份认证状态
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// 数据版本号：结构变更时递增，用于检测并升级旧版 localStorage 数据
const DATA_VERSION = 2

// 后台管理密码（演示用，实际项目应交由后端校验）
const ADMIN_PASSWORD = '123456'

// 默认初始数据
const defaultInfo = {
  _version: DATA_VERSION,
  name: '',
  grade: '',
  bio: '',
  email: '',
  github: '',
  skills: ['JavaScript', 'Vue', 'Node.js', 'CSS', 'Python'],
  projects: [
    {
      id: 1,
      name: '个人主页',
      status: '已完成',
      description: 'Vue3 实现支持暗色模式的个人主页，数据本地存储',
      technologies: ['Vue3', 'Pinia', 'Vite'],
      hasDemo: true
    },
    {
      id: 2,
      name: '简易Todo工具',
      status: '进行中',
      description: '前端练手项目，实现任务增删管理',
      technologies: ['JavaScript', 'LocalStorage'],
      hasDemo: false
    }
  ],
  // 成长时间线：个人主页用 el-timeline 展示学习历程
  timeline: [
    { date: '2024-09', title: '入门前端', description: '系统学习 HTML、CSS 与 JavaScript 基础语法' },
    { date: '2025-03', title: '掌握 Vue 3', description: '学习组合式 API、组件化开发与响应式原理' },
    { date: '2025-06', title: '状态管理进阶', description: '引入 Pinia 管理共享状态并实现本地持久化' },
    { date: '2025-09', title: '工程化实践', description: '整合 Vue Router、Pinia 与 Element Plus 构建完整项目' }
  ]
}

// 深拷贝默认数据，避免引用共享导致默认值被污染
const cloneDefault = () => JSON.parse(JSON.stringify(defaultInfo))

export const useHomeStore = defineStore('home', () => {
  // state：初始化时从 localStorage 读取，没有则使用默认数据
  const saved = localStorage.getItem('homeInfo')
  let initialInfo
  if (saved) {
    initialInfo = JSON.parse(saved)
    if (initialInfo._version !== DATA_VERSION) {
      // 版本不一致（旧版数据无 technologies 等字段）：保留个人信息，重置项目为新默认值
      initialInfo._version = DATA_VERSION
      initialInfo.projects = cloneDefault().projects
    } else if (Array.isArray(initialInfo.projects)) {
      // 同版本数据，补全可能缺失的字段，防止旧记录结构不完整
      initialInfo.projects = initialInfo.projects.map((p, i) => ({
        id: p.id ?? i + 1,
        name: p.name ?? '',
        status: p.status ?? '进行中',
        description: p.description ?? '',
        technologies: Array.isArray(p.technologies) ? p.technologies : [],
        hasDemo: !!p.hasDemo
      }))
    }
  } else {
    initialInfo = cloneDefault()
  }

  // 补全时间线字段：旧版 localStorage 数据可能缺少 timeline
  if (!Array.isArray(initialInfo.timeline)) {
    initialInfo.timeline = cloneDefault().timeline
  }

  const info = ref(initialInfo)

  // 身份认证状态：从 localStorage 读取，默认未登录
  const isAuthed = ref(localStorage.getItem('homeAuth') === 'true')

  // 任意修改 info 后自动持久化（替代原来写在页面组件里的 watch）
  watch(info, (val) => {
    localStorage.setItem('homeInfo', JSON.stringify(val))
  }, { deep: true })

  // isAuthed 变化时同步到 localStorage
  watch(isAuthed, (val) => {
    if (val) {
      localStorage.setItem('homeAuth', 'true')
    } else {
      localStorage.removeItem('homeAuth')
    }
  })

  // actions：技能增删
  function addSkill(skill) {
    const val = skill.trim()
    if (val && !info.value.skills.includes(val)) {
      info.value.skills.push(val)
      return true
    }
    return false
  }

  function removeSkill(index) {
    info.value.skills.splice(index, 1)
  }

  // 登录：校验密码，成功后标记为已认证
  function login(password) {
    if (password === ADMIN_PASSWORD) {
      isAuthed.value = true
      return true
    }
    return false
  }

  // 登出：清除认证状态
  function logout() {
    isAuthed.value = false
  }

  // 更新个人信息（合并传入的字段到 info）
  function updateInfo(partial) {
    Object.assign(info.value, partial)
  }

  // 新增项目：自动生成递增 id
  function addProject(project) {
    const maxId = info.value.projects.reduce((max, p) => Math.max(max, p.id || 0), 0)
    info.value.projects.push({
      id: maxId + 1,
      name: project.name?.trim() || '未命名项目',
      status: project.status || '进行中',
      description: project.description || '',
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      hasDemo: !!project.hasDemo
    })
    return true
  }

  // 删除项目：按 id 移除
  function removeProject(id) {
    const idx = info.value.projects.findIndex(p => p.id === id)
    if (idx !== -1) {
      info.value.projects.splice(idx, 1)
      return true
    }
    return false
  }

  // 更新项目：按 id 合并字段
  function updateProject(id, partial) {
    const proj = info.value.projects.find(p => p.id === id)
    if (proj) {
      Object.assign(proj, partial)
      return true
    }
    return false
  }

  return {
    info,
    isAuthed,
    addSkill,
    removeSkill,
    login,
    logout,
    updateInfo,
    addProject,
    removeProject,
    updateProject
  }
})
