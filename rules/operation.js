import _ from '~utils/utils'

const DEVIDE = '-'
const TAG = '#'

class Operation {
  constructor(operationData, view) {
    this.view = view
    this.id = operationData.id
    this.isShow = _.defaultValue(operationData.isShow, true)
    this.label = operationData.label
    this.disabled = operationData.disabled
    this.loading = _.defaultValue(operationData.loading, false)
    this.displayType = operationData.type || 'primary'
    this.size = operationData.size
    this.isValidate = _.defaultValue(operationData.isValidate, false)
    this.prop = `O${TAG}${this.id}`
    this.operationProp = `${this.view.viewProp}${DEVIDE}${this.prop}`
    this.customHandler = _.defaultValue(operationData.customHandler, false)
    this.api = _.defaultValue(operationData.api, null)
    this.registerEvent('update', this.clickHandler())
  }

  triggerClick(vm) {
    // console.log('gua')
    this.triggerEvent('update', vm)
  } 

  handlerValidate(vm) {
    if (!this.isValidate) {
      return Promise.resolve()
    }
    return vm.validate().then(() => {
      return Promise.resolve()
    }).catch(() => {
      let errMsg = '表单校验未通过'
      return Promise.reject(errMsg)
    })
  }

  apiHandler() {
    let n = 2
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (n === 1) {
          res(view, vm)
        } else {
          rej('aip错误')
        }
      }, 1000)
    })
  }

  clickHandler() {
    return vm => {
      this.loading = true
      return this.handlerValidate(vm).then(() => {
        console.log('点击按钮， 通过表单校验')
        if(this.customHandler) {
          console.log('customHandler')
          return this.customHandler(this.view, vm)
        }
        if(this.api) {
          //TODO:接口提交等操作
          return this.apiHandler()
        }
        //没有异步操作时直接返回resolve
        return Promise.resolve()
      }).then(() => {
        console.log('then')
        this.loading = false
        return Promise.resolve()
      }).catch((err) => {
        console.log(err)
        this.loading = false
        return Promise.reject(err)
      })
    }
  }


  //将指定函数注册到view的事件中心，定义字段的创建/更新事件
  registerEvent(type, callback) {
    let eventName = `operation:${this.id}`
    if (type !== 'created' && type !== 'update') {
      console.log(`operation---(${type})类型的事件总线不存在，事件注册失败`)
      return
    }
    this.view.registerEvent(type, eventName, callback)
  }


  triggerEvent(type, ...arg) {
    if (type !== 'created' && type !== 'update') {
      console.log(`operation---triggerEvent---(${type})类型的字段事件不存在`)
      return
    }
    let eventName = `operation:${this.id}`
    this.view.triggerEvent(type, eventName, ...arg)
  }

  addEventListener(type, callback) {
    this.registerEvent(type, () => {
      callback(this)
    })
  }


}

export default Operation