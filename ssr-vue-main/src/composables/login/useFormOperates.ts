
import { getCurrentInstance } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {IResultOr} from '@/api/interface'
import { userLoginApi , userSignApi} from '@/api/login'
import { useStore } from 'vuex'
interface IRuleForm {
    mobile:string,
    password:string
}


export default function useFormOperates(params:any) {
    const router = useRouter()
    const {proxy}:any = getCurrentInstance()
    const store = useStore()
    const route = useRoute()
    
    //注册
    function userSign(params:IRuleForm) {
        console.log('注册')
        userSignApi(params).then((res:IResultOr)=>{
        const {success,message} = res
        if(success) {
            proxy.$message.success(message)
        }else {
            proxy.$message.error(message)
        }
        })
    }
    
    
    //登录
    function userLogin(params:IRuleForm) {
        console.log('登录')
        userLoginApi(params).then((res:IResultOr)=>{
        const {success,message , result} = res
        if(success) {
            const { status, userId } = result
            localStorage.setItem('userId', userId)
            store.commit('setUserStatus',result.status)
            proxy.$message.success(message)

            //如果是从别的需要登录的地方被返回的登录 登录后还要回到之前要登录的地方
            const {redirect}:any = route.query
            router.push(
                {path : redirect ? redirect : "/home"}
            )
        }else {
            proxy.$message.error(message)
        }
        })
    }

    return {
        userSign,
        userLogin
    }
  }
  
  