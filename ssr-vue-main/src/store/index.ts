import { createStore,Store, useStore as baseUseStore } from 'vuex'
import { saveLanguageApi,fetchLanguageApi} from '@/api/layout'
import { InjectionKey } from 'vue'
import {fetchRoomList} from '@/api/home'
import {fetchRoomDetail} from '@/api/detail'
import { IRoomListParams,IRoomDetailParams } from '@/api/interface'
// 为 store state 声明类型
export interface AllStateTypes {
    count: number,
    locale: any,
    userStatus: number
    roomList: Array<any>,
    pageNo:number,
    pageSize:number,
    total:number,
    cityCode: string,
    roomDetail:any,
    roomId:null,
    orderVisible:boolean
  }

// 定义 injection key
export const key: InjectionKey<Store<AllStateTypes>> = Symbol()

// 获取store实例
export function useStore() {
    // return baseUseStore(key)
    return baseUseStore() // 专门用来改造 vuex4和 ts的联系
}

export function createSSRStore() {
    return createStore({
        state:{
            count:1,
            locale:null,  //语言包
            userStatus:0,  //登录状态
            roomList:[],
            pageNo:1,
            pageSize:6,
            total:10,
            cityCode: 'hz',
            roomDetail:{},
            roomId:null,
            orderVisible:false
        },
        mutations:{
            setCount(state,payload) {
                state.count += payload
                return state.count
            },
            setLanguage(state,payload) {
                state.locale = payload
                return state.locale
            },
            setUserStatus(state,payload) {
                state.userStatus = payload
                return state.userStatus
            },
            setRoomList(state,payload) {
                state.roomList = payload
                return state.roomList
            },
            setRoomDetail(state,payload) {
                state.roomDetail = payload
                return state.roomDetail
            },
            setRoomId(state, payload) { // 设置房屋ID
                state.roomId = payload
                return state.roomId
            },
            setOrderVisible(state,payload) {
                state.orderVisible = payload
                return state.orderVisible
            }
        },
        actions:{
            fetchCount({commit,state},payload) {
                setTimeout(()=>{
                    commit('setCount',payload)
                },3000)
            },
            saveLanguage({commit,state},language:any) {
                saveLanguageApi(language.name).then(res=>{
                    let {success} = res
                    if(success) {
                        commit('setLanguage',language)
                        console.log('保存当前语言包成功')
                    }
                })
            },
            getRoomList({commit,state},payload:IRoomListParams) {
                const { pageNo, cityCode = state.cityCode } = payload
                state.pageNo = pageNo

                const params = {
                    pageNo,
                    pageSize: state.pageSize,
                    cityCode
                }
                //因为页面中的asycData是取自entery-server.ts 的 asyncData 他是个promise
                   return new Promise(resolve => {
                    fetchRoomList(params).then(res => {
                        const { success, result } = res
                        const orders = result.orders
                        const total = result.total
                        if (success) {
                        console.log('保存到Vuex中', orders.data)
                        commit('setRoomList', orders.data)
                        state.total = total
                        resolve(true)
                        }
                    })
                   })

                
            },
            getRoomDetail({commit,state},payload:IRoomDetailParams) {
                console.log('getRoomDetail',payload)
                //因为页面中的asycData是取自entery-server.ts 的 asyncData 他是个promise
                   return new Promise(resolve => {
                    fetchRoomDetail(payload).then(res => {
                        const { success, result } = res
            
                        if (success) {
                        console.log('详情页数据保存到Vuex中', result)
                        commit('setRoomDetail',result)                     
                        resolve(true)
                        }
                    })
                   })

                
            }
        }
    })
}


// export const store = 