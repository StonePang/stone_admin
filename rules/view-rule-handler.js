import _ from '~utils/utils'

const DEVIDE = '-'
const TAG = '#'

class ViewRuleHandler {
  constructor(viewRuleData, view) {
    this.init(viewRuleData, view)
  }

  // get viewRulePropMap() {
  //   return {
  //     disabled: 'disabled',
  //     hidden: 'isShow',
  //     show: 'isShow',
  //     render: 'renderType'
  //   }
  // }

  // get statusMap() {
  //   return {
  //     disabled: true,
  //     hidden: false,
  //     show: true,
  //   }
  // }

  //规则影响类型，字段和子表对应的itemMap不同
  // get affectTypeMap() {
  //   return {
  //     column: 'columnMap',
  //     subView: 'subViewMap'
  //   }
  // }

  //初始化实例
  init(viewRuleData, view) {
    // let columnMap = view.columnMap
    //影响对象ids
    let affectItemIds = viewRuleData.affectItems
    // this.result = _.defaultValue(result, false)
    this.view = view
    this.id = viewRuleData.id
    // this.desc = viewRuleData.desc
    // this.conditionType = viewRuleData.conditionType || 'AND'
    this.changeValue = viewRuleData.changeValue
    this.changeRender = viewRuleData.changeRender
    // this.targetViewProp = viewRuleData.targetViewProp
    this.targetViewProp = String(viewRuleData.targetViewId).split(DEVIDE).map(e => {
      return `V${TAG}${e}`
    }).join(DEVIDE)
    this.isClear = _.defaultValue(viewRuleData.isClear, false)
    //规则效果类型
    this.type = viewRuleData.type
    //规则影响对象类型
    // this.affectType = viewRuleData.affectType
    this.formModel = view.formModel
    //规则影响对象map
    // this.itemMap = view[this.affectTypeMap[this.affectType]]
    // //影响对象实例数组
    // this.affectItems = affectItemIds.map(id => {
    //   let map = {
    //     column: `${this.targetViewProp}${DEVIDE}C${TAG}${id}`,
    //     subView: `${this.targetViewProp}${DEVIDE}V${TAG}${id}`,
    //   }
    //   let key = map[this.affectType]
    //   // console.log(this.itemMap, key)
    //   return this.itemMap[key]
    // })
    // this.initConditions(viewRuleData.conditions)
    //绑定字段实例集合
    // this.bindColumns = this.conditions.map(item => {
    //   return item.bindColumn
    // })
    // console.log('this.bindColumns', this.bindColumns)
  }


  // initConditions(conditionsData) {
  //   this.conditions = conditionsData.map(item => {
  //     // let targetViewid = item.targetViewId || this.view.viewProp
  //     let targetViewProp = item.targetViewId.split(DEVIDE).map(e => {
  //       return `V${TAG}${e}`
  //     }).join(DEVIDE)
  //     // let bindColumnKey = targetViewProp + '-' + item.bindColumn
  //     let bindColumnProp = `${targetViewProp}${DEVIDE}C${TAG}${item.bindColumn}`
  //     let bindColumn = this.view.columnMap[bindColumnProp]
  //     // console.log(this.view, bindColumnProp, bindColumn)
  //     let conditionType = item.conditionType
  //     let conditionValue = item.conditionValue
  //     return {
  //       bindColumn,
  //       conditionType,
  //       conditionValue,
  //     }
  //   })
  // }

  // //条件判断的结果
  // conditionResult({
  //   bindValue,
  //   conditionType,
  //   conditionValue
  // }) {
  //   let map = {
  //     1: bindValue > conditionValue,
  //     2: bindValue < conditionValue,
  //     3: bindValue === conditionValue,
  //     4: bindValue >= conditionValue,
  //     5: bindValue <= conditionValue,
  //     6: bindValue !== conditionValue,
  //     7: _.includes(bindValue, conditionValue),
  //     8: !_.includes(bindValue, conditionValue),
  //   }
  //   return map[conditionType]
  // }

  //得到条件结果
  // viewRuleResult() {
  //   let methodName = this.conditionTypeMap[this.conditionType]
  //   if (!methodName) {
  //     console.warn(`视图规则(${this.id})的condotionType(${this.conditionType})不存在，此视图规则不会触发`)
  //     return false
  //   }
  //   let result = this.conditions[methodName](item => {
  //     let bindValue = this.findColumnValue(item.bindColumn.columnProp)
  //     let conditionType = item.conditionType
  //     let conditionValue = item.conditionValue
  //     let res = this.conditionResult({
  //       bindValue,
  //       conditionType,
  //       conditionValue
  //     })
  //     // console.log(bindValue, res)
  //     return res
  //   });
  //   return result
  // }

  //对当前的视图规则进行计算，得出规则结果
  //在初始化和chang时均要触发
  //利用闭包实现对this的保留,跨作用域保存到事件中心
  handler() {
    return (result) => {
      // let methodName = this.conditionTypeMap[this.conditionType]
      // if (!methodName) {
      //   console.warn(`视图规则(${this.id})的condotionType(${this.conditionType})不存在，此视图规则不会触发`)
      //   return false
      // }
      // let result = this.conditions[methodName](item => {
      //   let bindValue = this.findColumnValue(item.bindColumn.columnProp)
      //   let conditionType = item.conditionType
      //   let conditionValue = item.conditionValue
      //   let res = this.conditionResult({
      //     bindValue,
      //     conditionType,
      //     conditionValue
      //   })
      //   // console.log(bindValue, res)
      //   return res
      // });
      // let result = this.result
      console.log(this, 'view-rule--->>>视图条件事件触发，运行结果', result)
      if (this.affectType === 'column') {
        this.handlerColumnType(result)
      } else if (this.affectType === 'subView') {
        this.handlerSubViewType(result)
      }
    }
  }

