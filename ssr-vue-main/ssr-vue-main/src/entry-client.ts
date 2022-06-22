// 客户端文件，在index.html中引入
import { createApp,asyncDataFilter } from './main'
import airbnb from './db' // 引入数据库和对象仓库

const {app,router,store} = createApp()

//把服务端取到的STORE里的STATE 放到index.html中的window.__INITIAL_STATE__替换
//作用是把服务端STATE到同步到客户端，客户端在接管来自服务端的页面中需要有一个hydrate(注水的过程)
// (window as any) 不会有波浪线
if(window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__) // 替换 store 的根状态，仅用状态合并,代理了数据
  console.log(store, 'store-------------')
}

router.beforeEach((to, from, next) => {



    airbnb.airbnbDB.openStore({
      ...airbnb.languageObjectStore,
      ...airbnb.userObjectStore,
      ...airbnb.orderObjectStore,
      ...airbnb.recordObjectStore
    }).then((res: any) => {
      console.log('初始化所有对象仓库', res)

      //客户端才有localstorage  每次路由加载都先判断是否保持登录状态
      localStorage.getItem('userId') && store.commit('setUserStatus',1)
      next()
    })
})
  
 // router.isReady()返回一个 Promise对象，在它的回调中来挂载 Vue应用实例并且激活之

router.isReady().then(()=>{
    //因为app实例是通过createSSRApp创建的，createSSRApp是用来在客户端代码中告诉vue激活现有的html(服务端渲染好的HTML)
    //vue激活现在的HTML最佳时机是路由加载完毕

    //以下代码如果不加  路由跳转到下个页面的时候 服务端接口取得的数据无法渲染到页面
    //同时 防止 页面刷新后再次请求接口 （防止数据二次预取）


    //router.beforeEach 功能类似 在路由执行之前 预取下个路由的数据
    router.beforeResolve((to,from,next)=>{     
      //获取路由页面的所有组件
      const toComponents = router.resolve(to).matched.flatMap(record =>
        Object.values(record.components)
      )
      const fromComponents = router.resolve(from).matched.flatMap(record =>
        Object.values(record.components)
      )
      //to from的路由中是否有不同的组件（是否是同一个页面）
      const activated = toComponents.filter((c,i)=>{
        return c !== fromComponents[i]
      })
      //如果to from的路由 没有差异化的component
      if(!activated) {
        return next()
      }
      // else {
      //   //先跳到指定页面 ，再走下边的路由预取
      //   next()
      // }

      
     
        console.log('loading')
        console.log('客户端预取数据执行 asyncDataFilter 打印下router',router.currentRoute)

           //跳到指定页面之前先加载数据
        // 有差异化的组件，再让该组件（数组）去执行 asyncData 预取数据      
        asyncDataFilter(activated,store,router.currentRoute) // 获取当前路由的值
        //  Promise.all(activated.map((Component: any) => {
      //   if (Component.asyncData) {
      //       return Component.asyncData({
      //           store,
      //           route: router.currentRoute
      //       })
      //   }
      // }))
      //跳到指定页面之前先加载数据
      .then(()=>{
        //正常状态下也可以继续跳转路由
        console.log("结束loading")
        next()
      })

    })
  
    // 处理详情页的meta信息用
    router.afterEach((to, from, next) => {
      console.log('router.afterEach')
      const { roomDetail } = store.state
      console.log('store',roomDetail,to.meta)
      const { title:roomTitle="",owner } = roomDetail || {}
      const { introduce="" } = owner || {}
      const { meta } = to
      const { title, keywords, description } = meta
       if(title){
         document.title = `${title}${roomTitle}`
       } else {
         document.title = ""
       }
      
      const keywordsMeta = document.querySelector('meta[name="keywords"]')
      keywordsMeta && keywordsMeta.setAttribute("content",`${keywords}${introduce}`)
    
      const descriptionMeta = document.querySelector('meta[name="description"]')
      descriptionMeta?.setAttribute("content",`${description}${introduce}`)
    
    })



    app.mount("#app") // 客户端接管的激活
})