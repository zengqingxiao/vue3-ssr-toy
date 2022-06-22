import { createApp,asyncDataFilter } from './main'

import { renderToString } from '@vue/server-renderer'; 

//只运行在服务端，该入口文件用来实现服务端渲染、服务端数据预取、静态资源预加载等逻辑。


//render 在该函数中调用一系列 SSR的相关API，最终生成一个服务端渲染后的 HTML 返回给 server.js，将index.html中的对应占位<!--ssr-outlet-->替换掉
export async function render (url:string,manifest:any) {
    const {app,router,store} = createApp()
    //在服务端复用和客户端相同的路由配置  同构的关键 url来自server.js中app.use(*)
    await router.push(url)
    //等待路由加载完毕
    await router.isReady()

    //npm run dev:ssr 
    //以下是提供在服务端预取接口的方法 匹配出当前路由的组件  参考vue2 SSR文档 vue3 router重置了方法router.currentRoute.value.matched.flatMap
    //页面组件中 需要改写 scirpt 
    // export default defineComponent({
    //     setup() {
    //      
    //     },
    //     asyncData({ store, route }:any) {
    //     
    //     }
    //   })
      
    // 使服务端可以 获取每个组件的 接口数据  https://router.vuejs.org/zh/guide/migration/#%E5%BF%BD%E7%95%A5-mixins-%E4%B8%AD%E7%9A%84%E5%AF%BC%E8%88%AA%E5%AE%88%E5%8D%AB
    
    const matchedComponents = router.currentRoute.value.matched.flatMap(record =>
        Object.values(record.components)
    )

    //刷新页面路由 在node 控制台查看 
    console.log('匹配组件', matchedComponents) 
    //打印出
    // [
    //     {
    //     setup: [Function (anonymous)],
    //     asyncData: [Function: asyncData],
    //     ssrRender: [Function: _sfc_ssrRender$1]
    //     }
    // ]
    
    
    


    // 对所有匹配的路由组件调用 `asyncData()` 实现服务端获取接口
    await asyncDataFilter(matchedComponents,store, router.currentRoute)
    // await Promise.all(matchedComponents.map((Component: any) => {
    //     if (Component.asyncData) {
    //         return Component.asyncData({
    //             store,
    //             route: router.currentRoute
    //         })
    //     }
    // }))
  



    //vite的 默认plugin-vue 插件提供 context页面渲染的上下文 我们就能得到使用过的组件的模块ID
    //https://www.npmjs.com/package/@vue/server-renderer
    const context:any = {}
    //将 vue 的 app实例转为HTML 就可以插入到页面中了
    const appHtml = await renderToString(app,context); 
    const state = store.state
    
    console.log('context.modules',context.modules) 
    //打印出当前路由的所有组件 类数组
    // Set(4) {
    //     'src/App.vue',
    //     'src/components/layout/headerCommon.vue',
    //     'src/views/home/homeIndex.vue',
    //     'src/components/layout/footerCommon.vue'
    //   }

    //vite中判断是生产环境 才需要预加载CSS 下面函数渲染出要预加载的资源文件 吐给server.js 替换 `<!--preload-links-->` 实现预加载
    if(import.meta.env.PROD) {
        const preloadLinks = renderLinks(context.modules,manifest)
        return { appHtml ,state,preloadLinks}
    }
    else {
        return { appHtml ,state}
    }
  
}

function renderLinks(modules: any, manifest: any) {
    let links = ''
    modules.forEach((id: any) => {
      //拿到manifest映射表中去匹配当前路由组件把 
      //manifest里
      // "src/views/home/homeIndex.vue": [
    //     "/assets/homeIndex.1d6bab94.js",
    //     "/assets/homeIndex.67a5648b.css",
    //     "/assets/banner.d75e2f5e.jpg"
    // ],

      const files = manifest[id] 
      if (files) {
        files.forEach((file: any) => {
          links += renderPreloadLink(file)
        })
      }
    })
    return links
  }

function renderPreloadLink(file: any) {
    if (file.endsWith('.js')) {
      return `<link rel="modulepreload" crossorigin href="${file}">`
    } else if (file.endsWith('.css')) {
      return `<link rel="stylesheet" href="${file}">`
    } else if (file.endsWith('.woff')) {
      return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
    } else if (file.endsWith('.woff2')) {
      return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
    } else if (file.endsWith('.gif')) {
      return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
    } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
    } else if (file.endsWith('.png')) {
      return ` <link rel="preload" href="${file}" as="image" type="image/png">`
    } else {
      // TODO
      return ''
    }
}