import _ from '~utils/utils'
import ViewRuleCondition from './view-rule-condition'
import ViewRuleHandlerColumn from './view-rule-handler-column'
import ViewRuleHandlerSubView from './view-rule-handler-view'

class ViewRule {
  constructor(viewRuleData, view) {
    this.view = view
    this.id = viewRuleData.id
    this.desc = viewRuleData.desc
    this.type = viewRuleData.type
    this.affectType = viewRuleData.affectType
    this.conditionType = viewRuleData.conditionType || 'AND'
    this.initViewRuleCondition(viewRuleData, view)
    this.initViewRuleHandler(viewRuleData, view)
    this.bindItems = this.conditions.map(condition => {
      return condition.bindColumn
    })
    this.registerEvent('created')
    this.registerEvent('update')
  }

  get promiseMethodName() {
    return {
      and: 'all',
      AND: 'all',
      or: 'race',
      OR: 'race',
    }
  }

  initViewRuleCondition(viewRuleData, view) {
    this.conditions = viewRuleData.conditions.map(conditionData => {
      return new ViewRuleCondition(conditionData, view)
    })
  }

  initViewRuleHandler(viewRuleData, view) {
    if(this.affectType === 'column') {
      this.viewRuleHandler = new ViewRuleHandlerColumn(viewRuleData, view)
    } else if (this.affectType === 'subView') {
      this.viewRuleHandler = new ViewRuleHandlerSubView(viewRuleData, view)
    } else{
      console.warn(`视图条件-->${this.id}的影响对象类型(${this.affectType})不存在，清检查`)
      this.viewRuleHandler = null
    }
  }

  getResult() {
    let methodName = this.promiseMethodName[this.conditionType]
    if (!methodName) {
      console.warn(`视图条件-->${this.id}的条件类型(${this.conditionType})不存在，设置条件结果为失败`)
      return Promise.reject()
    }
    let promises = this.conditions.map(condition => {
      let res = condition.handlerResult()
      // console.log('promise', res["PromiseStatus"])
      return condition.handlerResult()
    })
    return Promise[methodName](promises)
  }

  handler() {
    // let result = this.getResult()
    return () => {
      let result = this.getResult()
      return result.then(() => {
        console.log('视图条件触发')
        this.viewRuleHandler.handler(true)
      }).catch(() => {
        console.log('视图条件失败', this)
        this.viewRuleHandler.handler(false)
      })
    }
  }

  registerEvent(type) {
    this.bindItems.forEach(item => {
      item.registerEvent(type, this.handler())
    })
  }

}

export default ViewRule