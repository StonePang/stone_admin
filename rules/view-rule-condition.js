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
    this.bindColumnProp = `${this.targetViewProp}${DEVIDE}C${TAG}${viewRuleConditionData.bindColumn}`
    this.bindColumn = this.view.columnMap[this.bindColumnProp]
    this.conditionType = viewRuleConditionData.conditionType
    this.conditionValue = viewRuleConditionData.conditionValue
  }

  findColumnValue(columnProp) {
    let result
    if (_.hasKey(this.formModel, columnProp)) {
      result = this.formModel[columnProp]
    } else {
      result = this.view.findColumnValue(columnProp)
    }
    return result
  }


  handlerResult() {
    let bindColumnValue = this.findColumnValue(this.bindColumn.columnProp)
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
    console.log('单个视图条件结果', result, this.bindColumn.columnProp)
    if(_.invalid(result)) {
      console.warn(`视图条件的条件类型(${conditionType})不存在，视图条件失败`)
      return Promise.reject()
    }
    if(result) {
      return Promise.resolve()
    }
    return Promise.reject()
  }
}

export default ViewRuleCondition