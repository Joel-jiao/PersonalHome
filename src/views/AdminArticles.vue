<template>
  <div class="articles-admin">
    <h2>文章管理</h2>

    <!-- 新增文章表单 -->
    <el-card class="add-section" shadow="never">
      <template #header>
        <span>新增文章</span>
      </template>
      <el-form :model="newArticle" label-width="90px">
        <el-form-item label="文章标题">
          <el-input v-model.trim="newArticle.title" placeholder="文章标题" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model.trim="newArticle.category" placeholder="分类（如：前端）" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model.trim="newArticle.tags" placeholder="标签（逗号分隔）" />
        </el-form-item>
        <el-form-item label="文章内容">
          <el-input v-model="newArticle.content" type="textarea" :rows="4" placeholder="文章内容" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">发布文章</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 文章列表 -->
    <div class="list-section">
      <h3>文章列表（{{ articles.length }} 篇）</h3>
      <el-table :data="articles" stripe style="width: 100%">
        <el-table-column prop="title" label="标题" width="200" />
        <el-table-column label="分类" width="100">
          <template #default="{ row }">
            <el-tag type="success">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="摘要">
          <template #default="{ row }">
            {{ excerpt(row.content) }}
          </template>
        </el-table-column>
        <el-table-column label="标签" width="200">
          <template #default="{ row }">
            <el-tag v-for="t in (row.tags || [])" :key="t" size="small" style="margin-right: 4px">{{ t }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="startEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="handleRemove(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <p v-if="articles.length === 0" class="empty">暂无文章</p>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑文章" width="520px">
      <el-form :model="editForm" label-width="90px">
        <el-form-item label="文章标题">
          <el-input v-model.trim="editForm.title" placeholder="文章标题" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model.trim="editForm.category" placeholder="分类" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model.trim="editForm.tags" placeholder="标签（逗号分隔）" />
        </el-form-item>
        <el-form-item label="文章内容">
          <el-input v-model="editForm.content" type="textarea" :rows="4" placeholder="文章内容" />
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
// 后台 - 文章管理：支持新增、编辑、删除文章，数据变更统一走 articles store action
import { reactive, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useArticlesStore } from '@/store/articles.js'

const store = useArticlesStore()
const { articles } = storeToRefs(store)

// 新增文章表单
const newArticle = reactive({
  title: '',
  category: '',
  tags: '',
  content: ''
})

function handleAdd() {
  if (!newArticle.title) {
    ElMessage.error('请输入文章标题')
    return
  }
  store.addArticle({
    title: newArticle.title,
    category: newArticle.category,
    tags: newArticle.tags ? newArticle.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
    content: newArticle.content
  })
  // 重置表单
  Object.assign(newArticle, { title: '', category: '', tags: '', content: '' })
}

// 删除文章
function handleRemove(id) {
  ElMessageBox.confirm('确定删除该文章？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.removeArticle(id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

// 编辑文章
const editingId = ref(null)
const editDialogVisible = ref(false)
const editForm = reactive({ title: '', category: '', tags: '', content: '' })

function startEdit(art) {
  editingId.value = art.id
  Object.assign(editForm, {
    title: art.title,
    category: art.category,
    tags: (art.tags || []).join(', '),
    content: art.content
  })
  editDialogVisible.value = true
}

function handleSaveEdit(id) {
  store.updateArticle(id, {
    title: editForm.title || '未命名文章',
    category: editForm.category,
    tags: editForm.tags ? editForm.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
    content: editForm.content
  })
  editDialogVisible.value = false
  editingId.value = null
  ElMessage.success('已保存')
}

function excerpt(content) {
  const text = (content || '').replace(/\n/g, ' ')
  return text.length > 60 ? text.slice(0, 60) + '...' : text
}
</script>

<style scoped>
.articles-admin h2 {
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
