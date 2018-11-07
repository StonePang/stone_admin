import _ from '~utils/utils'
import ViewRuleHandler from './view-rule-handler';

const DEVIDE = '-'
const TAG = '#'

class ViewRuleHandlerSubView extends ViewRuleHandler {
  constructor(viewRuleData, view, ruleType) {
    super(viewRuleData, view, ruleType)
    this.affectType = viewRuleData.affectType
    this.itemMap = this.view.viewMap
    this.affectItems = viewRuleData.affectItems.map(viewCode => {
      let key = `${this.targetViewProp}${DEVIDE}V${TAG}${viewCode}`
      return this.itemMap[key]
    })
  }

  get handlerMap() {
    return {
      hidden: this.handlerDisplay.bind(this),
      show: this.handlerDisplay.bind(this),
      disabled: this.handlerDisabled.bind(this),
      clear: this.handlerClear.bind(this),
      // changeValue: this.handlerChangeValue.bind(this),
      changeRender: this.handlerChangeRender.bind(this),
    }
  }

  handler(result) {
    console.log('suvView-->>handler', result)
    let handlerFn = this.handlerMap[this.type]
    if (!handlerFn) {
      console.warn(`视图条件类型(${this.id}--->${this.type})不存在,无相关处理方法`)
      return
    }
    handlerFn(result)
  }

  handlerDisplay(result) {
    let status = this.type === 'hidden' ? true : false
    this.handlerEachAffectItem(view => {
      if (result) {
        if (this.ruleType === 'operation' && this.isToogle) {
          view.isShow = !view.isShow
        } else {
          view.isShow = !status
        }
        if (this.isClear) {
          view.triggerEvent('clearFormModel')
        }
      } else {
        view.isShow = status
      }
    })
  }

  handlerDisabled(result) {
    this.handlerEachAffectItem(view => {
      if(result) {
        console.log('disabled', view, view.disabled)
        if (this.ruleType === 'operation' && this.isToogle) {
          // view.disabled = !view.disabled
          let status = !view.disabled
          view.triggerEvent('disabledChange', status)
        } else {
          let status = true
          view.triggerEvent('disabledChange', status)
        }
        if(this.isClear) {
          view.triggerEvent('clearFormModel')
        }
      }else {
        let status = false
        view.triggerEvent('disabledChange', status)
      }
    //   if (result && this.isClear) {
    //     view.triggerEvent('clearFormModel')
    //   }
    })
  }

  handlerClear(result) {
    this.handlerEachAffectItem(view => {
      if (result) {
        view.triggerEvent('clearFormModel')
      }
    })
  }

  handlerChangeRender(result) {
    this.handlerEachAffectItem(view => {
      console.log(this)
      let renderTypeNow = view.renderType
      let renderType = undefined
      if(!result) {
        renderType = this.changeRender === 'form' ? 'table' : 'form'
      }else if (this.ruleType === 'operation' && this.isToogle) {
        renderType = _.toogleValue(renderTypeNow, 'form', 'table')
      } else {
        renderType = this.changeRender === 'form' ? 'form' : 'table'
      }
      view.triggerEvent('changeRender', renderType)
      if(this.isClear) {
        view.triggerEvent('clearFormModel')
      }
      // }else {
        
      // }
      // view.triggerEvent('changeRender', renderType)
    })
  }
}

export default ViewRuleHandlerSubView