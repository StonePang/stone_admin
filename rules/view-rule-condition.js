import _ from '~utils/utils'

const DEVIDE = '-'
const TAG = '#'

class ViewRuleCondition {
  constructor(viewRuleConditionData, view) {
    this.init(viewRuleConditionData, view)
  }

  init(viewRuleConditionData, view) {
    this.view = view
    this.targetViewProp = viewRuleConditionData.targetViewId.split(DEVIDE).map(e => {
      return `V${TAG}${e}`
    }).join(DEVIDE)
    this.customCondition = viewRuleConditionData.customCondition || null
    this.bindItemType = viewRuleConditionData.bindItemType || 'column'
    // this.bindItemProp = `${this.targetViewProp}${DEVIDE}C${TAG}${viewRuleConditionData.bindItem}`
    // this.bindItem = this.view.columnMap[this.bindItemProp]
    this.initBindItem(viewRuleConditionData)
    this.conditionType = viewRuleConditionData.conditionType
    this.conditionValue = viewRuleConditionData.conditionValue
    this.isClickResultNow = _.defaultValue(viewRuleConditionData.isClickResult, false)
  }

  initBindItem(viewRuleConditionData) {
    if (this.bindItemType === 'column') {
      this.bindItemProp = `${this.targetViewProp}${DEVIDE}C${TAG}${viewRuleConditionData.bindItem}`
      this.bindItem = this.view.columnMap[this.bindItemProp]
    } else if (viewRuleConditionData.bindItemType === 'operation') {
      this.bindItemProp = `${this.targetViewProp}${DEVIDE}O${TAG}${viewRuleConditionData.bindItem}`
      this.bindItem = this.view.operationMap[this.bindItemProp]
    }
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

  //返回一个Promise
  //promise.reject()  视图条件异常
  //promise.resolve(result) 试图条件完成计算，result为结果
  handlerResult() {
    if (this.customCondition) {
      return this.customCondition(this.view)
    }
    if(this.bindItemType === 'operation') {
      let isClick = this.bindItem.loading
      console.log('按钮是否被点击', isClick) 
      if (!isClick) {
        return Promise.resolve(false)
      }else if (this.isClickResultNow) {
        return Promise.resolve(true)
      }else {
        return this.bindItem.clickHandler()().then(() => {
          console.log('gua')
          return Promise.resolve(true)
        }).catch(() => {
          return Promise.resolve(false)
        })
      }
    }
    // let bindColumnValue = this.findColumnValue(this.bindItem.columnProp)
    let bindColumnValue = this.view.formModel[this.bindItem.columnProp]
    let conditionValue = this.conditionValue
    let conditionType = this.conditionType
    let conditionMap = {
      1: bindColumnValue > conditionValue,
      2: bindColumnValue < conditionValue,
      3: bindColumnValue === conditionValue,
      4: bindColumnValue >= conditionValue,
      5: bindColumnValue <= conditionValue,
      6: bindColumnValue !== conditionValue,
      7: _.includes(bindColumnValue, conditionValue),
      8: !_.includes(bindColumnValue, conditionValue),
    }
    let result = conditionMap[conditionType]
    console.log('单个视图条件结果', result, this.bindItem.columnProp)
    if(_.invalid(result)) {
      let errMsg = (`视图条件的单条条件类型(${conditionType})不存在，视图条件失败`)
      return Promise.reject(errMsg)
    }
    return Promise.resolve(result)
  }
}

export default ViewRuleCondition