<template>
  <div class="projects-admin">
    <h2>项目管理</h2>

    <!-- 新增项目表单 -->
    <el-card class="add-section" shadow="never">
      <template #header>
        <span>新增项目</span>
      </template>
      <el-form :model="newProject" label-width="90px">
        <el-form-item label="项目名称">
          <el-input v-model.trim="newProject.name" placeholder="项目名称" />
        </el-form-item>
        <el-form-item label="项目简介">
          <el-input v-model.trim="newProject.description" placeholder="项目简介" type="textarea" />
        </el-form-item>
        <el-form-item label="技术栈">
          <el-input v-model.trim="newProject.technologies" placeholder="技术栈（逗号分隔）" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="newProject.status">
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
        <el-form-item label="有演示">
          <el-switch v-model="newProject.hasDemo" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">添加项目</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 项目列表 -->
    <div class="list-section">
      <h3>项目列表（{{ projects.length }} 个）</h3>
      <el-table :data="projects" stripe style="width: 100%">
        <el-table-column prop="name" label="项目名称" width="160" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已完成' ? 'success' : 'warning'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="简介" show-overflow-tooltip />
        <el-table-column label="技术栈" width="200">
          <template #default="{ row }">
            <el-tag v-for="t in row.technologies" :key="t" size="small" style="margin-right: 4px">{{ t }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="startEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="handleRemove(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <p v-if="projects.length === 0" class="empty">暂无项目</p>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑项目" width="480px">
      <el-form :model="editForm" label-width="90px">
        <el-form-item label="项目名称">
          <el-input v-model.trim="editForm.name" placeholder="项目名称" />
        </el-form-item>
        <el-form-item label="项目简介">
          <el-input v-model.trim="editForm.description" placeholder="项目简介" type="textarea" />
        </el-form-item>
        <el-form-item label="技术栈">
          <el-input v-model.trim="editForm.technologies" placeholder="技术栈（逗号分隔）" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status">
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
        <el-form-item label="有演示">
          <el-switch v-model="editForm.hasDemo" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveEdit(editingId)">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// 后台 - 项目管理：支持新增、编辑、删除项目，数据变更统一走 store action
import { reactive, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useHomeStore } from '@/store/home.js'

const store = useHomeStore()
const { info } = storeToRefs(store)
const projects = computed(() => info.value.projects)

// 新增项目表单
const newProject = reactive({
  name: '',
  description: '',
  technologies: '',
  status: '进行中',
  hasDemo: false
})

function handleAdd() {
  if (!newProject.name) {
    ElMessage.error('请输入项目名称')
    return
  }
  store.addProject({
    name: newProject.name,
    description: newProject.description,
    technologies: newProject.technologies ? newProject.technologies.split(',').map(s => s.trim()).filter(Boolean) : [],
    status: newProject.status,
    hasDemo: newProject.hasDemo
  })
  // 重置表单
  Object.assign(newProject, { name: '', description: '', technologies: '', status: '进行中', hasDemo: false })
}

// 删除项目
function handleRemove(id) {
  ElMessageBox.confirm('确定删除该项目？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.removeProject(id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

// 编辑项目
const editingId = ref(null)
const editDialogVisible = ref(false)
const editForm = reactive({ name: '', description: '', technologies: '', status: '进行中', hasDemo: false })

function startEdit(proj) {
  editingId.value = proj.id
  Object.assign(editForm, {
    name: proj.name,
    description: proj.description,
    technologies: proj.technologies.join(', '),
    status: proj.status,
    hasDemo: proj.hasDemo
  })
  editDialogVisible.value = true
}

function handleSaveEdit(id) {
  store.updateProject(id, {
    name: editForm.name || '未命名项目',
    description: editForm.description,
    technologies: editForm.technologies ? editForm.technologies.split(',').map(s => s.trim()).filter(Boolean) : [],
    status: editForm.status,
    hasDemo: editForm.hasDemo
  })
  editDialogVisible.value = false
  editingId.value = null
  ElMessage.success('已保存')
}
</script>

<style scoped>
.projects-admin h2 {
  font-size: 18px;
  margin-bottom: 16px;
}

.add-section {
  margin-bottom: 24px;
}

.list-section h3 {
  font-size: 15px;
  margin-bottom: 12px;
}

.empty {
  text-align: center;
  opacity: 0.5;
  padding: 20px;
}
</style>
