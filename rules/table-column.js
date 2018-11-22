import ValidateRule from './validate-rule'
// import ValueRule from './value-rule'
import _ from '~utils/utils'
import EventHandler from './event-handler'

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
    this.initEventHandler()
    this.initValidateRule({
      label: this.label,
      required: this.required,
      rules: _.defaultValue(columnData.rules, [])
    })
    // this.registerEvent('disabled', this.disabledhandler)
    this.view.registerEvent(`column:${this.code}`, this.eventBus)
    this.registerEvent('disabled', this.disabledHandler())
    this.registerEvent('isShow', this.isShowHandler())
    this.registerEvent('renderType', this.renderTypeHandler())
    this.registerEvent('changeColumnValue', this.changeColumnValueHandler())

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

  //注册字段内的事件handler，一种类型注册一个，注册的时候定义name,sort,isSync
  initEventHandler() {
    let eventBusData = {
      name: `column:${this.code}`,
      isSync: true,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    let eventBusEventHandler = new EventHandler(eventBusData)

    let disabledData = {
      name: `column:${this.code}-disabled`,
      sort: 4,
      isSync: true,
      isTriggerNow: true,
      isTriggerOnce: false,
    }
    let disabledHandler = new EventHandler(disabledData)

    let isShowData = {
      name: `column:${this.code}-isShow`,
      sort: 5,
      isSync: true,
      isTriggerNow: true,
      isTriggerOnce: false,
    }
    let isShowHandler = new EventHandler(isShowData)

    let renderTypeData = {
      name: `column:${this.code}-renderType`,
      sort: 6,
      isSync: true,
      isTriggerNow: true,
      isTriggerOnce: false,
    }
    let renderTypeHandler = new EventHandler(renderTypeData)

    let changeColumnValueData = {
      name: `column:${this.code}-changeColumnValue`,
      sort: 7,
      isSync: true,
      isTriggerNow: true,
      isTriggerOnce: false,
    }
    let changeColumnValueHandler = new EventHandler(changeColumnValueData)
    
    let viewRuleData = {
      name: `column:${this.code}-view-rule`,
      sort: 2,
      isSync: true,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    let viewRuleEventHandler = new EventHandler(viewRuleData)

    let customData = {
      name: `column:${this.code}-custom`,
      sort: 3,
      isSync: false,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    this.customHandler = new EventHandler(customData)

    eventBusEventHandler.addHandler(disabledHandler)
    eventBusEventHandler.addHandler(isShowHandler)
    eventBusEventHandler.addHandler(renderTypeHandler)
    eventBusEventHandler.addHandler(changeColumnValueHandler)
    eventBusEventHandler.addHandler(viewRuleEventHandler)
    eventBusEventHandler.addHandler(this.customHandler)
    this.eventBus = eventBusEventHandler
  }

  disabledHandler() {
    return () => {
      this.proxyColumns.forEach(column => {
        column.disabled = this.disabled
      })
    }
  }
  isShowHandler() {
    return () => {
      // console.log('isShow', this.isShow)
      this.proxyColumns.forEach(column => {
        column.isShow = this.isShow
      })
    }
  }
  renderTypeHandler() {
    return () => {
      this.proxyColumns.forEach(column => {
        column.renderType = this.renderType
      })
    }
  }
  changeColumnValueHandler() {
    return () => {
      let value = _.defaultValue(this.value, null)
      console.log('guavalue', value)
      this.proxyColumns.forEach(column => {
        // let newValue = _.cloneDeep(value)
        console.log(value, column)
        column.changeColumnValue(value)
      })
    }
  }

  setProp() {
    let propStatus = {
      disabled: true,
      isShow: true,
      renderType: true,
      changeColumnValue: false,
    }
    let handlers = this.eventBus.handler.filter(handler => {
      let name = handler.name.split('-')[1]
      // console.log('name', name)
      return propStatus[name]
    })
    console.log(handlers, this.eventBus)
    handlers.forEach(handler => {
      handler.trigger()
    })
  }



  get proxyColumns() {
    return this.view.batchRows.map(batchRow => {
      return batchRow.columnMap[this.columnProp]
    })
  }
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

  //将指定函数注册到view的事件中心，定义字段的创建/更新事件
  registerEvent(spaceName, eventHandler) {
    let name = `column:${this.code}-${spaceName}`
    console.log(this.eventBus, name)
    let result = this.eventBus.handler.find(item => {
      return item.name === name
    })
    if (!result) {
      console.warn(`(${name})不能绑定在对应字段的事件中心内-->>(${spaceName})不存在`)
    }
    result.addHandler(eventHandler)
    // debugger
    this.proxyEvent()
  }

  //代理column事件，将tableColumn的事件代理到batchRow的对应column上
  //由于不是用triggerEvent注册到column上，不能实现created的自动触发，需要手动调用triggerEvent触发一次
  //用于新增batchRow时手动调用，
  proxyEvent(proxyColumns = this.proxyColumns) {
    let map = {
      disabled: true,
      isShow: true,
      renderType: true,
      changeColumnValue: true
    }
    proxyColumns = _.isArray(proxyColumns) ? proxyColumns : [proxyColumns]
    proxyColumns.forEach(proxyColumn => {
      let filterHandler = this.eventBus.handler.filter(handler => {
        let key = handler.name.split('-')[1]
        return !map[key]
      })
      filterHandler.forEach(handler => {
        let name = handler.name
        let proxyHandler = proxyColumn.eventBus.handler.find(proxyHandler => {
          return proxyHandler.name === name
        })
        if (!proxyHandler) {
          proxyColumn.eventBus.addHandler(handler)
        }else {
          // proxyHandler.handler = handler.handler
          let temp = [...proxyHandler.handler, ...handler.handler]
          proxyHandler.handler = _.uniqBy(temp, 'name')
        }
      })
      console.log('proxyColumn', proxyColumn)
      proxyColumn.triggerEvent()
    })
    // let setPropHandler = this.eventBus.handler.find(handler => {
    //   return handler.name === `column:${this.code}-setProp`
    // })
    // setPropHandler.trigger()
    this.setProp()
  }

  //直接触发字段上的eventhandler
  triggerEvent(name, ...arg) {
    let eventName = `column:${this.code}-${name}`
    // this.view.triggerEvent(eventName, ...arg)
    let eventHandler = this.eventBus.handler.find(handler => {
      return handler.name === eventName
    })
    console.log('gua', eventHandler, ...arg)
    eventHandler.trigger(...arg)
  }

  addEventListener(type, callback) {
    let typeMap = {
      created: true,
      update: false,
    }
    let customData = {
      name: `column:${this.code}-custom-${type}`,
      sort: 1,
      isSync: false,
      isTriggerNow: typeMap[type] || false,
      isTriggerOnce: typeMap[type] || false,
    }
    let customHandler = new EventHandler(customData)
    //将函数添加到eventHandler对象中
    customHandler.addHandler(() => {
      callback(this)
    })
    this.customHandler.addHandler(customHandler)
  }

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