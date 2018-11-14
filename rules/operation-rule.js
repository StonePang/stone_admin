import _ from '~utils/utils'
import ViewRuleCondition from './view-rule-condition'
import ViewRuleHandlerColumn from './view-rule-handler-column'
import ViewRuleHandlerSubView from './view-rule-handler-view'
import ViewRuleHandlerOperation from './view-rule-handler-operation'
import EventHandler from './event-handler'
class OperationRule {
  constructor(operationRuleData, view) {
    this.view = view
    this.id = operationRuleData.id
    this.operationId = operationRuleData.operationId
    this.desc = operationRuleData.desc
    this.type = operationRuleData.type
    this.affectType = operationRuleData.affectType
    this.conditionType = operationRuleData.conditionType || 'AND'
    this.customHandler = operationRuleData.customHandler || null
    this.sort = operationRuleData.sort || 1
    this.initViewRuleCondition(operationRuleData, view)
    this.initViewRuleHandler(operationRuleData, view)
    this.bindItems = this.view.operations.filter(operation => {
      return operation.id === this.operationId
    })
    //是否在事件中心注册后立即执行一次，用于created的控制
    this.isTriggerNow = _.defaultValue(operationRuleData.isTriggerNow, true)
    //是否只执行一次
    this.isTriggerOnce = _.defaultValue(operationRuleData.isTriggerOnce, false)
    this.initEventHandler()
    // this.registerEvent('created')
    // this.registerEvent('update')
    this.registerEvent()
  }

  get methodName() {
    return {
      and: 'every',
      AND: 'every',
      or: 'some',
      OR: 'some',
    }
  }

  initViewRuleCondition(operationRuleData, view) {
    this.conditions = operationRuleData.conditions.map(conditionData => {
      return new ViewRuleCondition(conditionData, view)
    })
  }

  initViewRuleHandler(operationRuleData, view) {
    if (this.affectType === 'column') {
      this.viewRuleHandler = new ViewRuleHandlerColumn(operationRuleData, view, 'operation')
    } else if (this.affectType === 'subView') {
      this.viewRuleHandler = new ViewRuleHandlerSubView(operationRuleData, view, 'operation')
    } else if (this.affectType === 'operation') {
      this.viewRuleHandler = new ViewRuleHandlerOperation(operationRuleData, view, 'operation')
    } else {
      console.warn(`视图条件-->${this.id}的影响对象类型(${this.affectType})不存在，清检查`)
      this.viewRuleHandler = null
    }
  }

  initEventHandler() {
    // let name = `view-rule:${this.id}`
    // let sort = Number(this.sort)
    // let isSync = true
    // let isTriggerNow = this.isTriggerNow
    let data = {
      name: `operation-rule:${this.id}`,
      sort: Number(this.sort),
      isSync: true,
      isTriggerNow: this.isTriggerNow,
      isTriggerOnce: this.isTriggerOnce
    }
    this.eventHandler = new EventHandler(data)
    this.eventHandler.addHandler(this.handler())
  }

  //处理所有的条件，整理为最终结果
  //返回promise
  //reject(): 视图条件异常
  //resolve(result)： result是最终视图条件结果
  getResult() {
    //every, some
    let method = this.methodName[this.conditionType]
    if (!method) {
      let errMsg = `操作条件-->${this.id}的多条条件类型(${this.conditionType})不存在，设置条件结果为失败`
      return Promise.reject(errMsg)
    }
    //所有条件得到的结果组成的peomise数组
    let promises = this.conditions.map(condition => {
      let res = condition.handlerResult()
      return res
    })
    //then()能计算得出结果。 返回参数：true 满足； false不满足 
    //catch()异常情况， 不能得到结果
    return Promise.all(promises).then(resultAll => {
      let r = resultAll[method](result => {
        return result === true
      })
      return Promise.resolve(r)
    }).catch((errMsg) => {
      return Promise.reject(errMsg)
    })
  }

  handler() {
    return () => {
      return this.getResult().then((result) => {
        console.log(this, `操作条件结果--->>>${result}`)
        //有自定义进行自定义函数
        if (this.customHandler) {
          this.customHandler(this.view, result)
        } else {
          this.viewRuleHandler.handler(result)
        }
      }).catch((errMsg) => {
        console.warn('操作条件异常', errMsg, this)
      })
    }
  }

  // registerEvent(type) {
  //   // console.log(this.bindItems)
  //   this.bindItems.forEach(item => {
  //     console.log(this.eventHandler)
  //     // this.eventHandler.addHandler(this.handler())
  //     // item.registerEvent(type, this.handler())
  //     item.registerEvent(type, `view-rule`, this.eventHandler)
  //   })
  // }
  registerEvent() {
    // console.log(this.bindItems)
    this.bindItems.forEach(item => {
      // console.log(this.eventHandler)
      // this.eventHandler.addHandler(this.handler())
      // item.registerEvent(type, this.handler())
      item.registerEvent(`operation-rule`, this.eventHandler)
    })
  }

}

export default OperationRule