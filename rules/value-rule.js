import _ from '~utils/utils'
import date from '~utils/date'

class ValueRule {
  constructor(column) {
    this.column = column
    this.type = column.type
    this.value = column.view.formModel[column.columnProp]
  }

  get typeMap() {
    return {
      input: this.value,
      textarea: this.value,
      select: this.handlerDict(),
      radio: this.handlerDict(),
      checkbox: this.handlerDict(),
      date: this.handlerDate('date'),
      datetime: this.handlerDate('datetime'),
      year: this.handlerDate('year'),
      month: this.handlerDate('month'),
      week: this.handlerDate('week'),
      dates,
      daterange,
      time: this.handlerDate('time'),
      timerange,
    }
  }

  hendler() {
    let value = this.value
    let type = this.type
    if(!this.typeMap[type]) {
      console.log(`显示值处理--->(${type})类型无法处理，返回原值(${value})`)
      return value
    }
    let showValue = this.typeMap[type]
  }

  handlerDict() {
    let value = this.value
    let options = this.column.options
    if (_.invalid(value) || _.isEmptyArray(value)) {
      return ''
    }
    let oneLabel = gua => {
      gua.map((val) => {
        let valueItem = options.find(option => {
          return option.value === val
        })
        if (valueItem) {
          return valueItem.label
        }
        console.log(`字段${this.column}的值(${val})不在options中，显示原值`)
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
      month: `${moment.year}年${moment.month}月`,
      week: `${moment.year}年第${moment.week}周`,
      time: moment.time,
    }
    return map[type]
  }
}

export default ValueRule
