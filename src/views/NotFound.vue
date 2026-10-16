<template>
  <div class="page-container" style="display:flex;justify-content:center;align-items:center;min-height:60vh">
    <el-result icon="warning" title="404" sub-title="页面走丢了">
      <template #extra>
        <p style="color:#909399;margin-bottom:16px">你访问的路径不存在：<code>{{ route.path }}</code></p>
        <el-button type="primary" @click="goHome">回到主页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

function goHome() {
  router.push({ name: 'home' })
}
</script>
