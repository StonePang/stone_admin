class EventBus {
  constructor() {
    this.eventBus = {}
  }

  register(isTrigger = false, eventName, callback, ...args) {
    let hasEvent = this.eventBus.hasOwnProperty(eventName)
    if(!hasEvent) {
      this.eventBus[eventName] = [callback]
    } else {
      // console.log(`(${eventName})存在于事件bus中，此事件注册执行push`)
      this.eventBus[eventName].push(callback)
    }
    //isTrigger 立即执行一次绑定函数，用于created类型事件
    if (isTrigger === true) {
      // console.log(`eventBus注册事件后立即执行-->>(${eventName})`)
      callback(...args)
    }
  }

  trigger(eventName, ...args) {
    let hasEvent = this.eventBus.hasOwnProperty(eventName)
    if(!hasEvent) {
      // console.log(`(${eventName})不在事件bus中，无法trigger`, this)
      return
    }
    let callbacks = this.eventBus[eventName]
    callbacks.forEach(callback => {
      callback(...args)
    })
  }

  destroy() {
    for (const eventName in this.eventBus) {
      delete this.eventBus[eventName]
    }
  }
}

export default EventBus