  handlerEachAffectItem(callback) {
    this.affectItems.forEach(item => {
      callback(item)
    })
  }

  // //column  subView 类型对试图条件结果的处理(找到影响字段的相应prop并赋值)
  // handlerColumnType(result) {
  //   let handlerMap = {
  //     hidden: this.handlerColumnTypeHiddenShowDisabled.bind(this),
  //     show: this.handlerColumnTypeHiddenShowDisabled.bind(this),
  //     disabled: this.handlerColumnTypeHiddenShowDisabled.bind(this),
  //     clear: this.handlerColumnTypeClearChangValue.bind(this),
  //     changeValue: this.handlerColumnTypeClearChangValue.bind(this),
  //     changeRender: this.handlerColumnTypeRender.bind(this),
  //   }
  //   handlerMap[this.type](result)
  // }

  // //affectType: column
  // //type: hidden show disabled
  // handlerColumnTypeHiddenShowDisabled(result) {
  //   console.log(this)
  //   let status = undefined
  //   let prop = undefined
  //   if (this.viewRulePropMap[this.type]) {
  //     prop = this.viewRulePropMap[this.type]
  //     if (result) {
  //       status = this.statusMap[this.type]
  //     } else {
  //       status = !this.statusMap[this.type]
  //     }
  //   }
  //   //所有影响字段的对应属性修改
  //   //处理字段值清空的情况
  //   this.affectItems.forEach(item => {
  //     if (this.viewRulePropMap[this.type]) {
  //       item[prop] = status
  //     }
  //     if (this.isClear && result) {
  //       // console.log('清空', this.formModel, item.columnProp)
  //       this.setColumnValue(item.columnProp, null)
  //     }
  //   })
  // }

  // //affectType: column
  // //type: changeRender
  // handlerColumnTypeRender(result) {
  //   let renderType = result => {
  //     if (result) {
  //       return this.changeRender === 'form' ? 'form' : 'table'
  //     }
  //     return this.changeRender === 'form' ? 'table' : 'form'
  //   }
  //   this.affectItems.forEach(column => {
  //     column.renderType = renderType(result)
  //     if (result && this.isClear) {
  //       this.setColumnValue(column.columnProp, null)
  //     }
  //   })
  // }

  // //affectType: column
  // //type: clear changeValue
  // handlerColumnTypeClearChangValue(result) {
  //   let valueMap = {
  //     clear: null,
  //     //深拷贝.否则changeValue是数组的情况下可能会把changeValue值一同改变
  //     changeValue: _.cloneDeep(this.changeValue),
  //   }
  //   let value = valueMap[this.type]
  //   this.affectItems.forEach(column => {
  //     if (result) {
  //       console.log('value', value)
  //       this.setColumnValue(column.columnProp, value)
  //     }
  //   })
  // }

  // handlerSubViewType(result) {
  //   let handlerMap = {
  //     hidden: this.handlerSubViewHiddenShow.bind(this),
  //     show: this.handlerSubViewHiddenShow.bind(this),
  //     disabled: this.handlerSubViewDisabled.bind(this),
  //     clear: this.handlerSubViewClear.bind(this),
  //     changeRender: this.handlerSubViewChangeRender.bind(this),
  //   }
  //   handlerMap[this.type](result)
  // }

  // handlerSubViewHiddenShow(result) {
  //   let prop = this.viewRulePropMap[this.type]
  //   let status = null
  //   if (result) {
  //     status = this.statusMap[this.type]
  //   } else {
  //     status = !this.statusMap[this.type]
  //   }
  //   //所有影响视图的对应属性修改
  //   //处理视图值清空的情况
  //   this.affectItems.forEach(view => {
  //     view[prop] = status
  //     //先执行清空视图操作
  //     if (result && this.isClear) {
  //       view.triggerEvent('update', 'clearFormModel')
  //     }
  //   })
  // }

  // handlerSubViewDisabled(result) {
  //   this.affectItems.forEach(view => {
  //     view.triggerEvent('update', 'disabledView', result)
  //     if (result && this.isClear) {
  //       view.triggerEvent('update', 'clearFormModel')
  //     }
  //   })
  // }

  // handlerSubViewClear(result) {
  //   this.affectItems.forEach(view => {
  //     if (result) {
  //       view.triggerEvent('update', 'clearFormModel')
  //     }
  //   })
  // }

  // handlerSubViewChangeRender(result) {
  //   let renderType = result => {
  //     if (result) {
  //       return this.changeRender === 'form' ? 'form' : 'table'
  //     }
  //     return this.changeRender === 'form' ? 'table' : 'form'
  //   }
  //   this.affectItems.forEach(view => {
  //     view.triggerEvent('update', 'changeRender', renderType(result))
  //     if (result && this.isClear) {
  //       view.triggerEvent('update', 'clearFormModel')
  //     }
  //   })
  // }

  // findColumnValue(columnProp) {
  //   let result
  //   if (_.hasKey(this.formModel, columnProp)) {
  //     result = this.formModel[columnProp]
  //   } else {
  //     result = this.view.findColumnValue(columnProp)
  //   }
  //   return result
  // }

  setColumnValue(columnProp, value) {
    if (_.hasKey(this.formModel, columnProp)) {
      this.formModel[columnProp] = value
    } else {
      this.view.setColumnValue(columnProp, value)
    }
  }

  //将规则处理函数作为绑定字段的事件
  //type: created, update
  registerEvent(type) {
    this.bindColumns.forEach(column => {
      column.registerEvent(type, this.handler())
    })
  }

  triggerEvent(type) {
    this.bindColumns.forEach(column => {
      column.triggerEvent(type)
    })
  }



}

export default ViewRuleHandler