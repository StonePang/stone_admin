//将Promise数组按顺序执行
//上一个的返回值为下一个的参数

class AsyncQueue {
  constructor(promiseList) {
    this.queue = promiseList
  }

  //返回一个新的Promise
  //args是第一个Promise的参数
  handler(...args) {
    return this.queue.reduce((pre, fn) => {
      return pre.then(data => {
        return fn(data)
      })
    }, Promise.resolve(...args))
  }
}

export default AsyncQueue