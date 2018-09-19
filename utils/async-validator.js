import AsyncValidator from 'async-validator'

class Validator {
  //创建validator实例

  // data的格式 prop/field: value 
  //  { name: '123456' }

  // rule的格式 prop/field: Array<Object>
  //  {
  //   name: [{
  //     type: 'number',
  //     message: '输入数字'
  //   }, {
  //     min: 5,
  //     message: '至少5个'
  //   }, {
  //     validator: (rule, value, callback) => {
  //       if (value !== 'wwer') {
  //         let err = '不是指定'
  //         callback(err)
  //       } else {
  //         callback()
  //       }
  //     }
  //   }]
  // }
  constructor(data, rule) {
    this.validator = new AsyncValidator(rule)
    this.data = data
    this.rule = rule
  }

  //用Promise封装原生validate方法
  //从而将回调中的写法转换成.then调用的写法
  //err为校验失败的返回对象，包括message和field（prop）
  validate() {
    return new Promise((res, rej) => {
      this.validator.validate(this.data, (err, field) => {
        if (err) {
          rej(err)
        } else {
          res()
        }
      })
    })
  }
}

/**
 * 将类再封装，实现一次引用。导出一个函数即可
 */
// export default Validator
export default (data, rule) => {
  let validator = new Validator(data, rule)
  return validator.validate()
    // .then(() => {
    //   return Promise.resolve(true)
    // }).catch(err => {
    //   return Promise.reject(err)
    // })
}
