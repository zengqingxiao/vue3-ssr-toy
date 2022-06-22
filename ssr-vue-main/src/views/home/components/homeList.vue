<script setup lang="ts">
import { useStore } from '@/store'
import {useRouter} from 'vue-router'
import Pagination from '@/components/common/pagination.vue'
import HomeTabs from './homeTabs.vue'

const router = useRouter()
const store = useStore()
function toDeail(item: any) {
  
  //客户端预取数据策略是：在路由导航之前解析数据。因此在路由导航之前是无法获取到下级页面的route信息。
  //这里跳转到详情页走的是前端路由asyncData node端不打印任何东西，在前端console里看。  到达的页面不是服务端渲染 用的是store里存的ID
  //在详情页直接刷新页面走的是后端asyncData 前端CONSOLE不打印  node里有打印  是服务端渲染的  用的是route.params.id


  
  router.push({path:`/roomDetail/${item.id}`})
  
  store.commit('setRoomId',`${item.id}`)

}
function changePage(pageNo: number) {
  console.log('父组件', pageNo)
  store.dispatch('getRoomList', { pageNo })
}
</script>

<template>
  <!-- 城市筛选 -->
  <HomeTabs />
  <!-- 首页列表数据 -->
  <div>
    <div class="home-list">
      <div
        class="item"
        @click="toDeail(item)"
        v-for="(item, index) in store.state.roomList"
        :key="index"
      >
        <img :src="item.pictureUrl" :alt="item.title" />
        <p class="title">{{ item.title }}</p>
        <p class="price">¥{{ item.price }}元</p>
      </div>
    </div>
  </div>

  <!-- 分页 -->
  <Pagination @changePage="changePage" />
</template>

<style scoped>
</style>