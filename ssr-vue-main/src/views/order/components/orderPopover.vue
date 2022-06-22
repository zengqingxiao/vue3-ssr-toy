<script setup lang="ts">
import { reactive,getCurrentInstance  } from 'vue'
import { fetchOrderApi } from '@/api/order'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'

// const count = ref(0)
// function fetchApi() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       count.value = 6
//       resolve(true)
//     }, 3000)
//   })
// }
// await fetchApi()
const store = useStore()
const router = useRouter()
let orderData = reactive<Array<any>>([])
const { proxy }: any = getCurrentInstance()

function fetchOrder() {

  //异步组件 必须返回 return 
  return fetchOrderApi().then((res) => {
    const { result, success, message } = res
    console.log(result)
    if (success) {
      console.log('成功')
      orderData = result
    } else {
      proxy.$message.error(message)
    }
  })
}
// 关闭遮罩和popover
function closeMask() {
  store.commit('setOrderVisible', false)
}

function toDeail(item: any) {
  
  //客户端预取数据策略是：在路由导航之前解析数据。因此在路由导航之前是无法获取到下级页面的route信息。
  //这里跳转到详情页走的是前端路由asyncData node端不打印任何东西，在前端console里看。  到达的页面不是服务端渲染 用的是store里存的ID
  //在详情页直接刷新页面走的是后端asyncData 前端CONSOLE不打印  node里有打印  是服务端渲染的  用的是route.params.id

 const { orderId: id } = item
  
  router.push({path:`/roomDetail/${id}`})
  console.log('id',id)
  
  store.commit('setRoomId',id)

}


await fetchOrder()
</script>

<template>

  <Teleport to="#app">
    <div class="mask" @click="closeMask"></div>
  </Teleport>

  <ul>
     <li v-for="(item, index) in orderData" :key="index" @click="toDeail(item)">
      <img :src="item.pictureUrl" />
      <div class="mess">
        <p class="title">{{ item.title }}</p>
        <p class="info">{{ item.price }}/晚 * {{ item.personNumber }}个人</p>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
ul {
  @include placeholder-order;
}
li {
  @include flex-layout(row, space-between, center);
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  &:last-child {
    border-bottom: none;
  }
  img {
    width: 65px;
    height: 45px;
    border-radius: 4px;
    margin-right: 5px;
    object-fit: cover;
  }
  .mess {
    display: flex;
    flex-direction: column;
    p {
      line-height: 16px;
      font-weight: normal;
      margin: 5px 0;
      max-width: 100px;
    }
    .title {
      font-weight: bold;
      color: #333;
      font-size: 14px;
      display: inline-block;
      @include line-text-overflow;
    }
    .info {
      color: #666;
      font-size: 12px;
    }
  }
}
</style>
