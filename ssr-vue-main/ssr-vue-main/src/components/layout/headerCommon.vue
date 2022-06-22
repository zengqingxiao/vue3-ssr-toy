<script setup lang="ts">
import { ref , defineEmits,getCurrentInstance, defineAsyncComponent,onMounted} from 'vue'
import {useStore} from 'vuex'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'
import { saveLanguageApi,fetchLanguageApi} from '@/api/layout'
import {useRouter} from 'vue-router'
import { useI18n } from 'vue-i18n'
import {IResultOr} from '@/api/interface'
import  { userLogoutApi } from '@/api/login'

//创建一个只有在需要时才会加载的异步组件,为了提升页面加载性能
const orderPopover = defineAsyncComponent(() =>
  import('@/views/order/components/orderPopover.vue')
)


const { t , locale: localeLanguage } = useI18n()
const router = useRouter()
const store = useStore()
const activeIndex = ref("orders")
const {proxy}:any = getCurrentInstance()

//Ts写法 见VUE3文档
const emit = defineEmits<{
  (e: 'changeLan', language: any): void
}>()


const handleSelect = (e:any)=>{
    console.log(e)
    if(e === 'zh') {
        // emit('changeLan',zhCn)        
        // saveLanguage('zh')
        store.dispatch('saveLanguage',zhCn) // 修改状态里的值
        localeLanguage.value = e
    }
    else if(e ==='en') {
        // emit('changeLan',en)        
        // saveLanguage('en')
        store.dispatch('saveLanguage',en)
        localeLanguage.value = e
    }
    else if(e === 'login') {
        router.push('/login')
    }
    else if(e === 'logout') {
        userLogout()
    }
    else if(e === 'orders') {
        store.commit('setOrderVisible',true)
    }
     else if(e === 'records') {
        router.push('/record')
    }
}


// function saveLanguage(language:any) {
//     saveLanguageApi(language).then(res=>{
//         let {success} = res
//         if(success) {
//             console.log('保存当前语言包成功')
//         }
//     })
// }

//获取当前从indexDB查询到的语言包,使页面显示当前的语言 （达到了每次加载页面会从indexDB取语言的目的）
function getLanguage() {
    fetchLanguageApi().then(res=>{
        let {success,result} = res
        const {name} = result //取不到

        console.log('name',name,result)
        if(success) {
             if(name === 'zh') {    
                store.dispatch('saveLanguage',zhCn)
                localeLanguage.value = name
            }
            else if(name ==='en') {           
                store.dispatch('saveLanguage',en)
                localeLanguage.value = name
            }


           
            console.log('获取当前语言包成功！')
        }
    })
} 


//退出
function userLogout() {
    userLogoutApi().then((res:IResultOr)=>{
    const {success,message} = res
    if(success) {
      proxy.$message.success(message)
      router.push({name:'login'})
    //   localStorage.setItem('userStatus',0)
    store.commit("setUserStatus",0)
    }else {
      proxy.$message.error(message)
    }
  })
}
//刷新页面也可以重新获取语言 onMounted 服务端渲染不会执行
onMounted(() => {
    getLanguage()
})



// const userStatus = localStorage.getItem('userStatus')

</script>

<template>
    <div class="header-common">
        
     
        <img @click= "()=>{router.push({name:'home'})} " class="logo" src="../../assets/images/layout/logo.png" alt="">
         <!-- <p style="margin-left:30px">
            {{store.state.count}}
         </p> -->
        <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
        >
            <el-menu-item index="orders">
                {{ t('header.orders')}}
            
                <template v-if="store.state.orderVisible">
                    <suspense>
                        <template #default>
                            <orderPopover></orderPopover>
                        </template>
                        <template #fallback>
                            <div class="loading-block">拼命加载中...</div>
                        </template>
                    </suspense>
                </template>
            
            </el-menu-item>
            <el-menu-item index="records">>{{ t('header.records')}}</el-menu-item>
            <el-sub-menu index="language">
                <template #title>>{{ t('header.language')}}</template>
                <el-menu-item index="zh">中文</el-menu-item>
                <el-menu-item index="en">EN</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="avatar" v-if="store.state.userStatus==1">
                <template #title>><img class="avatar" src="../../assets/images/layout/avatar.jpg" alt=""></template>
                <el-menu-item index="logout">退出</el-menu-item>
            </el-sub-menu>
             <el-menu-item index="login" v-else >
                {{ t("login.loginTab") }} / {{ t("login.signTab")}}
            </el-menu-item>  
        </el-menu>
    </div>

    
    

</template>

<style scoped lang="scss">
    @import "@/assets/scss/layout/headerCommon.scss"
</style>
