import _ from '~utils/utils'
import ViewRuleCondition from './view-rule-condition'
import ViewRuleHandlerColumn from './view-rule-handler-column'
import ViewRuleHandlerSubView from './view-rule-handler-view'
import { runInThisContext } from 'vm';

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

  get methodName() {
    return {
      and: 'every',
      AND: 'every',
      or: 'some',
      OR: 'some',
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
    let method = this.methodName[this.conditionType]
    if (!method) {
      let errMsg = `视图条件-->${this.id}的多条条件类型(${this.conditionType})不存在，设置条件结果为失败`
      return Promise.reject(errMsg)
    }
    let promises = this.conditions.map(condition => {
      let res = condition.handlerResult()
      return res
    })
    return Promise.all(promises).then(resultAll => {
      let r =  resultAll[method](result => {
        return result === true
      })
      return Promise.resolve(r)
    }).catch((errMsg) => {
      return Promise.reject(errMsg)
    })
  }

  handler() {
    // let result = this.getResult()
    return () => {
      // let result = this.getResult()
      return this.getResult().then((result) => {
        console.log(this, `视图条件结果--->>>${result}`)
        this.viewRuleHandler.handler(result)
      }).catch((errMsg) => {
        console.warn('视图条件异常', errMsg, this)
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