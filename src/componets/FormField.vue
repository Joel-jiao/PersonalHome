<script setup>
const model = defineModel()
const props = defineProps({
  label: { type: String, required: true },
  placeholder: { type: String, default: '' },
  multiline: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
})
</script>

<template>
  <el-form-item :label="label">
    <el-input
      v-if="multiline"
      v-model="model"
      type="textarea"
      :rows="4"
      :placeholder="placeholder"
      :disabled="readonly"
      :readonly="readonly"
    />
    <el-input
      v-else
      v-model="model"
      :placeholder="placeholder"
      :disabled="readonly"
      :readonly="readonly"
    />
    <div v-if="$slots.default" class="desc-tip" style="font-size:12px;color:#909399;margin-top:4px">
      <slot></slot>
    </div>
  </el-form-item>
</template>

<style scoped>
/* 让 readonly 字段看起来像纯文本 */
:deep(.el-input.is-disabled .el-input__wrapper),
:deep(.el-textarea.is-disabled .el-textarea__inner) {
  background: transparent !important;
  box-shadow: none !important;
  color: var(--text-color);
  cursor: default;
}
</style>
