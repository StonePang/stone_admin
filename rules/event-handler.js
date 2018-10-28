import _ from '~utils/utils'
import AsyncQueue from '~utils/async-queue'
class EventHandler {
  constructor(data) {
    this.name = data.name
    this.sort = data.sort
    this.isSync = data.isSync
    this.isTriggerNow = _.defaultValue(data.isTriggerNow, false)
    this.isTriggerOnce = _.defaultValue(data.isTriggerOnce, false)
    this.handler = []
    // this.initType(handler)
  }

  initType(handler) {
    if (typeof handler === 'function') {
      this.isMultiple = false
    } else if (typeof handler === 'EventHandler') {
      this.isMultiple = true
    }
  }
  addHandler(handler, ...args) {
    // console.log('addHandler', handler, typeof handler)
    if (!this.handler) {
      this.handler = []
    }
    if (typeof handler === 'function') {
      this.handler.push(handler)
      // if(this.isTriggerNow) {
      //   handler()
      // }
    } else if (typeof handler === 'object') {
      if (_.invalid(handler.sort)) {
        handler.sort = 1
      }
      this.handler.push(handler)
      this.handler.sort((a, b) => {
        return a.sort > b.sort
      })
      // if(this.isTriggerNow) {
      //   handler.trigger(...args)
      // }
    }
    if(this.isTriggerNow) {
      this.handlerTriggerNow(handler, ...args)
    }
  }

  handlerTriggerNow(handler, ...args) {
    if (typeof handler === 'function') {
      handler(...args)
      if(this.isTriggerOnce) {
        this.handler = []
      }
    } else if (typeof handler === 'object') {
      handler.trigger(...args)
    }
  }

  triggerSync(...args) {
    this.handler.forEach(item => {
      // debugger
      // let handler = item
      // handler.forEach(gua => {
      //   if (typeof gua === 'function') {
      //     gua(...args)
      //   } else if (typeof gua === 'object') {
      //     gua.trigger(...args)
      //   }
      // })
      if (typeof item === 'function') {
        item(...args)
      } else if (typeof item === 'object') {
        item.trigger(...args)
      }
    })
    return Promise.resolve(true)
  }

  triggerAsync(...args) {
    let handlerQueue = this.handler.map(handler => {
      // let handler = item.handler
      if (typeof handler === 'function') {
        return handler
      } else if (typeof handler === 'object') {
        return handler.triggger(...args)
      }
    })
    console.log(this.handler, handlerQueue)
    let queue = new AsyncQueue(handlerQueue)
    return queue.handler(...args)
  }

  trigger(...args) {
    let result
    if (this.isSync) {
      result = this.triggerSync(...args)
    } else {
      result = this.triggerAsync(...args)
    }
    if(this.isTriggerOnce) {
      this.handler = []
    }
    return result
  }
}

export default EventHandler
