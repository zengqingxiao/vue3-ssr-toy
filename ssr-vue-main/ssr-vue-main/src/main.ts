import { createSSRApp } from 'vue' // 用在ssr环境下使用的，既可以在客户端运行，也可以在服务端运行
import App from './App.vue'
import {createSSRRouter} from './router'
import { createSSRStore } from './store'
import ElementPlus,{ElMessage} from 'element-plus'
import 'element-plus/dist/index.css'
import {createSSRI18n} from './language/i18n'

//这玩意还只能装到 node 12.x下  npm i vue-router-sync 装完切回 16.12.0
// 这东西用来把你的router信息 放到 store中 具备双向数据绑定
//打开 源码 看window.__INITIAL_STATE 后面就有router的信息了‘
import { sync } from 'vuex-router-sync'


//用于创建服务端渲染的函数
// 每一次都必须是全新的 防止使用公用一个实例

export function createApp() {
  const app = createSSRApp(App) // 用来激活客户端的vue文件
  const store = createSSRStore()
  const router = createSSRRouter()
  const i18n = createSSRI18n()
  
  // 将router的信息同步到store中，其实也可以不要
  sync(store,router)

  app.config.globalProperties.$message = ElMessage // 设置上下文
  app.use(router)
  app.use(store)
  app.use(ElementPlus)
  app.use(i18n)
  // app.mount('#app')
  return { app,router,store }
}


export function asyncDataFilter(activated:any,store:any,route:any) {
  return Promise.all(activated.map((Component: any) => {
    if (Component.asyncData) {
        return Component.asyncData({
            store,
            route
        })
    }
  }))
}