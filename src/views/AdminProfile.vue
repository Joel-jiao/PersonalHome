<template>
  <div class="profile-admin">
    <h2>个人信息管理</h2>
    <p class="hint">修改后数据自动保存到 localStorage，主页内容会同步更新。</p>

    <el-form :model="form" label-width="100px" style="max-width: 600px">
      <el-form-item label="姓名">
        <el-input v-model="form.name" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="专业班级">
        <el-input v-model="form.grade" placeholder="专业班级" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="邮箱地址" />
      </el-form-item>
      <el-form-item label="GitHub">
        <el-input v-model="form.github" placeholder="GitHub 主页链接" />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input v-model="form.bio" type="textarea" :rows="4" placeholder="简单介绍自己、项目经历或者爱好" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSave">保存修改</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
// 后台 - 个人信息编辑：表单双向绑定 store.info，保存时调用 updateInfo
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useHomeStore } from '@/store/home.js'

const store = useHomeStore()
const { info } = storeToRefs(store)

// 表单数据：从 store 拷贝一份，避免直接修改（点保存才提交）
const form = reactive({ ...info.value })

function handleSave() {
  store.updateInfo({ ...form })
  ElMessage.success('已保存')
}

function resetForm() {
  Object.assign(form, info.value)
}
</script>

<style scoped>
.profile-admin h2 {
  font-size: 18px;
  margin-bottom: 6px;
}

.hint {
  font-size: 13px;
  opacity: 0.6;
  margin-bottom: 20px;
}
</style>
