import _ from '~utils/utils'

/**
 * viewRuleData是单个试图规则对象
 * {
 *  type: disabled, show, hidden
 *  affectcolumns: [1,2] 影响字段id数组
 *  bindColumns: [3,4] 所有绑定字段的id数组
 *  -->conditions 为&&关系
 *  conditions: [{
 *    bindcolumn: 12 绑定字段id
 *    coditiontype: 条件关系 1-8
 *    conditionValue: 条件生效时的真实值
 *  }]
 * }
 */
class ViewRule {
  constructor(viewRuleData, view) {
    this.init(viewRuleData, view)
    //初始化时注册事件中心
    this.registerEvent('created')
    this.registerEvent('update')
    //初始化时执行一次
    // this.triggerEvent('created')
  }

  get viewRuleMap() {
    return {
      disabled: 'disabled',
      hidden: 'isShow',
      show: 'isShow',
    }
  }

  get statusMap() {
    return {
      disabled: true,
      hidden: false,
      show: true,
    }
  }

  //初始化实例
  init(viewRuleData, view) {
    let columnMap = view.columnMap
    let affectColumnIds = viewRuleData.affectColumns
    this.view = view
    this.id = viewRuleData.id
    this.type = viewRuleData.type
    this.formModel = view.formModel
    this.affectColumns = affectColumnIds.map(id => {
      return columnMap[id]
    })
    this.conditions = viewRuleData.conditions.map(item => {
      let bindColumnId = item.bindColumn
      let bindColumn = columnMap[bindColumnId]
      let conditionType = item.conditionType
      let conditionValue = item.conditionValue
      return {
        bindColumn,
        conditionType,
        conditionValue,
      }
    })
    this.bindColumns = viewRuleData.conditions.map(item => {
      return columnMap[item.bindColumn]
    })
  }

  //条件判断的结果
  conditionResult({bindValue, conditionType, conditionValue}) {
    let map = {
      1: bindValue > conditionValue,
      2: bindValue < conditionValue,
      3: bindValue === conditionValue,
      4: bindValue >= conditionValue,
      5: bindValue <= conditionValue,
      6: bindValue !== conditionValue,
      7: _.includes(bindValue, conditionValue),
      8: !_.includes(bindValue, conditionValue),
    }
    return map[conditionType]
  }

  //对当前的视图规则进行计算，得出规则结果
  //在初始化和chang时均要触发
  //利用闭包实现对this的保留,跨作用域保存到事件中心
  handler() {
    return () => {
      let result = this.conditions.every(item => {
        let bindValue = this.formModel[item.bindColumn.prop]
        let conditionType = item.conditionType
        let conditionValue = item.conditionValue
        let res = this.conditionResult({
          bindValue,
          conditionType,
          conditionValue
        })
        return res
      });
      console.log(this,'视图条件运行结果', result)
      let prop = this.viewRuleMap[this.type]
      let status = null
      if (_.invalid(prop)) {
        return
      }
      if (result) {
        status = this.statusMap[this.type]
      } else {
        status = !this.statusMap[this.type]
      }
      this.affectColumns.forEach(column => {
        column[prop] = status
      })
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

export default ViewRule