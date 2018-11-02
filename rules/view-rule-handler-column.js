import _ from '~utils/utils'
import ViewRuleHandler from './view-rule-handler';

const DEVIDE = '-'
const TAG = '#'

class ViewRuleHandlerColumn extends ViewRuleHandler {
  constructor(viewRuleData, view) {
    super(viewRuleData, view)
    this.affectType = viewRuleData.affectType
    this.itemMap = this.view.columnMap
    this.affectItems = viewRuleData.affectItems.map(itemCode => {
      let key = `${this.targetViewProp}${DEVIDE}C${TAG}${itemCode}`
      return this.itemMap[key]
    })
  }

  get handlerMap() {
    return {
      hidden: this.handlerDisplay.bind(this),
      show: this.handlerDisplay.bind(this),
      disabled: this.handlerDisabled.bind(this),
      clear: this.handlerClear.bind(this),
      changeValue: this.handlerChangeValue.bind(this),
      changeRender: this.handlerChangeRender.bind(this),
    }
  }

  handler(result) {
    // return result => {
      let handlerFn = this.handlerMap[this.type]
      if(!handlerFn) {
        console.warn(`视图条件类型(${this.id}--->${this.type})不存在,无相关处理方法`)
        return 
      }
      handlerFn(result)
    // }
  }

  handlerDisplay(result) {
    let status = this.type === 'hidden' ? true : false
    this.handlerEachAffectItem(column => {
      if(result) {
        column.isShow = !status
        if (this.isClear) {
          // this.setColumnValue(column.columnProp, null)
          column.changeColumnValue(null)
        }
      } else {
        column.isShow = status
      }
    })
  }

  handlerDisabled(result) {
    this.handlerEachAffectItem(column => {
      if (result) {
        column.disabled = true
        if (this.isClear) {
          // this.setColumnValue(column.columnProp, null)
          column.changeColumnValue(null)
        }
      } else {
        column.disabled = false
      }
    })
  }

  handlerClear(result) {
    this.handlerEachAffectItem(column => {
      if(result) {
        // this.setColumnValue(column.columnProp, null)
        column.changeColumnValue(null)
      }
    })
  }

  handlerChangeValue(result) {
    //深拷贝.否则changeValue是数组的情况下可能会把changeValue值一同改变
    let newValue = _.cloneDeep(this.changeValue)
    this.handlerEachAffectItem(column => {
      if (result) {
        // this.setColumnValue(column.columnProp, newValue)
        column.changeColumnValue(newValue)
      }
    })
  }

  handlerChangeRender(result) {
    this.handlerEachAffectItem(column => {
      if(result) {
        column.renderType = this.changeRender === 'form' ? 'form' : 'table'
        if(this.isClear) {
          // this.setColumnValue(column.columnProp, null)
          column.changeColumnValue(null)
        }
      } else {
        column.renderType = this.changeRender === 'form' ? 'table' : 'form'
      }
    })
  }
}

export default ViewRuleHandlerColumn