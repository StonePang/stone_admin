import _ from '~utils/utils'

/**
 * viewRuleData是单个试图规则对象
 * {
 *  type: disabled, show, hidden
 *  affectType: 影响对象类型 column, subView(只有show,hidden)
 *  affectItems: [1,2] 影响字段id数组
 *  -->conditions 为&&关系,规则生效条件
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

  get viewRulePropMap() {
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

  //规则影响类型，字段和子表对应的itemMap不同
  get affectTypeMap() {
    return {
      column: 'columnMap',
      subView: 'subViewMap'
    }
  }

  //初始化实例
  init(viewRuleData, view) {
    let columnMap = view.columnMap
    //影响对象ids
    let affectItemIds = viewRuleData.affectItems
    this.view = view
    this.id = viewRuleData.id
    this.desc = viewRuleData.desc
    this.desc = viewRuleData.desc
    this.isClear = _.defaultValue(viewRuleData.isClear, false)
    //规则效果类型
    this.type = viewRuleData.type
    //规则影响对象类型
    this.affectType = viewRuleData.affectType
    this.formModel = view.formModel
    //规则影响对象map
    this.itemMap = view[this.affectTypeMap[this.affectType]]
    //影响对象实例数组
    this.affectItems = affectItemIds.map(id => {
      return this.itemMap[id]
    })
    //规则生效条件
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
    //绑定字段实例集合
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
      if (this.affectType === 'column') {
        this.handlerColumnType(result)
      }else if (this.affectType === 'subView') {
        this.handlerSubViewType(result)
      }
    }
  }

  //column  subView 类型对试图条件结果的处理(找到影响字段的相应prop并赋值)
  handlerColumnType(result) {
    let prop = this.viewRulePropMap[this.type]
    let status = null
    if (_.invalid(prop)) {
      console.log(this, '视图条件失败，没有此种生效类型--->', this.type)
      return
    }
    if (result) {
      status = this.statusMap[this.type]
    } else {
      status = !this.statusMap[this.type]
    }
    //所有影响字段的对应属性修改
    //处理字段值清空的情况
    this.affectItems.forEach(item => {
      item[prop] = status
      if (result && this.isClear) {
        this.formModel[item.prop] = null
      }
    })
  }

  //column  subView 类型对试图条件结果的处理(找到影响字段的相应prop并赋值)
  handlerSubViewType(result) {
    let prop = this.viewRulePropMap[this.type]
    let status = null
    if (_.invalid(prop)) {
      console.log(this, '视图条件失败，没有此种生效类型--->', this.type)
      return
    }
    if (result) {
      status = this.statusMap[this.type]
    } else {
      status = !this.statusMap[this.type]
    }
    //所有影响视图的对应属性修改
    //处理视图值清空的情况
    this.affectItems.forEach(view => {
      //先执行清空视图操作
      if (result && this.isClear) {
        view.triggerEvent('update', 'clearFormModel')
      }
      if (this.type === 'hidden' || this.type === 'show') {
        view[prop] = status
      }else if(this.type === 'disabled') {
        view.triggerEvent('update', 'disabledView', status)
      }
    })
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