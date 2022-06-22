### indexDB

1. 创建数据库

建 utils/indexDB.ts

2. 简易使用

```
import indexDB from '@/utils/indexDB'

//数据库相关操作
// const airDB = new indexDB('airDB')
// airDB.openStore('elephant','id',['nose','ear'])  //打开控制台  application中就有了indexDB

// //增加 修改
// const addDB = (storeName)=>{
 
//    airDB.updateItem(storeName,{
//       // id:2,   //修改哪项 直接添加个id属性就行 
//       nose:'55m',
//       ear:'很打打5'
//    })
// }


// const deleteDB = (storeName:string,key:number | string) => {
//    airDB.deleteItem(storeName,key)
// }

//获取所有数据
// const getList = (storeName:string) =>{
//    airDB.getList(storeName)
// }


//获取某一条数据
// const getItem = (storeName:string,key:number | string) => {
//    airDB.getItem(storeName,key)
// }



<el-button @click="addDB('elephant')">新增/修改indeDB数据</el-button>
<el-button @click="deleteDB('elephant',2)">删除数据</el-button>
<el-button @click="getList('elephant')">查询所有数据</el-button>
<el-button @click="getItem('elephant',3)">查询某一条数据</el-button> 

```

### SSR

# 基本原理 
当浏览器访问服务端渲染项目时，服务端将URL传给到预选构建好的VUE应用渲染器，渲染器匹配到对应的路由的组件之后，执行我们预先在组件内定义的asyncData方法获取数据，并将获取完的数据传递给渲染器的上下文，利用template组装成HTML，并将HTML和状态state一并吐给前端浏览器，浏览器加载了构建好的客户端VUE应用后，将state数据同步到前端的store中，并根据数据激活后端返回的被浏览器解析为DOM元素的HTML文本，完成了数据状态、路由、组件的同步，同时使得页面得到直出，较少了白屏时间，有了更好的加载体验，同时更有利于SEO。

通过一份vue项目代码打包出两份代码，服务端使用 node渲染打包后的结果返回给客户端， 是一个字符串，没有交互，
所以需要另一份打包的结果插入页面中，页面就有了交互功能
我们开发的同一份代码会被运行在服务端和客户端两个环境中


- SSR 应用有两个入口：Client entry (客户端应用入口)和 Server entry (服务端应用入口)。
- 使用 Vite 同时处理了服务端和客户端应用，同时打包客户端和服务端应用，服务端的包会被引入到服务端用来渲染 HTML，同时客户端的包会被送到浏览器用于激活静态标记。
- 服务器端路由与客户端使用不同的历史记录，客户端渲染使用 createWebHistory ，服务端渲染使用createMemoryHistory，所以我们在router/index.ts文件中根据客户端和服务端两个运行环境做一个区分
- 因为最终整个项目中的代码需要交付生产，所以我们需要在 package.json中设置一些打包指令。打包分为客户端代码打包和服务端代码打包。
- 打包后生成一个dist目录，client放置打包后的客户端代码，server放置打包后的服务端代码

1. entry-client.ts 客户端入口文件 只在浏览器环境下执行 `index.html`中替换`main.ts`路径为`entry-client.ts`
entry-client 的目的是将实例化的VUE实例挂载到DOM上



之前的main.ts页面的入口功能要引入中去  main.ts是一些服务端和客户端共用的逻辑

2. entry-server.ts  服务端入口文件 作用是将VUE APP实例转化为HTML 给前端使用


3. server.js node服务  拷贝vite官网 https://vitejs.cn/guide/ssr.html

- 通过判断开发环境和生产环境  一份代码中兼容两种模式
- server.js的作用我认为就是结合客户端的代码和服务端的代码 使服务端的静态HTML 结合  客户端的 VUE代码 有页面 有交互


4. 客户端注水 (hydrate) 
- 运行命令`npm run dev:ssr` 在开发环境运行`server.js`
-  在`entry-server.ts`中服务端会给组件定义 `asyncData` 方法 其中会返回store,和 route
- 页面组件中使用`asyncData`可以通过store 操作 state中的数据 ,注意 使用`asyncData` 必须 和 `setup` 同级 所以没法使用vue3  的setup语法 要使用 传统的` defineComponent`
- 现在完成了服务端的预取HTML可以渲染出store中的数据,把HTML返回给客户端，客户端需要激活HTML 使客户端的定义的方法可以正常使用 （这就是注水）
- 在`index.html`中定义了` window.__INITIAL_STATE__ = '<!--vuex-state-->';` 这个变量是在`server.js`中取得了`entry-server.ts`中的`store`
- 我们把服务端的`store`中的`state`替换到 `window.__INITIAL_STATE__ = '<!--vuex-state-->'` 这样服务端返回的HTML中 `window.__INITIAL_STATE`就是服务端的store数据了
- `index.html`中直接引入了`<script type="module" src="/src/entry-client.ts"></script>`
- 在`entry-client.ts`中 就可以通过`store.replaceState`来将客户端的store 替换成服务端插入的 store 来达到服务端同步store的目的

5. 客户端预取数据
 - 在客户端入口 `entry-client.ts` 中使用路由守卫，在路由变化时候 获取 当前路由的所有组件，和目标路由的所有组件
 - 有不同的组件再去执行这些差异化组件的`asyncData`  这样可以在路由加载前预取数据，也可以在路由跳转后去获取数据 
 -  在判断了 to ,from 的路由组件不同再预取数据还有一个好处是 可以防止刷新页面的时候二次执行`asyncData`


 ```

if(!activated) {
        return next()
      }
      // else {
      //   //先跳到指定页面 ，再走下边的路由预取
      //   next()
      // }

      
        //跳到指定页面之前先加载数据
        // 有差异化的组件，再让该组件（数组）去执行 asyncData 预取数据
        console.log('loading')
       Promise.all(activated.map((Component: any) => {
        if (Component.asyncData) {
            return Component.asyncData({
                store,
                route: router.currentRoute
            })
        }
      }))
      //跳到指定页面之前先加载数据
      .then(()=>{
        //正常状态下也可以继续跳转路由
        console.log("结束loading")
        next()
      })

 ```





 6. 线上打包运行  `npm run build:ssr   npm run prod:ssr`

 - `npm run build:ssr` 执行打包客户端和服务端的代码
 - `npm run prod:ssr`  生产环境去运行server.js 
 - 打包后 线上首页要做CSS预加载  否则页面刷新后 一段时间没有样式
 - package.json中 `"build:client": "vite build --outDir dist/client --ssrManifest",`  生成一份清单文件 关联资源
 - `index.html`中再次设置占位 `<!--preload-links-->` 为了拼接预加载的资源替换到这里
 - `entry-server.ts` 中 通过`renderToString` 的context可以取得当前路由中的组件 和 `maninfest`中去匹配出 每个组件需要预加载的资源
 - 把这些资源拼接好吐回给`server.js` 在其中替换 `<!--preload-links-->` 实现路由组件资源预加载
