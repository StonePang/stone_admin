import _ from '~utils/utils'

const DEVIDE = '-'
const TAG = '#'

class ViewRuleCondition {
  constructor(viewRuleConditionData, view) {
    this.init(viewRuleConditionData, view)
  }

  get methodMap() {
    return {
      AND: 'every',
      and: 'every',
      OR: 'some',
      or: 'some',
    }
  }

  init(viewRuleConditionData, view) {
    this.view = view
    this.targetViewProp = viewRuleConditionData.targetViewCode.split(DEVIDE).map(e => {
      return `V${TAG}${e}`
    }).join(DEVIDE)
    this.customCondition = viewRuleConditionData.customCondition || null
    this.conditionMethod = _.defaultValue(viewRuleConditionData.conditionMethod, 'OR')
    // this.bindItemType = viewRuleConditionData.bindItemType || 'column'
    // this.bindItemProp = `${this.targetViewProp}${DEVIDE}C${TAG}${viewRuleConditionData.bindItem}`
    // this.bindItem = this.view.columnMap[this.bindItemProp]
    this.initBindItem(viewRuleConditionData)
    this.conditionType = viewRuleConditionData.conditionType
    this.conditionValue = viewRuleConditionData.conditionValue
    // this.isClickResultNow = _.defaultValue(viewRuleConditionData.isClickResult, false)
  }

  initBindItem(viewRuleConditionData) {
    // if (this.bindItemType === 'column') {
    //   this.bindItemProp = `${this.targetViewProp}${DEVIDE}C${TAG}${viewRuleConditionData.bindItem}`
    //   this.bindItem = this.view.columnMap[this.bindItemProp]
    // } else if (viewRuleConditionData.bindItemType === 'operation') {
    //   this.bindItemProp = `${this.targetViewProp}${DEVIDE}O${TAG}${viewRuleConditionData.bindItem}`
    //   this.bindItem = this.view.operationMap[this.bindItemProp]
    // }
    // let bindColumnId = viewRuleConditionData.bindItem
    this.bindItemProp = `${this.targetViewProp}${DEVIDE}C${TAG}${viewRuleConditionData.bindColumnCode}`
    this.bindItem = this.view.columnMap[this.bindItemProp]
    console.log(this.view.columnMap, this.bindItemProp)
  }

  // findColumnValue(columnProp) {
  //   let result
  //   if (_.hasKey(this.formModel, columnProp)) {
  //     result = this.formModel[columnProp]
  //   } else {
  //     result = this.view.findColumnValue(columnProp)
  //   }
  //   return result
  // }

  //用get取值，当依赖变化时会自动计算，适用于batchView动态增减行后的动态取值
  get bindColumnValue() {
    //绑定字段是批量表格的字段时，绑定值是所有batchRow的对应字段的值
    if (this.bindItem.isTableColumn) {
      return this.bindItem.view.batchRows.map(batchRow => {
        return batchRow.formModel[this.bindItem.columnProp]
      })
    } 
    //绑定字段是普通表单字段时，绑定值就是字段对应的值
    return [this.view.formModel[this.bindItem.columnProp]]
  }

  conditionResultHandler(columnValue, conditionValue, conditionType) {
    let conditionMap = {
      1: columnValue > conditionValue,
      2: columnValue < conditionValue,
      3: columnValue === conditionValue,
      4: columnValue >= conditionValue,
      5: columnValue <= conditionValue,
      6: columnValue !== conditionValue,
      7: _.includes(columnValue, conditionValue),
      8: !_.includes(columnValue, conditionValue),
    }
    return conditionMap[conditionType]
  }

  //返回一个Promise
  //promise.reject()  视图条件异常
  //promise.resolve(result) 试图条件完成计算，result为结果
  handlerResult() {
    if (this.customCondition) {
      console.warn(`自定义视图条件的单条条件结果，customCondition(view),返回Promise.resolve(true/false)`, this)
      return this.customCondition(this.view)
    }
    // if(this.bindItemType === 'operation') {
    //   let isClick = this.bindItem.loading
    //   console.log('按钮是否被点击', isClick) 
    //   if (!isClick) {
    //     return Promise.resolve(false)
    //   }else if (this.isClickResultNow) {
    //     return Promise.resolve(true)
    //   }else {
    //     return this.bindItem.clickHandler()().then(() => {
    //       console.log('gua')
    //       return Promise.resolve(true)
    //     }).catch(() => {
    //       return Promise.resolve(false)
    //     })
    //   }
    // }

    // //绑定字段是批量表格的字段时，绑定值是所有batchRow的对应字段的值
    // let bindColumnValue = undefined
    // if(this.bindItem.isTableColumn) {
    //   bindColumnValue = this.bindItem.view.batchRows.map(batchRow => {
    //     return batchRow.formModel[this.bindItem.columnProp]
    //   })
    // }else {
    //   //绑定字段是普通表单字段时，绑定值就是字段对应的值
    //   bindColumnValue = [this.view.formModel[this.bindItem.columnProp]]
    // }
    // let bindColumnValue = this.view.formModel[this.bindItem.columnProp]
    let conditionValue = this.conditionValue
    let conditionType = this.conditionType
    // let conditionMap = {
    //   1: bindColumnValue > conditionValue,
    //   2: bindColumnValue < conditionValue,
    //   3: bindColumnValue === conditionValue,
    //   4: bindColumnValue >= conditionValue,
    //   5: bindColumnValue <= conditionValue,
    //   6: bindColumnValue !== conditionValue,
    //   7: _.includes(bindColumnValue, conditionValue),
    //   8: !_.includes(bindColumnValue, conditionValue),
    // }
    // let result = conditionMap[conditionType]
    let methodName = this.methodMap[this.conditionMethod]
    //用some / every 方法得到本条条件的结果
    let result = this.bindColumnValue[methodName](columnValue => {
      return this.conditionResultHandler(columnValue, conditionValue, conditionType)
    })
    console.log('单个视图条件结果', result, this.bindItem.columnProp)
    if(_.invalid(result)) {
      let errMsg = (`视图条件的单条条件类型(${conditionType})不存在，视图条件失败`)
      return Promise.reject(errMsg)
    }
    return Promise.resolve(result)
  }
}

export default ViewRuleCondition