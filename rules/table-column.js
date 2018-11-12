import ValidateRule from './validate-rule'
// import ValueRule from './value-rule'
import _ from '~utils/utils'
// import EventHandler from './event-handler'

const DEVIDE = '-'
const TAG = '#'
class TableColumn {
  constructor(columnData, view) {
    this.handlerCreated(columnData, view)
  }

  handlerCreated(columnData, view) {
    this.view = view
    this.columnData = columnData
    this.id = columnData.id
    this.desc = _.defaultValue(columnData.desc, '')
    this.code = _.defaultValue(columnData.code, this.id)
    this.renderType = _.defaultValue(columnData.renderType, 'form') //form  table
    this.placeholder = _.defaultValue(columnData.placeholder, null)
    this.disabled = _.defaultValue(columnData.disabled, false)
    this.defaultValue = _.defaultValue(columnData.defaultValue, null)
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
    this.isTableColumn = true
    this.initProp()
    // this.initDefaultValue()
    // this.initEventHandler()
    this.initValidateRule({
      label: this.label,
      required: this.required,
      rules: _.defaultValue(columnData.rules, [])
    })
    // this.initValueRule()
    // this.view.registerEvent(`column:${this.id}`, this.eventBus)
  }

  initProp() {
    // console.log(this.view)
    this.prop = `C${TAG}${this.code}`
    let columnProp = `${this.view.viewProp}${DEVIDE}${this.prop}`
    this.columnProp = columnProp
  }
  //初始化validate-rules
  initValidateRule({label, required, rules}) {
    let validateRule =  new ValidateRule({label, required, rules})
    this.rules = validateRule.rules
  }

  // initDefaultValue() {
  //   let value = this.view.formModel[this.columnProp]
  //   console.log('设置字段默认值', value, this.defaultValue)
  //   if (_.valid(this.defaultValue) && _.invalid(value)) {
  //     // console.log('设置字段默认值')
  //     this.changeColumnValue(this.defaultValue)
  //   }
  // }

  // initValueRule() {
  //   this.valueRule = new ValueRule(this)
  // }

  // //注册字段内的事件handler，一种类型注册一个，注册的时候定义name,sort,isSync
  // initEventHandler() {
  //   let eventBusData = {
  //     name: `column:${this.id}`,
  //     isSync: true,
  //     isTriggerNow: false,
  //     isTriggerOnce: false,
  //   }
  //   let eventBusEventHandler = new EventHandler(eventBusData)

  //   let valueRuleData = {
  //     name: `column:${this.id}-value-rule`,
  //     sort: 1,
  //     isSync: true,
  //     isTriggerNow: false,
  //     isTriggerOnce: false,
  //   }
  //   let valueRuleEventHandler = new EventHandler(valueRuleData)
  //   let viewRuleData = {
  //     name: `column:${this.id}-view-rule`,
  //     sort: 2,
  //     isSync: true,
  //     isTriggerNow: false,
  //     isTriggerOnce: false,
  //   }
  //   let viewRuleEventHandler = new EventHandler(viewRuleData)

  //   let customData = {
  //     name: `column:${this.id}-custom`,
  //     sort: 3,
  //     isSync: false,
  //     isTriggerNow: false,
  //     isTriggerOnce: false,
  //   }
  //   this.customHandler = new EventHandler(customData)

  //   eventBusEventHandler.addHandler(valueRuleEventHandler)
  //   eventBusEventHandler.addHandler(viewRuleEventHandler)
  //   eventBusEventHandler.addHandler(this.customHandler)
  //   this.eventBus = eventBusEventHandler
  // }

  // //将子handler挂载到本事件内的
  // // addHandler(spaceName, handler) {
  // //   let result = this.EventHandler.find(item => {
  // //     return item.name === spaceName
  // //   })
  // //   if(!result) {
  // //     console.warn(`column(${this.id})注册事件失败, 没有(${spaceName})事件---由(${handler.name})进行注册`)
  // //     return
  // //   }
  // //   result.addHandler(handler)
  // // }

  // changeColumnValue(newValue) {
  //   let oldValue = this.view.formModel[this.columnProp]
  //   if (oldValue === newValue) {
  //     return
  //   }
  //   this.view.formModel[this.columnProp] = newValue
  //   // this.triggerEvent('update', newValue)
  //   this.triggerChange(newValue)
  // }

  // triggerChange(val) {
  //   this.triggerEvent(val)
  // }

  // //将指定函数注册到view的事件中心，定义字段的创建/更新事件
  // registerEvent(spaceName, eventHandler) {
  //   let name = `column:${this.id}-${spaceName}`
  //   console.log(this.eventBus, name)
  //   let result = this.eventBus.handler.find(item => {
  //     return item.name === name
  //   })
  //   if (!result) {
  //     console.warn(`(${name})不能绑定在对应字段的事件中心内-->>(${spaceName})不存在`)
  //   }
  //   result.addHandler(eventHandler)
  // }


  // triggerEvent(...arg) {
  //   let eventName = `column:${this.id}`
  //   this.view.triggerEvent(eventName, ...arg)
  // }

  // addEventListener(type, callback) {
  //   let typeMap = {
  //     created: true,
  //     update: false,
  //   }
  //   let customData = {
  //     name: `column:${this.id}-custom-${type}`,
  //     sort: 1,
  //     isSync: false,
  //     isTriggerNow: typeMap[type] || false,
  //     isTriggerOnce: typeMap[type] || false,
  //   }
  //   let customHandler = new EventHandler(customData)
  //   //将函数添加到eventHandler对象中
  //   customHandler.addHandler(() => {
  //     callback(this)
  //   })
  //   this.customHandler.addHandler(customHandler)
  // }

  // //处理显示值的方法，用与详情table的显示
  // handlerShowValue() {
  //   return () => {
  //     let value = this.view.formModel[this.columnProp]
  //     console.log('showValue', this.columnProp, value)
  //     // let showValueMap
  //     this.showValue = value
  //   }
  // }
}

export default TableColumn