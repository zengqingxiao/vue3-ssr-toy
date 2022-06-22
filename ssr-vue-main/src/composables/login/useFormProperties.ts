//登录表单相关hooks
import { ref, reactive } from 'vue'

interface IRuleForm {
    mobile:string,
    password:string
}
export default function useFormProperties(t:any) {


    const activeName = ref('login')
    
    let loginText = ref(t('login.loginBtn'))
    const ruleFormRef = ref(null)
    
    const ruleForm:IRuleForm = reactive({
        mobile: '',
        password: ''
    })

    const rules = reactive({
        mobile: [
          {
            required: true,
            min: 11,
            max: 11,
            message: t('login.placeMobile'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: t('login.placePass'),
            trigger: 'blur'
          }
        ]
      })

    return {
        activeName,
        loginText,
        ruleFormRef,
        ruleForm,
        rules
    }

}


