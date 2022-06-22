<script  lang="ts">
import { defineComponent,watch } from 'vue'
import RoomDetail from './components/detail.vue'
import { IRoomDetailParams } from '@/api/interface'
import { useRouter,useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  components: {
    RoomDetail
  },
  setup() {
    //setup 在服务端 在 asyncData后执行 所以在这里获取router.params.id在服务端直接刷新页面 页面获取不到
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    watch(
      () => route.params,
      (to, from) => {
        console.log('to----------------------',to) // {id:xxx}
        store.dispatch('getRoomDetail', to)
      }
    )


  },
  asyncData({ store, route }: any) {
    console.log('asyncData----详情页', store, route)
    console.log('route.value.params.id前端',route.value.params) // //直接刷新页面 服务端走asyncData 打印{ id: 'xx' } 列表点击路由跳过来走前端路由 前端控制台打印 {}
    console.log('store.state',store.state) //直接刷新页面 服务端走asyncData 打印NULL 列表点击路由跳过来走前端路由 打印 id=xxx

    console.log('store.state.roomId',store.state.roomId) //直接刷新页面 服务端走asyncData 打印NULL 列表点击路由跳过来走前端路由 打印 id=xxx
    // as 断言
    // 如果从首页列表点击过来走的前端路由  这里route.value.params.id 获取不到 所以走了store 客户端预取数据策略是：在路由导航之前解析数据。因此在路由导航之前是无法获取到下级页面的route信息。
    // 如果是页面刷新的才走route取ID
    // 或者直接用window.location跳转
    
    setTimeout(()=>{
      console.log('route.value.params.id',route.value.params.id) //路由直接点过来 前端控制台打印 route返回慢 
    },0)

    return store.dispatch('getRoomDetail', { id: route.value.params.id || store.state.roomId } as IRoomDetailParams)
    
  }
})
</script>

<template>
   <RoomDetail />
</template>

<style lang='scss'>
@import "@/assets/scss/detail/index.scss";
</style>