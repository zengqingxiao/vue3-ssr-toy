import axios,{AxiosRequestConfig,AxiosResponse} from 'axios'
import { ElMessage } from 'element-plus'

// const defaultConfig = {
//     timeout:5000,
//     baseUrl:''
// }

// const axiosIntance = axios.create(defaultConfig)

// 请求拦截
// axiosIntance.interceptors.request.use(config=>{
//     return config
// },err=>{
//     return Promise.reject(err)
// })

// 响应拦截
// axiosIntance.interceptors.response.use(config=>{
//     return config
// },err=>{
//     return Promise.reject(err)
// })


// function httpRequestGet(url:any,params = {}) {
//     return axiosIntance.get(url,params).then(res=>res.data).catch()
// }


// function httpRequestPost(url:any,params = {}) {
//     return axiosIntance.post(url,params).then(res=>res.data).catch()
// }

// export default {
//     httpRequestGet,
//     httpRequestPost
// }

const defaultConfig = {
    timeout:5000,
    baseURL:import.meta.env.PROD ? '' : 'http://localhost:3000/release' //本地服务端渲染需要设置端口
}


class Http {
    constructor() {
        this.httpInterceptorsRequest()
        this.httpInterceptorsResponse()
    }


    private static axiosInstance = axios.create(defaultConfig)

    private httpInterceptorsRequest():void{
        Http.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
            return config
          }, (err:any) => {
            // 对请求错误的处理
            return Promise.reject(err)
        })
    }

    private httpInterceptorsResponse(): void {
        Http.axiosInstance.interceptors.response.use((res: AxiosResponse) => {
          // 对响应成功的处理，处理一些接口成功的状态码，比如:2xx范围内的状态码
          const { data } = res
          const { success } = data
          if (success) {
            ElMessage('成功')
          } else {
            ElMessage('失败')
          }
          return res
        }, (err:any) => {
          // 对响应错误的处理，处理一些接口失败所返回的状态码，比如：3XX,4XX,5XX范围内的状态码
          ElMessage('服务器异常')
          return Promise.reject(err)
         
        })
      }

      public httpGet<T>(url: string, params?: T): Promise<T> {
        return Http.axiosInstance.get(url, { params }).then(res => res.data).catch()
      }
    
      public httpPost<T>(url: string, params?: T): Promise<T> {
        return Http.axiosInstance.post(url, { params }).then(res => res.data).catch()
      }


}


export const http = new Http()