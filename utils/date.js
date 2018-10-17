import momentService from 'moment'

class Moment {
  unix(moment) {
    return moment.unix() * 1000
  }
  date(moment, devider) {
    return moment.format(`YYYY${devider}MM${devider}DD`)
  }
  Date(moment) {
    return moment.toDate()
  }
  dateTime(moment, devider) {
    return moment.format(`YYYY${devider}MM${devider}DD HH:mm`)
  }
  year(moment) {
    return moment.format(`YYYY`)
  }
  month(moment) {
    return moment.format(`MM`)
  }
  yearMonth(moment, devider) {
    return moment.format(`YYYY${devider}MM`)
  }
  dateTimeAll(moment, devider) {
    return moment.format(`YYYY${devider}MM${devider}DD HH:mm:ss`)
  }
  time(moment) {
    return moment.format('HH:mm:ss')
  }
  week(moment) {
    return moment.week()
  }
  now(devider = '-') {
    let now = momentService()
    return {
      unix: this.unix(now),
      date: this.date(now, devider),
      Date: this.Date(now),
      dateTime: this.dateTime(now, devider),
      time: this.time(now),
      year: this.year(now),
      month: this.month(now),
      yearMonth: this.yearMonth(now, devider),
      week: this.week(now),
      dateTimeAll: this.dateTimeAll(now, devider),
    }
  }
  moment(date, devider = '-') {
    //null,'', 不能转换成时间对象,直接返回为null
    if(date === null || date === '') {
      return {
        unix: null,
        date: null,
        Date: null,
        dateTime: null,
        time: null,
        year: null,
        month: null,
        yearMonth: null,
        week: null,
        dateTimeAll: null,
      }
    }
    let dateObj = momentService(date)
    return {
      unix: this.unix(dateObj),
      date: this.date(dateObj, devider),
      Date: this.Date(dateObj),
      dateTime: this.dateTime(dateObj, devider),
      time: this.time(dateObj),
      year: this.year(dateObj),
      month: this.month(dateObj),
      yearMonth: this.yearMonth(dateObj, devider),
      week: this.week(dateObj),
      dateTimeAll: this.dateTimeAll(dateObj, devider),
    }
  }
}

/**
 * unix: 时间戳,
  date: 年月日,
  Date: Date对象,
  dateTime: 年月日时分,
  time: 时分秒
  year: 年,
  yearMonth: 年月,
  week: 周,
  dateTimeAll: 年月日时分秒,
 */

export default new Moment()