
import {http} from '@/utils/http.ts'
// import IndexDB from '@/utils/indexDB'

import airbnb from '../db'

//创建数据路链接
// const airDB = new IndexDB('airbnb')



//MOCK接口

// export async function fetchElephant() {
//     await airDB.openStore('elephant','id',['nose','ear'])  //打开控制台  application中就有了indexDB
//     //获取所有数据库数据 用promise
//     // return await airDB.getList('elephant') 
//     //再次包装下 增加额外信息
//     return await airDB.getList('elephant').then(res=>{
//         return {
//             code:'000000',
//             message:'操作成功',
//             result :res,
//             success:true
//         }
//     })
    
    
    
//     console.log('mock中打印getList后的结果',result)
// }



// https://service-ase3oocp-1302839645.sh.apigw.tencentcs.com/api/room/room/getRoomList?pageNo=1&pageSize=3



// 真实接口

// Mock接口
