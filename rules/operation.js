import _ from '~utils/utils'
import EventHandler from './event-handler'
import AsyncQueue from '~utils/async-queue'

const DEVIDE = '-'
const TAG = '#'

class Operation {
  constructor(operationData, view) {
    this.view = view
    this.id = operationData.id
    this.isShow = _.defaultValue(operationData.isShow, true)
    this.code = _.defaultValue(operationData.code, this.id)
    this.label = operationData.label
    this.disabled = operationData.disabled
    this.loading = _.defaultValue(operationData.loading, false)
    this.displayType = operationData.type || 'primary'
    this.size = operationData.size
    this.isValidate = _.defaultValue(operationData.isValidate, false)
    this.isValidateAll = _.defaultValue(operationData.isValidateAll, false)
    this.isApi = _.defaultValue(operationData.isApi, false)
    this.prop = `O${TAG}${this.code}`
    this.operationProp = `${this.view.viewProp}${DEVIDE}${this.prop}`
    this.customHandler = _.defaultValue(operationData.customHandler, false)
    this.api = _.defaultValue(operationData.api, null)
    this.vm = null
    this.initEventHandler()
    this.view.registerEvent(`operation:${this.code}`, this.eventBus)
    // this.registerEvent('update', 'validate', this.handlerValidate())
    // this.registerEvent('update', 'api', this.handlerapi())
  }

  triggerClick(vm) {
    console.log('trigger click', vm)
    this.vm = vm
    this.triggerEvent(vm)
  } 

  handlerValidate() {
    return () => {
      if (!this.isValidate) {
        return Promise.resolve()
      }
      let validateMethod = this.isValidateAll ? 'validateAll' : 'validateThisForm'
      console.log('validateMethod', validateMethod, this.vm[validateMethod]())
      return this.vm[validateMethod]().then(() => {
        console.log('validate res')
        return Promise.resolve()
      }).catch(() => {
        let errMsg = '表单校验未通过'
        return Promise.reject(errMsg)
      })
    }
  }

  handlerapi() {
    return () => {
      if(!this.isApi) {
        return Promise.resolve()
      }
      // let n = 1
      // return new Promise((res, rej) => {
      //   setTimeout(() => {
      //     if (n === 1) {
      //       console.log('api res', )
      //       res(this.view, this.vm)
      //     } else {
      //       console.log('api rej')
      //       rej('aip错误')
      //     }
      //   }, 1000)
      // })
      return this.gua(this.view)
    }
  }

  gua(arg) {
    let n = 1
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (n === 1) {
          console.log('api res', arg)
          res(this.view, this.vm)
        } else {
          console.log('api rej')
          rej('aip错误')
        }
      }, 1000)
    })
  }

  // clickHandler() {
  //   let vm = this.vm
  //   return () => {
  //     this.loading = true
  //     return this.handlerValidate(vm).then(() => {
  //       console.log('点击按钮， 通过表单校验')
  //       if(this.customHandler) {
  //         console.log('customHandler')
  //         return this.customHandler(this.view, vm)
  //       }
  //       if(this.api) {
  //         //TODO:接口提交等操作
  //         return this.apiHandler()
  //       }
  //       //没有异步操作时直接返回resolve
  //       return Promise.resolve()
  //     }).then(() => {
  //       console.log('then')
  //       this.loading = false
  //       return Promise.resolve()
  //     }).catch((err) => {
  //       console.log(err)
  //       this.loading = false
  //       return Promise.reject(err)
  //     })
  //   }
  // }

  initEventHandler() {
    let eventBusData = {
      name: `operation:${this.code}`,
      isSync: false,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    let eventBusEventHandler = new EventHandler(eventBusData)

    let prefix = `operation:${this.code}-`
    let validateData = {
      name: `${prefix}validate`,
      sort: 1,
      isSync: false,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    let apiData = {
      name: `${prefix}api`,
      sort: 2,
      isSync: false,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    let operationRuleData = {
      name: `operation:${this.code}-operation-rule`,
      sort: 3,
      isSync: false,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    // let operationRuleEventHandler = new EventHandler(operationRuleData)

    let validateHandler = new EventHandler(validateData)
    validateHandler.addHandler(this.handlerValidate())
    let apiHandler = new EventHandler(apiData)
    apiHandler.addHandler(this.handlerapi())
    let operationRuleEventHandler = new EventHandler(operationRuleData)

    eventBusEventHandler.addHandler(validateHandler)
    eventBusEventHandler.addHandler(apiHandler)
    eventBusEventHandler.addHandler(operationRuleEventHandler)
    this.eventBus = eventBusEventHandler
  }

  //将指定函数注册到view的事件中心，定义字段的创建/更新事件
  // registerEvent(type, spaceName, eventHandler) {
  //   let eventName = `operation:${this.code}`
  //   if (type !== 'created' && type !== 'update') {
  //     console.log(`operation---(${type})类型的事件总线不存在，事件注册失败`)
  //     return
  //   }
  //   let map = {
  //     'validate': 'validateHandler',
  //     'api': 'apiHandler',
  //     'operation-rule': 'operationRuleHandler',
  //   }
  //   let operationEventhandler = this[map[spaceName]].addHandler(eventHandler)
  //   this.view.registerEvent(type, eventName, operationEventhandler)
  // }

  registerEvent(spaceName, eventHandler) {
    let name = `operation:${this.code}-${spaceName}`
    console.log(this.eventBus, name)
    let result = this.eventBus.handler.find(item => {
      return item.name === name
    })
    if (!result) {
      console.warn(`(${name})不能绑定在对应字段的事件中心内-->>(${spaceName})不存在`)
    }
    result.addHandler(eventHandler)
  }


  triggerEvent(...args) {
    let eventName = `operation:${this.code}`
    console.log('eventName', eventName)
    this.view.triggerEvent(eventName, ...args).then(()=>{
      console.log('operation then')
    }).catch((err) => {
      console.log('operation catch', err)
    })

    // let handlerQueue = [this.handlerValidate(), this.handlerapi()]
    // let queue = new AsyncQueue(handlerQueue)
    // console.log(handlerQueue)
    // return queue.handler(...args)
  }

  addEventListener(type, callback) {
    this.registerEvent(type, () => {
      callback(this)
    })
  }


}

export default Operation