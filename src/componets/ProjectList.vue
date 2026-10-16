<script setup>
import ProjectCard from "@/componets/ProjectCard.vue";

defineProps({
  project: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <template v-if="project.length > 0">
    <ProjectCard
      v-for="(item, index) in project"
      :key="item.id"
      :item="item"
      :index="index"
    >
      <template #default="{ item: cardItem }">
        <slot name="body" :item="cardItem" />
      </template>
      <template #actions="{ item: cardItem }">
        <slot name="actions" :item="cardItem" />
      </template>
    </ProjectCard>
  </template>
  <p v-else>暂无项目</p>
</template>

<style scoped>

</style>