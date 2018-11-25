import _ from '~utils/utils'
import AsyncQueue from '~utils/async-queue'
class EventHandler {
  constructor(data) {
    this.name = data.name
    this.sort = data.sort || 1
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
      let name = handler.name
      let hasName = this.handler.some(handler => {
        return handler.name === name
      })
      if (hasName) {
        return 
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

  // getPromise() {
  //   let arr = this.handler.map(item => {
  //     if(typeof item === 'function') {
  //       return item
  //     }
  //   })
  //   let queue = new AsyncQueue(arr)
  //   return queue.handler()
  // }

  // triggerAsync(...args) {
  //   console.log(this.handler)
  //   let handlerQueue = this.handler.map(item => {
  //     // let handler = item.handler
  //     let handler = item
  //     if (typeof handler === 'function') {
  //       console.log('function', handler)
  //       return handler
  //     } else if (typeof handler === 'object') {
  //       console.log('object', item)
  //       // return handler.triggger(...args)
  //       return item.trigger(...args)
  //     }
  //   })
  //   console.log('handlerQueue', handlerQueue)
  //   let queue = new AsyncQueue(handlerQueue)
  //   console.log('queue', queue)
  //   let result = queue.handler(...args)
  //   console.log('result', result)
  //   return result
  // }

  // 异步执行方法1
  // 先递归，拍平得到所有异步函数的数组，然后放入数组一次性异步计算
  triggerAsync(...args) {
    let promises = handlers => {
      let result = []
      let handlerQueue = handlers.map(handler => {
        if (typeof handler === 'function') {
          // console.log('function', handler)
          return handler
        } else if (typeof handler === 'object') {
          // console.log('object', handler)
          return promises(handler.handler)
        }
      })
      // result.push(...handlerQueue)
      // console.log('before', result, handlerQueue)
      result = [...result, ...handlerQueue]
      // console.log('handlerQueue', handlerQueue, result)
      return result
    }
    //拍平得到所有异步函数数组
    let handlerQueue = _.flattenDeep(promises(this.handler))
    console.log('handlerQueue', handlerQueue)
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
    console.log('result', result, this)
    if(this.isTriggerOnce) {
      this.handler = []
      console.log('isTriggerOnce', this.handler)
    }
    return result
  }
}

export default EventHandler
