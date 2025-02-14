import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'
import * as path from 'path'

export default {
  plugins: [
    vue(),
    vueJsx(),
    svgLoader()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '#': path.resolve(__dirname, './public')
    }
  }
}