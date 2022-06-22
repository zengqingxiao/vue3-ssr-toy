export default class DB {
    constructor(dbname:string) {
        this.dbname = dbname
    }
    private dbname:string  //数据库名称
    private db:any //数据库对象


    //打开数据库 数据库名称  主键名   索引值（键名）
    // public openStore(storeName:string,keyPath:string,indexs?:Array<string>) {
    //      //第二个参数是版本号  返回3个方法（成功回调，失败回调，数据库版本更新的回调
    //     const request = window.indexedDB.open(this.dbname,3)  

    //     //getList会导致查询数据库 在打开数据库之前运行引起报错，所以用promise形式解决异步问题
    //     return new Promise((resolve,reject)=>{
    //         request.onsuccess = (event:any)=>{
    //             console.log(event,'打开数据库成功！')
    //             this.db = event.target.result
    //             resolve(true)  //resolve(true) 才能执行后边的操作  await airDB.openStore('elephant','id',['nose','ear'])   await airDB.getList('elephant')  //获取所有数据库数据
    //         }
    //         request.onerror = (err) => {
    //             console.log(err,'打开数据失败')
    //         }
    
    //         request.onupgradeneeded = (event)=>{
    //             console.log(event,"数据库升级成功！",event)
    //             const { result } : any = event.target
    
    //             //autoIncrement是否自增  keypath：主键名
    //            const store =  result.createObjectStore(storeName,{autoIncrement:true,keyPath})
              
    //            if(indexs && indexs.length) {
    //                indexs.map(v=>{
    //                 //数据库创建索引，param1:索引名称，param2索引属性，param3配置对象 unqiue:true 多次点击增加执行put方法会失败
    //                 store.createIndex(v,v,{unique:false})
    //                })
    //            }
    //            //数据库事务
    //            store.transaction.oncomplete = (event:any)=>{
    //                console.log('创建对象仓库成功！')
    //            }
    //         }
    //     })
    // }



    // 打开数据库 改写后可同时打开多个
  public openStore(stores: any) {
    const request = window.indexedDB.open(this.dbname, 8)
    console.log('request',request)
   
    return new Promise((resolve, reject) => {
      request.onsuccess = (event: any) => {
        console.log('数据库打开成功')
        this.db = event.target.result
      
        console.log(event)
        resolve(true)
      }
      request.onerror = (event) => {
        console.log('数据库打开失败')
        console.log(event)
        reject(event)
      }
      request.onupgradeneeded = (event) => {
        console.log('数据库升级成功')
        const { result }: any = event.target
        for (const storeName in stores) { // 初始化多个ojectStore对象仓库

          console.log('storeName',storeName)
          const { keyPath, indexs } = stores[storeName]
          if (!result.objectStoreNames.contains(storeName)) { // 没有表则新建表
            // keyPath：主键，主键（key）是默认建立索引的属性； autoIncrement：是否自增；createObjectStore会返回一个对象仓库objectStore(即新建一个表)
            const store = result.createObjectStore(storeName, { autoIncrement: true, keyPath })
            if (indexs && indexs.length) {
              indexs.map((v: string) =>
                // createIndex可以新建索引，unique字段是否唯一
                store.createIndex(v, v, { unique: false })
              )
            }
            store.transaction.oncomplete = (e: any) => {
              console.log('创建对象仓库成功')
            }
          }
        }
      }
    })
  }


    //新增/修改 数据库
    public updateItem(storeName:string,data:any) {
        /**
         * transation
         * 1.数据库名称
         * 2.可以在事务中执行的访问类型 readonly和readwrite
         * return 一个IDBTransaction对象。
         */
         
         const store = this.db.transaction([storeName],'readwrite').objectStore(storeName)
         //增加个时间戳的目的是为了 添加的时候不会被主键限制重复添加失败
         //put 可以兼容增加和修改   修改只要传入对应的主键 就能改了
         const request = store.put({
             ...data,
             updateTime:new Date().getTime()
         })
         return new Promise((resolve,reject)=>{
           request.onsuccess = (event:any) => {
               console.log(event,'数据写入成功')
               resolve(event)
           }
           request.onerror = (event:any) => {
               console.log(event,'数据写入失败')
               reject(event)
           }
   
         })
      
    }

    //删除

    public deleteItem(storeName:string,key:number | string) {
        /**
         * transation
         * 1.数据库名称
         * 2.可以在事务中执行的访问类型 readonly和readwrite
         * return 一个IDBTransaction对象。
         */
      
      const store = this.db.transaction([storeName],'readwrite').objectStore(storeName)     
      const request = store.delete(key)

      return new Promise((resolve,reject)=>{
        request.onsuccess = (event:any) => {
            console.log(event,'数据删除成功')
            resolve(event)
        }
        request.onerror = (event:any) => {
            console.log(event,'数据删除失败')
            reject(event)
        }
      })
      
    }

    //查询所有数据
    public getList(storeName:string) {
        /**
     * transation
     * 1.数据库名称
     * 2.可以在事务中执行的访问类型 readonly和readwrite
     * return 一个IDBTransaction对象。
     */
      const store = this.db.transaction(storeName).objectStore(storeName)
      const request = store.getAll()
      
      return new Promise((resolve,reject)=>{
        request.onsuccess = (event:any) => {
            console.log(event.target.result,'所有数据查询成功')
            resolve(event.target.result)
        }
        request.onerror = (event:any) => {
            console.log(event,'所有数据查询失败')
        }
      })
    }

    //查询某一条数据
    public getItem(storeName:string,key:number | string) {
        /**
     * transation
     * 1.数据库名称
     * 2.可以在事务中执行的访问类型 readonly和readwrite
     * return 一个IDBTransaction对象。
     */
     
        console.log('this.db',this.db)
        const store = this.db.transaction(storeName).objectStore(storeName)
        const request = store.get(key)
  
        return new Promise((resolve,reject)=>{
          request.onsuccess = (event:any) => {
              console.log(event.target.result,'数据某一条查询成功')
              resolve(event)
          }
          request.onerror = (event:any) => {
              console.log(event,'数据某一条查询失败')
              reject(event)
          }
        })
    }
}