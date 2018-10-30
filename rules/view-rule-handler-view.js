import _ from '~utils/utils'
import ViewRuleHandler from './view-rule-handler';

const DEVIDE = '-'
const TAG = '#'

class ViewRuleHandlerSubView extends ViewRuleHandler {
  constructor(viewRuleData, view) {
    super(viewRuleData, view)
    this.affectType = viewRuleData.affectType
    this.itemMap = this.view.subViewMap
    this.affectItems = viewRuleData.affectItems.map(id => {
      let key = `${this.targetViewProp}${DEVIDE}V${TAG}${id}`
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
        view.isShow = !status
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
      view.triggerEvent('disabledView', result)
      if (result && this.isClear) {
        view.triggerEvent('clearFormModel')
      }
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
      let renderType
      if (result) {
        renderType = this.changeRender === 'form' ? 'form' : 'table'
        if(this.isClear) {
          view.triggerEvent('clearFormModel')
        }
      }else {
        renderType = this.changeRender === 'form' ? 'table' : 'form'
      }
      view.triggerEvent('changeRender', renderType)
    })
  }
}

export default ViewRuleHandlerSubView