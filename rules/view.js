import Column from './column'
import Operation from './operation'
// import ViewRule from './view-rule'
import ViewRule from './view-rule-new'
import OperationRule from './operation-rule'
import EventBus from './event-bus'
import _ from '~utils/utils'
import EventHandler from './event-handler'


const DEVIDE = '-'
const TAG = '#'
class View {
  constructor(viewData, formModelData=undefined) {
    if (!viewData.formModel && _.invalid(formModelData)) {
      console.warn(`没有获取到formModel的数据,初始view失败---(${viewData.code})`, viewData)
      return 
    }
    if (!viewData.formModel) {
      this.initFormModelData(viewData, formModelData)
    }
    this.handlerCreated(viewData)
  }

  get columnData() {
    return _.defaultValue(this.viewData.columnData, [])
  }

  get viewRuleData() {
    return _.defaultValue(this.viewData.viewRuleData, [])
  }

  get subViewData() {
    return _.defaultValue(this.viewData.subViewData, [])
  }

  get operationData() {
    return _.defaultValue(this.viewData.operationData, [])
  }

  get operationRuleData() {
    return _.defaultValue(this.viewData.operationRuleData, [])
  }
  
  handlerCreated(viewData) {
    this.eventBus = new EventBus()
    this.viewData = viewData
    this.id = viewData.id
    this.code = _.defaultValue(viewData.code, this.id)
    this.renderType = _.defaultValue(viewData.renderType, 'form')
    this.title = _.defaultValue(viewData.title, `视图-${this.code}`)
    this.isShow = _.defaultValue(viewData.isShow, true)
    this.disabled = _.defaultValue(viewData.disabled, false)
    this.isDialog = _.defaultValue(viewData.isDialog, false)
    this.prop = `V${TAG}${this.code}`
    // this.viewProp = _.defaultValue(viewData.viewProp, this.prop)
    this.viewProp = viewData.fatherViewProp ? `${viewData.fatherViewProp}${DEVIDE}${this.prop}` : this.prop
    // this.columnData = _.defaultValue(viewData.columnData, [])
    // this.formModel = _.defaultValue(viewData.formModel, {})
    this.initFormModel(viewData.formModel)
    this.initViewMap()
    // this.viewRuleData = _.defaultValue(viewData.viewRuleData, [])
    // this.subViewData = _.defaultValue(viewData.subViewData, [])
    this.initColumns(this.columnData, this)
    this.initColumnMap(this.columns)
    this.initOperations(this.operationData, this)
    this.initOperationMap(this.operations)
    this.initSubView(this.subViewData, this)
    // this.registerEvent('clearFormModel', this.clearFormModel())
    this.initViewEventHandler()
    // this.registerEvent('disabledChange', this.disabledChange())
    // this.registerEvent('changeRender', this.changeRender())
    this.initViewRules(this.viewRuleData, this)
    this.initOperationRules(this.operationRuleData, this)
    // this.i
    console.log('view', this)
  }

  initFormModelData(viewData, formModelData) {
    viewData.formModel = {}
    for (const code in formModelData) {
      if (formModelData.hasOwnProperty(code)) {
        const value = formModelData[code];
        let isColumnProp = viewData.columnData.some(columnData => {
          return columnData.code === code
        })
        let subViewData_ = viewData.subViewData.find(subViewData => {
          return subViewData.code === code
        })
        if (!isColumnProp && _.invalid(subViewData_)) {
          console.warn(`初始化formModelData出错---(${code})不是column和subView的prop`)
        } else if (isColumnProp && _.valid(subViewData_)) {
          console.warn(`初始化formModelData出错---(${code})既是column也是subView的prop`)
        } else if (isColumnProp) {
          viewData.formModel[code] = value
        }else {
          subViewData_.formModel = value
        }
      }
      // console.log('gua', viewData.subViewData)
    }
      console.log('gua', viewData.subViewData)
  }


  initFormModel(formModelData) {
    let formModel = _.mapKeys(formModelData, (value, key) => {
      let newKey = `${this.viewProp}${DEVIDE}C${TAG}${key}`
      return newKey
    })
    this.formModel = formModel
    console.log('new formModel', this.formModel)
  }

  //生成columns
  initColumns(columnsData, view) {
    let columns = columnsData.map(data => {
      return new Column(data, view);
    });
    this.columns = columns
  }

  //生成columnMap
  initColumnMap(columns) {
    let map = {}
    columns.forEach(column => {
      let key = column.columnProp
      let e = map[key]
      if(_.invalid(e)) {
        map[key] = column
      } else {
        console.log(`字段(${key})已经存在于columnMap,不覆盖`)
      }
    })
    // return map
    this.columnMap = map
  }

  //生成视图条件
  initViewRules(viewRuleData, view) {
    let viewRules = viewRuleData.map(data => {
      return new ViewRule(data, view)
    })
    this.viewRules = viewRules
  }

  initOperationRules(operationRuleData, view) {
    let operationRules = operationRuleData.map(data => {
      return new OperationRule(data, view)
    })
    this.operationRules = operationRules
  }

  // initFormModel(formModelData) {
  //   this.formModel = _.defaultValue(formModelData, {})
  // }

