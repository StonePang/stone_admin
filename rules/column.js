import ValidateRule from './validate-rule'
import _ from '~utils/utils'
class Column {
  constructor(columnData, view) {
    this.view = view
    this.id = columnData.id
    this.placeholder = _.defaultValue(columnData.placeholder, null)
    this.disabled = _.defaultValue(columnData.disabled, false)
    this.prop = _.defaultValue(columnData.prop, null)
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
    this.rules = this.handlerRule({
      label: this.label,
      required: this.required,
      rules: _.defaultValue(columnData.rules, [])
    })
  }

  handlerRule({label, required, rules}) {
    let validateRule =  new ValidateRule({label, required, rules})
    return validateRule.rules
  }
  
  triggerChange(formModel) {
    console.log(`${this.prop}触发column内的change,此时value为(${formModel})`)
    this.view.triggerChange(this, formModel)
    //TODO:字段的改变事件
  }
}

export default Column