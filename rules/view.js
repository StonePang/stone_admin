import Column from './column'
import ViewRule from './view-rule'
import EventBus from './event-bus'
import _ from '~utils/utils'

const BUSMAP = {
  created: 'createdBus',
  update: 'updateBus'
}

const DEVIDE = '-'
const TAG = '#'
class View {
  constructor(viewData) {
    this.handlerCreated(viewData)
  }

  handlerCreated(viewData) {
    this.createdBus = new EventBus()
    this.updateBus = new EventBus()
    this.id = viewData.id
    this.title = _.defaultValue(viewData.title, `视图-${this.id}`)
    this.isShow = _.defaultValue(viewData.isShow, true)
    // this.prop = _.defaultValue(viewData.prop, 'defaultProp')
    this.prop = `V${TAG}${this.id}`
    this.viewProp = this.prop
    this.columnData = _.defaultValue(viewData.columnData, [])
    // this.formModel = _.defaultValue(viewData.formModel, {})
    this.initFormModel(viewData.formModel)
    this.viewRuleData = _.defaultValue(viewData.viewRuleData, [])
    this.subViewData = _.defaultValue(viewData.subViewData, [])
    this.initColumns(this.columnData, this)
    this.initColumnMap(this.columns)
    this.initSubView(this.subViewData, this)
    this.initSubViewMap(this.subView)
    this.registerEvent('update', 'clearFormModel', this.clearFormModel())
    this.registerEvent('update', 'disabledView', this.disabledView())
    this.initViewRules(this.viewRuleData, this)
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
    // let formModel = _.mapKeys(formModelData, (value, key) => {
    //   return `C${TAG}${key}`
    // })
    // this.formModel = _.defaultValue(formModel, {})
    this.formModel = _.defaultValue(formModelData, {})
  }

  initSubView(subViewData, view) {
    view.subView = []
    subViewData.forEach(item => {
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
    console.log(this.formModel, path)
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
    _.setObjectValue(this.formModel, path, value)
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

  //清空formModel，只清空字段的值，不处理子视图
  clearFormModel() {
    return () => {
      console.log('clear formModel', this.id, this.formModel)
      for (const key in this.formModel) {
        if (this.formModel.hasOwnProperty(key) && _.includes(key, 'C')) {
          this.formModel[key] = null;
        }
      }
    }
  }

  disabledView() {
    return (status) => {
      this.columns.forEach(column => {
        column.disabled = status
      })
    }
  }
  
  registerEvent(type, eventName, callback) {
    let viewPrefix = `view:${this.id}_`
    let name = eventName
    if (!_.includes(eventName, viewPrefix)) {
      name = viewPrefix + eventName
    }
    let bus = BUSMAP[type]
    if(!bus) {
      console.log(`view---(${type})类型的事件中心不存在，事件注册失败`)
      return
    }
    this[bus].register(name, callback)
    //created注册后立即执行
    if(type === 'created') {
      this.triggerEvent('created', name)
    }
  }

  triggerEvent(type, eventName, ...args) {
    let viewPrefix = `view:${this.id}_`
    let name = eventName
    if (!_.includes(eventName, viewPrefix)) {
      name = viewPrefix + eventName
    }
    let bus = BUSMAP[type]
    if (!bus) {
      console.log(`view---(${type})类型的事件中心不存在，事件触发失败`)
      return
    }
    console.log('view-trigger', type, eventName)
    this[bus].trigger(name, ...args)
  }

  destroy() {
    this.createdBus.destroy()
    this.updateBus.destroy()
  }
}

export default View