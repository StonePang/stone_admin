import Column from './column'
import _ from '~utils/utils'

class View {
  constructor(viewData) {
    this.columnData = _.defaultValue(viewData.columnData, [])
    this.formModel = _.defaultValue(viewData.formModel, {})
    // this.loading = true
    this.init()
  }

  init() {
    this.columns = this.handlerColumns(this.columnData, this)
    this.columnMap = this.handlerColumnMap(this.columns)
  }

  handlerColumns(columnsData, view) {
    let columns = columnsData.map(data => {
      return new Column(data, view);
    });
    return columns
  }

  handlerColumnMap(columns) {
    let map = {}
    columns.forEach(column => {
      let key = column.prop
      let e = map[key]
      if(_.invalid(e)) {
        map[key] = column
      } else {
        console.log(`字段(${key})已经存在于columnMap,不覆盖`)
      }
    })
    return map
  }

  triggerChange(column, value) {
    console.log('view -change', column, value)
  }
}

export default View