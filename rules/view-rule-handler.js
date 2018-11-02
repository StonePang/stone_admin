import _ from '~utils/utils'

const DEVIDE = '-'
const TAG = '#'

class ViewRuleHandler {
  constructor(viewRuleData, view) {
    this.init(viewRuleData, view)
    // this.
  }

  //初始化实例
  init(viewRuleData, view) {
    this.view = view
    this.id = viewRuleData.id
    this.changeValue = viewRuleData.changeValue
    this.changeRender = viewRuleData.changeRender
    this.targetViewProp = String(viewRuleData.targetViewCode).split(DEVIDE).map(e => {
      return `V${TAG}${e}`
    }).join(DEVIDE)
    this.isClear = _.defaultValue(viewRuleData.isClear, false)
    //规则效果类型
    this.type = viewRuleData.type
    this.formModel = view.formModel
  }

  //对当前的视图规则进行计算，得出规则结果
  //在初始化和chang时均要触发
  //利用闭包实现对this的保留,跨作用域保存到事件中心
  // handler() {
  //   return (result) => {
  //     console.log(this, 'view-rule--->>>视图条件事件触发，运行结果', result)
  //     if (this.affectType === 'column') {
  //       this.handlerColumnType(result)
  //     } else if (this.affectType === 'subView') {
  //       this.handlerSubViewType(result)
  //     }
  //   }
  // }

  handlerEachAffectItem(callback) {
    this.affectItems.forEach(item => {
      callback(item)
    })
  }

  // setColumnValue(columnProp, value) {
  //   // if (_.hasKey(this.formModel, columnProp)) {
  //   //   this.formModel[columnProp] = value
  //   // } else {
  //   //   this.view.setColumnValue(columnProp, value)
  //   // }
  //   let column = this.view.columnMap[columnProp]
  //   column.changeColumnValue(value)
  // }

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