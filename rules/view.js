import Column from './column'
import Operation from './operation'
// import ViewRule from './view-rule'
import ViewRule from './view-rule-new'
import EventBus from './event-bus'
import _ from '~utils/utils'


const DEVIDE = '-'
const TAG = '#'
class View {
  constructor(viewData) {
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
  
  handlerCreated(viewData) {
    this.eventBus = new EventBus()
    this.viewData = viewData
    this.id = viewData.id
    this.renderType = _.defaultValue(viewData.renderType, 'form')
    this.title = _.defaultValue(viewData.title, `视图-${this.id}`)
    this.isShow = _.defaultValue(viewData.isShow, true)
    // this.prop = _.defaultValue(viewData.prop, 'defaultProp')
    this.prop = `V${TAG}${this.id}`
    // this.viewProp = _.defaultValue(viewData.viewProp, this.prop)
    this.viewProp = viewData.fatherViewProp ? `${viewData.fatherViewProp}${DEVIDE}${this.prop}` : this.prop
    // this.columnData = _.defaultValue(viewData.columnData, [])
    this.formModel = _.defaultValue(viewData.formModel, {})
    // this.initFormModel(viewData.formModel)
    // this.viewRuleData = _.defaultValue(viewData.viewRuleData, [])
    // this.subViewData = _.defaultValue(viewData.subViewData, [])
    this.initColumns(this.columnData, this)
    this.initColumnMap(this.columns)
    this.initSubView(this.subViewData, this)
    this.initSubViewMap(this.subView)
    this.initOperations(this.operationData, this)
    this.initOperationMap(this.operations)
    this.registerEvent('update', 'clearFormModel', this.clearFormModel())
    this.registerEvent('update', 'disabledView', this.disabledView())
    this.registerEvent('update', 'changeRender', this.changeRender())
    this.initViewRules(this.viewRuleData, this)
    console.log('view', this)
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
    let viewRules =  viewRuleData.map(data => {
      return new ViewRule(data, view)
    })
    this.viewRules = viewRules
  }

  initFormModel(formModelData) {
    this.formModel = _.defaultValue(formModelData, {})
  }

  initSubView(subViewData, view) {
    view.subView = []
    subViewData.forEach(item => {
      item.fatherViewProp = view.viewProp
      let subView = new View(item)
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
    console.log('path', path)
    // _.setObjectValue(this.formModel, path, value)
    let column = this.columnMap[columnProp]
    column.changeColumnValue(value)
  }

  initSubViewMap(subView) {
    let map = {}
    subView.forEach(view => {
      let key = view.viewProp
      let e = map[key]
      if (_.invalid(e)) {
        map[key] = view
      } else {
        console.log(`子视图(${key})已经存在于subViewMap,不覆盖`)
      }
    })
    // return map
    this.subViewMap = map
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
        console.log(`操作(${key})已经存在于OperationMap,不覆盖`)
      }
    })
    // return map
    this.operationMap = map
  }


  //清空formModel，只清空字段的值，不处理子视图
  clearFormModel() {
    return () => {
      // console.log('clear formModel', this.id, this.formModel)
      // for (const key in this.formModel) {
      //   if (this.formModel.hasOwnProperty(key) && _.includes(key, 'C')) {
      //     this.formModel[key] = null;
      //   }
      // }
      this.columns.forEach(column => {
        column.changeColumnValue(null)
      })
      console.log('清空后的formmodel', this.formModel, this)
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
  disabledView() {
    return (status) => {
      this.columns.forEach(column => {
        column.disabled = status
      })
    }
  }
  
  registerEvent(type, eventName, callback, ...args) {
    if (type !== 'created' && type !== 'update') {
      console.warn(`view---(${type})类型的事件中心不存在，事件注册失败`)
      return
    }
    let viewPrefix = `${type}_view:${this.id}_`
    let name = eventName
    if (!_.includes(eventName, viewPrefix)) {
      name = viewPrefix + eventName
    }
    let isTrigger = type === 'created' ? true : false
    this.eventBus.register(isTrigger, name, callback, ...args)
  }

  triggerEvent(type, eventName, ...args) {
    if (type !== 'created' && type !== 'update') {
      console.warn(`view---(${type})类型的事件中心不存在，事件触发失败`)
      return
    }
    let viewPrefix = `${type}_view:${this.id}_`
    let name = eventName
    if (!_.includes(eventName, viewPrefix)) {
      name = viewPrefix + eventName
    }
    this.eventBus.trigger(name, ...args)
  }

  destroy() {
    this.eventBus.destroy()
    console.log('eventBus destroy.')
  }

  //暴露给外部的执行自定义时间注册的方法，回调参数是view实例
  addEventListener(type, callback) {
    let eventname = 'customEvent'
    this.registerEvent(type, eventname, () => {
      callback(this)
    })
  }
}

export default View