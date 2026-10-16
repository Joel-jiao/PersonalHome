import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 计算 GitHub Pages 部署的 base 路径：
// - 用户主页仓库（<username>.github.io）部署在根路径 "/"
// - 普通项目仓库（<repo>）部署在 "/<repo>/"
// - 本地开发 / 非 Actions 环境固定为 "/"
function resolveBase() {
  // GitHub Actions 会自动注入 GITHUB_REPOSITORY，格式为 "owner/repo"
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]

  if (!repo || repo.endsWith('.github.io')) return '/'
  return `/${repo}/`
}

// https://vite.dev/config/
export default defineConfig({
  base: resolveBase(),
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
