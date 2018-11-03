import _ from '~utils/utils'
import ViewRuleHandler from './view-rule-handler';

const DEVIDE = '-'
const TAG = '#'

class ViewRuleHandlerOperation extends ViewRuleHandler {
  constructor(viewRuleData, view, ruleType) {
    super(viewRuleData, view, ruleType)
    this.affectType = viewRuleData.affectType
    this.itemMap = this.view.operationMap
    this.affectItems = viewRuleData.affectItems.map(operationCode => {
      let key = `${this.targetViewProp}${DEVIDE}O${TAG}${operationCode}`
      return this.itemMap[key]
    })
  }

  get handlerMap() {
    return {
      hidden: this.handlerDisplay.bind(this),
      show: this.handlerDisplay.bind(this),
      disabled: this.handlerDisabled.bind(this),
      // clear: this.handlerClear.bind(this),
      // changeValue: this.handlerChangeValue.bind(this),
      // changeRender: this.handlerChangeRender.bind(this),
    }
  }

  handler(result) {
    let handlerFn = this.handlerMap[this.type]
    if (!handlerFn) {
      console.warn(`视图条件类型(${this.id}--->${this.type})不存在,无相关处理方法`)
      return
    }
    handlerFn(result)
  }

  handlerDisplay(result) {
    let status = this.type === 'hidden' ? true : false
    this.handlerEachAffectItem(operation => {
      if (result) {
        if (this.ruleType === 'operation' && this.isToogle) {
          operation.isShow = !operation.isShow
        } else {
          operation.isShow = !status
        }
      } else {
        operation.isShow = status
      }
    })
  }

  handlerDisabled(result) {
    this.handlerEachAffectItem(operation => {
      if (result) {
        if (this.ruleType === 'operation' && this.isToogle) {
          operation.disabled = !operation.disabled
        } else {
          operation.disabled = true
        }
      } else {
        operation.disabled = false
      }
    })
  }
}

export default ViewRuleHandlerOperation