import TypeObjectStore from '../type' // 引入类型别名

//openStore的时候需要传入的主键 和 表字段

const webLang: TypeObjectStore =
{
  keyPath: 'id',  
  indexs: ['name']
}

const languageObjectStore = {
  language: webLang
}

export default languageObjectStore