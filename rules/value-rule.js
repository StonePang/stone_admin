import _ from '~utils/utils'
import date from '~utils/date'
import EventHandler from './event-handler'

class ValueRule {
  constructor(column) {
    this.column = column
    this.initEventHandler()
    // this.registerEvent('created')
    // this.registerEvent('update')
    this.registerEvent()
  }

  get type() {
    return this.column.type
  }

  get value() {
    return this.column.view.formModel[this.column.columnProp]
  }

  get typeMap() {
    return {
      input: this.handlerInput.bind(this),
      textarea: this.handlerInput.bind(this),
      select: this.handlerDict.bind(this),
      radio: this.handlerDict.bind(this),
      checkbox: this.handlerDict.bind(this),
      date: this.handlerDate.bind(this),
      datetime: this.handlerDate.bind(this),
      year: this.handlerDate.bind(this),
      month: this.handlerDate.bind(this),
      week: this.handlerDate.bind(this),
      dates: this.handlerDates.bind(this),
      daterange: this.handlerDates.bind(this),
      time: this.handlerDate.bind(this),
      timerange: this.handlerDates.bind(this),
    }
  }

  get busType() {
    return {
      created: true,
      update: false,
    }
  }

  initEventHandler() {
    let data = {
      name: `value-rule:${this.column.id}`,
      sort: 1,
      isSync: true,
      isTriggerNow: true,
      isTriggerOnce: false
    }
    this.eventHandler = new EventHandler(data)
    this.eventHandler.addHandler(this.handler())
  }

  handler() {
    return () => {
      console.log('value-rule handler', this.value, this.type)
      let value = this.value
      let type = this.type
      let showValue = ''
      if (!this.typeMap[type]) {
        console.warn(`显示值处理--->(${type})类型无法处理，返回原值(${value})`)
        showValue = value
      }else if (_.invalid(value) || _.isEmptyArray(value)) {
        showValue = ''
      }else {
        showValue = this.typeMap[type](type)
      }
      this.showValue = showValue
      this.column.showValue = this.showValue
      console.log(`value-rule处理事件执行-->>(${this.column.columnProp}):(${this.column.showValue})`)
    }
  }

  handlerInput() {
    return this.value
  }

  handlerDict() {
    let value = this.value
    let options = this.column.options
    let oneLabel = gua => {
      if(!_.isArray(gua)) {
        gua = [gua]
      }
      return gua.map((val) => {
        let valueItem = options.find(option => {
          return option.value === val
        })
        if (valueItem) {
          return valueItem.label
        }
        console.log(`字段${this.column.id}的值(${val})不在options中，显示原值`)
        return val
      })
    }
    if(_.isArray(value)) {
      let showValue = this.value.map((val) => {
        return oneLabel(val)
      })
      return showValue.join(',')
    }
    let showValue = oneLabel(value)
    return showValue.join(',')
  }

  handlerDate(type) {
    let moment = date.moment(this.value)
    let map = {
      date: moment.date,
      datetime: moment.dateTime,
      year: moment.year + '年',
      month: `${moment.year}-${moment.month}`,
      week: `${moment.year}年第${moment.week}周`,
      time: moment.time,
    }
    return map[type]
  }

  handlerDates(type) {
    let devideMap = {
      dates: ',',
      daterange: '至',
      timerange: '至'
    }
    let devide = devideMap[type]
    let result = this.value.map(val => {
      if(_.invalid(val)) {
        return ''
      }
      let moment = date.moment(val)
      let dateMap = {
        dates: moment.date,
        daterange: moment.date,
        timerange: moment.time,
      }
      return dateMap[type]
    }).join(devide)
    return result
  }

  registerEvent() {
    // this.eventHandler.addHandler(this.handler)
    // console.log('this.eventHandler', this.eventHandler)
    this.column.registerEvent(`value-rule`, this.eventHandler)
  }
}

export default ValueRule
