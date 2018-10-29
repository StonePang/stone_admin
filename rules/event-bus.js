import _ from '~utils/utils'

class EventBus {
  constructor() {
    this.eventBus = {}
  }

  register(eventName, eventHandler, ...args) {
    let hasEvent = this.eventBus.hasOwnProperty(eventName)
    if(hasEvent) {
      console.warn(`(${eventName})存在于事件bus中，此事件注册不覆盖`)
      return
    }
    this.eventBus[eventName] = eventHandler
    //isTrigger 立即执行一次绑定函数，用于created类型事件
    // if (isTrigger === true) {
    //   // console.log(`eventBus注册事件后立即执行-->>(${eventName})`)
    //   if (typeof eventHandler === 'function') {
    //     eventHandler(...args)
    //   } else if (typeof eventHandler === 'object') {
    //     eventHandler.trigger(...args)
    //   }
    // }
  }

  trigger(eventName, ...args) {
    let hasEvent = this.eventBus.hasOwnProperty(eventName)
    if(!hasEvent) {
      // console.log(`(${eventName})不在事件bus中，无法trigger`, this)
      return
    }
    this.eventBus[eventName].trigger(...args)
    // let eventHandlers = this.eventBus[eventName].handler
    // if (_.invalid(eventHandlers)) {
    //   console.warn(`(${eventName})事件对象的handler不存在，无法触发事件`)
    // }
    // eventHandlers.forEach(eventHandler => {
    //   // console.log(eventHandler)
    //   if (typeof eventHandler === 'function') {
    //     eventHandler(...args)
    //   } else if (typeof eventHandler === 'object') {
    //     eventHandler.trigger(...args)
    //   }
    // })
  }

  destroy() {
    for (const eventName in this.eventBus) {
      delete this.eventBus[eventName]
    }
  }
}

export default EventBus