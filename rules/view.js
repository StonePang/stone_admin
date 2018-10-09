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
    this.columnData = _.defaultValue(viewData.columnData, [])
    this.formModel = _.defaultValue(viewData.formModel, {})
    this.viewRuleData = _.defaultValue(viewData.viewRuleData, [])
    this.initColumns(this.columnData, this)
    this.initColumnMap(this.columns)
    this.initViewRules(this.viewRuleData, this)
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
    this.eventBus.destroy()
  }

  // handlerColumn(type, eventName, value) {
  //   console.log('view---handlerColumn', type, eventName, value)
  //   if(type !== 'created' && type !== 'update') {
  //     console.log(`view---(${type})类型的字段事件不存在`)
  //     return
  //   }
  //   this.triggerEvent(type, eventName)
  // }
}

export default View