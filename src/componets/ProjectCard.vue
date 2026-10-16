<script setup>
defineProps({
  item: { type: Object, required: true },
  index: { type: Number, required: true }
})
</script>

<template>
  <el-card
    shadow="hover"
    class="project-card"
    :body-style="{ padding: '0' }"
  >
    <template #header>
      <div class="card-header">
        <div>
          <el-tag type="info" size="small" effect="plain">
            PROJECT {{ index + 1 }}
          </el-tag>
          <h3>{{ item.name }}</h3>
        </div>
        <el-tag
          :type="item.status === '已完成' ? 'success' : 'warning'"
          effect="light"
          round
        >
          {{ item.status }}
        </el-tag>
      </div>
    </template>

    <div class="card-body">
      <slot :item="item"></slot>
    </div>

    <div class="card-actions">
      <slot name="actions" :item="item"></slot>
    </div>
  </el-card>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  min-height: 270px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

h3 {
  margin: 8px 0 0;
  font-size: 20px;
}

.card-body {
  flex: 1;
  padding: 18px 20px;
}

.card-actions {
  display: flex;
  gap: 10px;
  padding: 0 20px 20px;
}
</style>
