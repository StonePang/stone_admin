import Column from './column'
import ViewRule from './view-rule'
import EventBus from './event-bus'
import _ from '~utils/utils'

const BUSMAP = {
  created: 'createdBus',
  update: 'updateBus'
}

class View {
  constructor(viewData) {
    this.handlerCreated(viewData)
  }

  handlerCreated(viewData) {
    this.createdBus = new EventBus()
    this.updateBus = new EventBus()
    this.id = viewData.id
    this.isShow = _.defaultValue(viewData.isShow, true)
    this.prop = _.defaultValue(viewData.prop, 'defaultProp')
    this.columnData = _.defaultValue(viewData.columnData, [])
    this.formModel = _.defaultValue(viewData.formModel, {})
    this.viewRuleData = _.defaultValue(viewData.viewRuleData, [])
    this.subViewData = _.defaultValue(viewData.subViewData, [])
    this.initColumns(this.columnData, this)
    this.initColumnMap(this.columns)
    this.initViewRules(this.viewRuleData, this)
    this.initSubForm(this.subViewData, this)
    // for (const eventName in this.createdBus.eventBus) {
    //   this.trigger('created', eventName)
    // }
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
      let key = column.id
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

  initSubForm(subViewData, view) {
    view.subView = []
    subViewData.forEach(item => {
      let subView = new View(item)
      view.subView.push(subView)
      let subFormModel = subView.formModel
      let prop = subView.prop
      if(_.invalid(view.formModel[prop])) {
        view.formModel[prop] = subFormModel
      } else {
        console.log(`subView--->(${subView.id})的prop与上级view的formModel中prop重合，subFormModel挂载失败`)
      }
    })
    // view.subView = subViews
    // view.formModel[subView.]
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