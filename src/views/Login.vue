<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>🔐 后台登录</span>
        </div>
      </template>
      <p class="login-subtitle">请输入管理密码以进入后台管理页面</p>

      <el-form @submit.prevent="handleLogin" label-width="0">
        <el-form-item :error="errorMsg">
          <el-input
            v-model="password"
            type="password"
            placeholder="请输入密码（演示密码：123456）"
            show-password
            size="large"
          >
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>

        <div class="login-actions">
          <el-button type="primary" size="large" @click="handleLogin" style="flex:1">登录</el-button>
          <el-button size="large" @click="goHome" style="flex:1">返回主页</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Lock } from '@element-plus/icons-vue'
import { useHomeStore } from '@/store/home.js'

const route = useRoute()
const router = useRouter()
const store = useHomeStore()

const password = ref('')
const errorMsg = ref('')

function handleLogin() {
  if (!password.value) {
    errorMsg.value = '请输入密码'
    ElMessage.warning('请输入密码')
    return
  }
  if (store.login(password.value)) {
    errorMsg.value = ''
    ElMessage.success('登录成功')
    const redirect = route.query.redirect
    router.replace(redirect ? redirect : { name: 'admin' })
  } else {
    errorMsg.value = '密码错误，请重试'
    ElMessage.error('密码错误')
  }
}

function goHome() {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.login-container {
  max-width: 420px;
  margin: 40px auto;
}

.login-card {
  border-radius: 16px;
  animation: fadeIn 0.5s ease;
}

.card-header {
  font-size: 18px;
  font-weight: 600;
}

.login-subtitle {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 24px;
}

.login-actions {
  display: flex;
  gap: 12px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
