import momentService from 'moment'

class Moment {
  unix(moment) {
    return moment.unix() * 1000
  }
  date(moment, devider) {
    return moment.format(`YYYY${devider}MM${devider}DD`)
  }
  dateTime(moment, devider) {
    return moment.format(`YYYY${devider}MM${devider}DD HH:mm`)
  }
  year(moment) {
    return moment.format(`YYYY`)
  }
  yearMonth(moment, devider) {
    return moment.format(`YYYY${devider}MM`)
  }
  dateTimeAll(moment, devider) {
    return moment.format(`YYYY${devider}MM${devider}DD HH:mm:ss`)
  }
  week(moment) {
    return moment.week()
  }
  now(devider = '/') {
    let now = momentService()
    return {
      unix: this.unix(now),
      date: this.date(now, devider),
      dateTime: this.dateTime(now, devider),
      year: this.year(now),
      yearMonth: this.yearMonth(now, devider),
      week: this.week(now),
      dateTimeAll: this.dateTimeAll(now, devider),
    }
  }
  moment(date, devider = '/') {
    let dateObj = momentService(date)
    return {
      unix: this.unix(dateObj),
      date: this.date(dateObj, devider),
      dateTime: this.dateTime(dateObj, devider),
      year: this.year(dateObj),
      yearMonth: this.yearMonth(dateObj, devider),
      week: this.week(dateObj),
      dateTimeAll: this.dateTimeAll(dateObj, devider),
    }
  }
}

export default new Moment()