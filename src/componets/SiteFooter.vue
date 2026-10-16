<script setup>
import { reactive } from "vue";

const footerInfo = reactive({
  copyright: '个人学习主页',
  course: 'web前端学习框架'
});

const currentYear = new Date().getFullYear();

const props = defineProps({
  myGithubLink: { type: String },
})

const emit = defineEmits(["backToTop"]);
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-top-line"></div>
      <p class="footer-copyright">
        <span class="year">{{ currentYear }}</span>
        <span class="copyright">{{ footerInfo.copyright }}</span>
      </p>
      <p class="footer-course">{{ footerInfo.course }}</p>
      <div class="footer-links">
        <el-button
          v-if="props.myGithubLink"
          link
          type="primary"
          :href="props.myGithubLink"
          target="_blank"
        >
          GitHub 主页
        </el-button>
        <el-button link type="primary" @click="emit('backToTop')">返回顶部</el-button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 40px;
  padding: 24px 20px 32px;
  text-align: center;
}
.footer-inner {
  max-width: 620px;
  margin: 0 auto;
}
.footer-top-line {
  width: 60px;
  height: 3px;
  border-radius: 3px;
  margin: 0 auto 18px;
  background: linear-gradient(90deg, var(--primary), transparent);
}
.footer-copyright {
  font-size: 14px;
  opacity: 0.85;
  margin-bottom: 6px;
}
.footer-copyright .year {
  margin-right: 6px;
  font-weight: 600;
  background: linear-gradient(90deg, #88ccff, #42b983);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.footer-course {
  font-size: 13px;
  opacity: 0.6;
  margin-bottom: 10px;
}
.footer-links {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
