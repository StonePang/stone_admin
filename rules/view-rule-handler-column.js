import _ from '~utils/utils'
import ViewRuleHandler from './view-rule-handler';

const DEVIDE = '-'
const TAG = '#'

class ViewRuleHandlerColumn extends ViewRuleHandler {
  constructor(viewRuleData, view, ruleType) {
    super(viewRuleData, view, ruleType)
    this.viewRuleData = viewRuleData
    this.affectType = viewRuleData.affectType
    this.itemMap = this.view.columnMap
    //处理对象是column，需要考虑mainForm 和 BatchForm的区别
    //mainForm拿到的是实际字段，batchForm拿到的是batchView中的tableColumn，实际处理column是batchRow中的对应column
    this.affectColumns = viewRuleData.affectItems.map(itemCode => {
      let key = `${this.targetViewProp}${DEVIDE}C${TAG}${itemCode}`
      return this.itemMap[key]
    })
    console.log('this.view', this.view)
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

  //用get 得到实际处理的column
  //TODO:get拿到的column在batchForm时会不会动态增减
  get affectItems() {
    if(this.view.formType === 'mainForm') {
      return this.affectColumns
    } else if (this.view.formType === 'batchForm') {
      return this.affectColumns.reduce((pre, column) => {
        let resColumns = this.view.batchRows.map(batchRow => {
          return batchRow.columnMap[column.columnProp]
        })
        return [...pre, ...resColumns]
      }, [])
    }
  }

  //字段属性改变，column和tableColumn不相同
  columnHandler(column, propName, status, result = undefined) {
    if (propName === "changeColumnValue") {
      if (column.isTableColumn) {
        if(result) {
          column.value = status
          column.triggerEvent("changeColumnValue");
        }else {
          column.value = null;
          console.log('change value false', column.value)
        }
      }else {
        column.changeColumnValue(status)
      }
    }else {
      column[propName] = status
      console.log(propName, column[propName])

      if (column.isTableColumn) {
        column.triggerEvent(propName)
      }
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
        if (this.ruleType === 'operation' && this.isToogle) {
          // column.isShow = !column.isShow
          this.columnHandler(column, 'isShow', !column.isShow)
        }else {
          // column.isShow = !status
          this.columnHandler(column, 'isShow', !status)
        }
        if (this.isClear) {
          // this.setColumnValue(column.columnProp, null)
          this.columnHandler(column, 'changeColumnValue', null)
        }
      } else {
        // column.isShow = status
        this.columnHandler(column, 'isShow', status)
      }
    })
  }

  handlerDisabled(result) {
    this.handlerEachAffectItem(column => {
      // console.log('handlerDisabled', column, result)
      if (result) {
        if (this.ruleType === 'operation' && this.isToogle) {
          this.columnHandler(column, 'disabled', !column.disabled)
          // column.disabled = !column.disabled
        }else {
          this.columnHandler(column, 'disabled', true)
          // column.disabled = true
        }
        if (this.isClear) {
          // this.setColumnValue(column.columnProp, null)
          this.columnHandler(column, 'changeColumnValue', null)
        }
      } else {
        this.columnHandler(column, 'disabled', false)
        // column.disabled = false
      }
    })
  }

  handlerClear(result) {
    this.handlerEachAffectItem(column => {
      if(result) {
        // this.setColumnValue(column.columnProp, null)
        this.columnHandler(column, 'changeColumnValue', null)
      }
    })
  }

  handlerChangeValue(result) {
    //深拷贝.否则changeValue是数组的情况下可能会把changeValue值一同改变
    let newValue = _.cloneDeep(this.changeValue)
    this.handlerEachAffectItem(column => {
      if (result) {
        // this.setColumnValue(column.columnProp, newValue)
        this.columnHandler(column, 'changeColumnValue', newValue, result)
      }else {
        this.columnHandler(column, "changeColumnValue", newValue, result);
      }
    })
  }

  handlerChangeRender(result) {
    this.handlerEachAffectItem(column => {
      if(result) {
        let renderType
        if (this.ruleType === 'operation' && this.isToogle) {
          renderType = _.toogleValue(column.renderType, 'form', 'table')
        } else {
          renderType = this.changeRender === 'form' ? 'form' : 'table'
        }
        this.columnHandler(column, 'renderType', renderType)

        // column.renderType = this.changeRender === 'form' ? 'form' : 'table'
        if(this.isClear) {
          // this.setColumnValue(column.columnProp, null)
          this.columnHandler(column, 'changeColumnValue', null)
        }
      } else {
        let renderType = this.changeRender === 'form' ? 'table' : 'form'
        this.columnHandler(column, 'renderType', renderType)

      }
    })
  }
}

export default ViewRuleHandlerColumn