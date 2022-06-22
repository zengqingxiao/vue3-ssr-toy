<script setup lang='ts'>
import { fetchRecordApi } from '@/api/record'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'

import { getCurrentInstance, reactive, ref, onMounted } from 'vue'

const recordData = ref([])
const data = reactive({
  recordData1: [],
  a: '',
  b: 0
})

const { proxy }: any = getCurrentInstance()
const store = useStore()
const router = useRouter()

const loading  = ref(true)

function fetchRecord() {
  fetchRecordApi().then(res => {
    const { success, message, result } = res
    if (success) {
      recordData.value = result
      console.log('recordData',JSON.stringify(recordData))
      data.recordData1 = result
      loading.value = false
    } else {
      proxy.$message.error(message)
    }
  })
}

onMounted(() => {
  if (store.state.userStatus) {
    fetchRecord()
  } else {
    const { pathname } = window.location
    router.replace({
      path: '/login',
      query: {
        redirect: pathname
      }
    })
  }
})


function toDeail(item: any) {
  
  //客户端预取数据策略是：在路由导航之前解析数据。因此在路由导航之前是无法获取到下级页面的route信息。
  //这里跳转到详情页走的是前端路由asyncData node端不打印任何东西，在前端console里看。  到达的页面不是服务端渲染 用的是store里存的ID
  //在详情页直接刷新页面走的是后端asyncData 前端CONSOLE不打印  node里有打印  是服务端渲染的  用的是route.params.id


  
 const { recordId: id } = item
  
  router.push({path:`/roomDetail/${id}`})
  console.log('id',id)
  
  store.commit('setRoomId',id)

}

</script>

<template>
<div class="record-page">

    <div class="main-wrapper">

      <el-skeleton animated :loading="loading"> 
         <template #template>
          <div class="column-style">
            <div class="item" v-for="i in 9" :key="i">
              <el-skeleton-item style="width: 315px; height: 240px; border-radius: 4px;"  variant="image"/>
              <el-skeleton-item style="width: 100%;margin-top: 15px;" variant="p"  />
              <el-skeleton-item style="width:30%;" variant="p" />
            </div>
          </div>
        </template>
      
        <template #default>
            <div class="column-style" v-if="recordData.length > 0">
              <div class="item" v-for="(item, index) in recordData" :key="index" @click="toDeail(item)">
                <el-image :src="item.pictureUrl" :alt="item.title"></el-image>
                <p class="title">{{ item.title }}</p>
                <p class="price">¥{{ item.price }}</p>
              </div>
            </div>
            <el-empty v-else description="暂无浏览记录"></el-empty>
        </template>
      </el-skeleton>
 
    </div>
</div></template>

<style scoped lang='scss'>

.record-page {
  .main-wrapper {
    @include main-wapper(30px);
    .column-style {
      column-count: 3;
      .item {
        width: 315px;
        overflow: hidden;
        margin-bottom: 25px;
        cursor: pointer;
        text-align: left;
        display: inline-block;
        img {
          width: 315px;
          height: auto;
          border-radius: 4px;
        }
        .title {
          width: 315px;
          font-size: 18px;
          margin: 15px 0px;
          font-weight: bold;
        }
        .price {
          font-size: 16px;
        }
      }
    }
  }
}


</style>