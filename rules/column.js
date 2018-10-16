import ValidateRule from './validate-rule'
import _ from '~utils/utils'

const DEVIDE = '-'
const TAG = '#'
class Column {
  constructor(columnData, view) {
    this.handlerCreated(columnData, view)
  }

  handlerCreated(columnData, view) {
    this.view = view
    this.id = columnData.id
    this.desc = columnData.desc
    this.placeholder = _.defaultValue(columnData.placeholder, null)
    this.disabled = _.defaultValue(columnData.disabled, false)
    // this.prop = _.defaultValue(columnData.prop, null)
    this.label = _.defaultValue(columnData.label, null)
    this.required = _.defaultValue(columnData.required, true)
    this.multiple = _.defaultValue(columnData.multiple, false)
    this.options = _.defaultValue(columnData.options, [])
    this.filterable = _.defaultValue(columnData.filterable, false)
    this.loading = _.defaultValue(columnData.loading, false)
    this.remote = _.defaultValue(columnData.remote, false)
    this.type = _.defaultValue(columnData.type, null)
    this.start = _.defaultValue(columnData.start, null)
    this.end = _.defaultValue(columnData.end, null)
    this.rows = _.defaultValue(columnData.rows, null)
    this.isFull = _.defaultValue(columnData.isFull, false)
    this.isShow = _.defaultValue(columnData.isShow, true)
    this.showChooseAll = _.defaultValue(columnData.showChooseAll, false)
    this.componentRender = columnData.componentRender || null
    this.initProp()
    this.initValidateRule({
      label: this.label,
      required: this.required,
      rules: _.defaultValue(columnData.rules, [])
    })
    this.registerEvent('created', this.handlerShowValue())
    this.registerEvent('update', this.handlerShowValue())
  }

  initProp() {
    // console.log(this.view)
    this.prop = `C${TAG}${this.id}`
    let columnProp = `${this.view.viewProp}${DEVIDE}${this.prop}`
    this.columnProp = _.defaultValue(columnProp, null)
  }
  //初始化validate-rules
  initValidateRule({label, required, rules}) {
    let validateRule =  new ValidateRule({label, required, rules})
    this.rules = validateRule.rules
  }

  //将指定函数注册到view的事件中心，定义字段的创建/更新事件
  registerEvent(type, callback) {
    let eventName = `column:${this.id}`
    if (type !== 'created' && type !== 'update') {
      console.log(`column---(${type})类型的事件总线不存在，事件注册失败`)
      return
    }
    this.view.registerEvent(type, eventName, callback)
  }
  

  triggerEvent(type, ...arg) {
    if (type !== 'created' && type !== 'update') {
      console.log(`column---triggerEvent---(${type})类型的字段事件不存在`)
      return
    }
    let eventName = `column:${this.id}`
    this.view.triggerEvent(type, eventName, ...arg)
  }

  addEventListener(type, callback) {
    this.registerEvent(type, () => {
      callback(this)
    })
  }

  //处理显示值的方法，用与详情table的显示
  handlerShowValue() {
    return () => {
      let value = this.view.formModel[this.columnProp]
      console.log('showValue', this.columnProp, value)
      // let showValueMap
      this.showValue = value
    }
  }
}

export default Column