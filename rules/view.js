import Column from './column'
import ViewRule from './view-rule'
import _ from '~utils/utils'

class View {
  constructor(viewData) {
    this.columnData = _.defaultValue(viewData.columnData, [])
    this.formModel = _.defaultValue(viewData.formModel, {})
    this.viewRuleData = _.defaultValue(viewData.viewRuleData, [])
    // this.loading = true
    this.init()
  }

  init() {
    this.columns = this.initColumns(this.columnData, this)
    this.columnMap = this.initColumnMap(this.columns)
    this.viewRules = this.initViewRules(this.viewRuleData, this)
  }

  initColumns(columnsData, view) {
    let columns = columnsData.map(data => {
      return new Column(data, view);
    });
    return columns
  }

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
    return map
  }

  initViewRules(viewRuleData, view) {
    return viewRuleData.map(data => {
      return new ViewRule(data, view)
    })
  }

  //change字段在viewRule中的bindColumns中时，才执行相应handler
  handlerViewRule(column) {
    let columnId = column.id
    this.viewRules.forEach(viewRule => {
      let bindColumns = viewRule.bindColumns
      if (_.includes(bindColumns, columnId)) {
        viewRule.handler()
      }
    })
  }
  triggerChange(column, value) {
    console.log('view -change', column, value)
    this.handlerViewRule(column)
  }
}

export default View