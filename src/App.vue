<script setup>
import {storeToRefs} from 'pinia'
import {useHomeStore} from '@/store/home.js'
import GlobalHeader from "@/componets/GlobalHeader.vue";
import SiteFooter from "@/componets/SiteFooter.vue";

// Footer 上移到全局后，GitHub 链接从 store 取（原本由 PersonalHome 传入）
const {info} = storeToRefs(useHomeStore())

// 全局处理“返回顶部”
function scrollToTop() {
  window.scrollTo({top: 0, behavior: 'smooth'})
}
</script>

<template>
  <div class="app-shell">
    <global-header/>
    <main class="app-main">
      <router-view/>
    </main>
    <site-footer
      :my-github-link="info.github"
      @back-to-top="scrollToTop"
    />
  </div>
</template>

<style scoped>
/* 用 flex 列布局保证内容不足一屏时 footer 仍贴在视口底部 */
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
}
</style>
