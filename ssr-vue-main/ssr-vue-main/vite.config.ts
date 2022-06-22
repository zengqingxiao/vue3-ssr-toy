import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'



// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers' // 按需引入


const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // AutoImport({
    //   resolvers: [ElementPlusResolver()]
    // }),  
    // Components({
    //   resolvers: [ElementPlusResolver()],
    // })
  ],
  resolve:{
    alias:{
      '@':resolve('src')
    }
  },
  // 配置scss
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/variable.scss";@import "@/assets/scss/main.scss";`  //引入scss公共变量
      }
    }
  },
  server:{
    // host:'localhost',
    // port:5000,
    proxy:{
      '/release':{
        target:"http://110.42.184.111",
        rewrite: (path) => path.replace(/^\/release/, '')
        /**
         * 共用的axios封装
         * const defaultConfig = {
                timeout:5000,
                baseURL:import.meta.env.PROD ? '' : 'http://localhost:5000/release'
           }
         * 
         */
        //本地开发的 http://localhost:5000/release/api/xxxxx
        //          http://110.42.184.111/api/xxxxxxx 
      }
    }
  }

})