  initSubView(subViewData, view) {
    view.subView = []
    console.log('guagua', subViewData)
    subViewData.forEach(item => {
      item.fatherViewProp = view.viewProp
      let subView = new View(item)
      console.log('guag', subView)
      view.subView.push(subView)
      let subFormModel = subView.formModel
      // let prop = subView.viewProp
      subView.viewProp = `${view.viewProp}${DEVIDE}${subView.prop}`
      if (_.invalid(view.formModel[subView.viewProp])) {
        view.formModel[subView.viewProp] = subFormModel
      } else {
        console.log(`subView--->(${subView.id})的prop与上级view的formModel中prop重合，subFormModel挂载失败`)
      }
      view.columnMap = Object.assign(view.columnMap, subView.columnMap)
      view.operationMap = Object.assign(view.operationMap, subView.operationMap)
      view.viewMap = Object.assign(view.viewMap, subView.viewMap)
    })
  }

  findColumnValue(columnProp) {
    let arr = columnProp.split(DEVIDE)
    let length = arr.length
    let path = []
    for (let i = 2; i <= length; i++) {
      let r = arr.slice(0, i).join(DEVIDE)
      path.push(r)
    }
    // console.log(this.formModel, path)
    return _.getObjectValue(this.formModel, path)
  }

  setColumnValue(columnProp, value) {
    let arr = columnProp.split(DEVIDE)
    let length = arr.length
    let path = []
    for (let i = 2; i <= length; i++) {
      let r = arr.slice(0, i).join(DEVIDE)
      path.push(r)
    }
    // console.log('path', path)
    // _.setObjectValue(this.formModel, path, value)
    let column = this.columnMap[columnProp]
    column.changeColumnValue(value)
  }

  initViewMap() {
    let map = {}
    // map[this.viewProp] = this
    // subView.forEach(view => {
    //   let key = view.viewProp
    //   let e = map[key]
    //   if (_.invalid(e)) {
    //     map[key] = view
    //   } else {
    //     console.warn(`子视图(${key})已经存在于subViewMap,不覆盖`)
    //   }
    // })
    // this.viewMap = map
    map[this.viewProp] = this
    this.viewMap = map
  }

  initOperations(operationData, view) {
    let operations = operationData.map(data => {
      return new Operation(data, view);
    });
    this.operations = operations
  }

  initOperationMap(operations) {
    let map = {}
    operations.forEach(operation => {
      let key = operation.operationProp
      let e = map[key]
      if (_.invalid(e)) {
        map[key] = operation
      } else {
        console.warn(`操作(${key})已经存在于OperationMap,不覆盖`)
      }
    })
    this.operationMap = map
  }

  initViewEventHandler() {
    let clearFormModelData = {
      name: `clear`,
      sort: 1,
      isSync: true,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    let clearHandler = new EventHandler(clearFormModelData)
    clearHandler.addHandler(this.clearFormModel())
    let disabledData = {
      name: `disabled`,
      sort: 1,
      isSync: true,
      isTriggerNow: true,
      isTriggerOnce: false,
    }
    let disabledHandler = new EventHandler(disabledData)
    disabledHandler.addHandler(this.disabledChange())
    let changeRenderData = {
      name: `changeRender`,
      sort: 1,
      isSync: true,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    let changeRenderHandler = new EventHandler(changeRenderData)
    changeRenderHandler.addHandler(this.changeRender())
    let customData = {
      name: `custom`,
      sort: 1,
      isSync: true,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    this.customHandler = new EventHandler(customData)

    this.registerEvent('clearFormModel', clearHandler)
    this.registerEvent('disabledChange', disabledHandler)
    this.registerEvent('changeRender', changeRenderHandler)
    this.registerEvent('custom', this.customHandler)
  }

  //清空formModel，只清空字段的值，不处理子视图
  clearFormModel() {
    return () => {
      this.columns.forEach(column => {
        column.changeColumnValue(null)
      })
    }
  }
  changeRender() {
    return (type) => {
      this.renderType = type
      this.columns.forEach(column => {
        column.renderType = type
      })
    }
  }
  disabledChange() {
    return () => {
      let status = this.disabled
      this.columns.forEach(column => {
        column.disabled = status
      })
    }
  }
  
  registerEvent(eventName, eventHandler, ...args) {
    let viewPrefix = `view:${this.id}-`
    let name = eventName
    if (!_.includes(eventName, viewPrefix)) {
      name = viewPrefix + eventName
    }
    this.eventBus.register(name, eventHandler, ...args)
  }

  triggerEvent(eventName, ...args) {
    let viewPrefix = `view:${this.id}-`
    let name = eventName
    if (!_.includes(eventName, viewPrefix)) {
      name = viewPrefix + eventName
    }
    return this.eventBus.trigger(name, ...args)
  }

  destroy() {
    this.eventBus.destroy()
    console.log('eventBus destroy.')
  }

  //暴露给外部的执行自定义时间注册的方法，回调参数是view实例
  addEventListener(type, callback) {
    let typeMap = {
      created: true,
      update: false,
    }
    let customData = {
      name: `custom-${type}`,
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
}

export default View