<script setup lang="ts">
import { ref,reactive, computed ,getCurrentInstance,onMounted} from 'vue'
import { useStore } from '@/store'
import { saveOrderApi } from '@/api/order';
import { useRoute ,useRouter} from 'vue-router'
import { saveRecordApi } from '@/api/record'




console.log('---------详情页内容')
const store = useStore()
const route = useRoute()
const router = useRouter()
const roomDetail = computed(() => store.state.roomDetail)
const { proxy }: any = getCurrentInstance()

const ruleForm = ref(null)
const orderForm = reactive({
  personNumber: 1
})
function submitForm() {
  if(store.state.userStatus) {
    saveOrder()
  }
  else {  
    //如果未登录，跳转到LOGIN 并且URL带上从从哪跳到LOGIN的页面信息
    let {pathname} = window.location
    router.replace({
      path:'/login',
      query:{
        redirect:pathname
      }
    })
  }
}

//立即预定
function saveOrder() {
  const { id: orderId } = route.params
  const {
    title,
    price,
    imgs
  } = roomDetail.value
  const { personNumber } = orderForm
  const params = {
    orderId,
    title,
    price,
    personNumber,
    pictureUrl: imgs[0]
  }
  saveOrderApi(params).then((res) => {
    console.log(res)
    const { success, message } = res
    if (success) {
      proxy.$message.error('预定成功！')
    } else {
      proxy.$message.error(message)
    }
  })
}

//服务端渲染不执行onMounted 直接刷新页面不会报错了加onMounted
onMounted(() => {
  saveRecord()
})

// 保存历史足迹
function saveRecord() {
  const { id: recordId } = route.params
  const {
    title,
    price,
    imgs,
    personNumber
  } = roomDetail.value
  const params = {
    recordId,
    title,
    price,
    personNumber,
    pictureUrl: imgs[0]
  }
  saveRecordApi(params).then((res) => {
    console.log(res)
    const { success, message } = res
    if (success) {
      proxy.$message.success('记录成功')
    } else {
      proxy.$message.error(message)
    }
  })
}

</script>

<template>
  <div v-if="roomDetail && roomDetail.info && roomDetail.owner">
    <!-- 照片墙 -->
  <el-carousel
  v-if="roomDetail.imgs && roomDetail.imgs.length > 0"
  class="imgs-wall"
  trigger="click"
  height="380px"
  :interval="3000"
  indicator-position="none"
  type="card"
  >
  <el-carousel-item v-for="(item,index) in roomDetail.imgs" :key="index">
    <img :src="item" >
  </el-carousel-item>
  </el-carousel>

  <div class="main-wapper">
    <!-- 房屋详情信息 -->
    <div class="room-detail">
      <div class="detail-part">
        <h2>{{roomDetail.title}}</h2>
        <!-- 房屋信息 -->
        <div class="info">
          <span class="room">{{roomDetail.info.room}}间卧室</span>
          <span class="bed">{{roomDetail.info.bed}}张床</span>
          <span class="toilet">{{roomDetail.info.toilet}}洗手间</span>
          <span class="live-number">可住{{roomDetail.info.liveNumber}}人</span>
        </div>
        <div class="tags">
          <el-tag size="small">{{roomDetail.info.remarks}} 评论</el-tag>
          <el-tag size="small" class="ml-10" type="danger" v-if="roomDetail.info.metro">靠近地铁</el-tag>
          <el-tag size="small" class="ml-10" type="warning" v-if="roomDetail.info.parking">免费停车</el-tag>
          <el-tag size="small" class="ml-10" type="success" v-if="roomDetail.info.luggage">可存放行李</el-tag>
        </div>
        <hr />
        <!-- 房东信息 -->
        <div class="owner-detail">
          <img :src="roomDetail.owner.avatar" >
          <div class="info">
            <p>房东：{{roomDetail.owner.name}}</p>
            <p>
              <span v-if="roomDetail.owner.certify">已验证身份</span>
              <span v-if="roomDetail.info.goodOwner">超赞房东</span>
            </p>
          </div>
        </div>
        <!-- 基本介绍 -->
        <div class="introduce">{{roomDetail.owner.introduce}}</div>
      </div>
      <div class="form-part">
         <p class="price">
          <span>¥{{roomDetail.price}}</span> / 晚
        </p>
        <!-- 表单 -->
        <el-form ref="ruleForm" :model="orderForm" label-position="top" class="order-ruleForm">
            <el-form-item prop="personNumber" label="人数">
              <select v-model="orderForm.personNumber">
                <option v-for="item in 3" :value="item" :key="item">{{item}}</option>
              </select>
            </el-form-item>
            <el-form-item>
              <el-button class="btn-primary" type="primary" @click="submitForm">预定</el-button>
            </el-form-item>
          </el-form>
      </div>
    </div>
  </div>
  </div>
</template>

<style lang='scss'>
@import "@/assets/scss/detail/index.scss";
</style>
