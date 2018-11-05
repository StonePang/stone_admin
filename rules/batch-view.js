import View from './view'
import Column from './column'
import TableColumn from './table-column'
import _ from '~utils/utils'


const DEVIDE = '-'
const TAG = '#'
class BatchView {
  constructor(viewData, formModelDatas) {
    // this.eventBus = new EventBus()
    this.viewData = viewData
    this.viewData = viewData
    this.id = viewData.id
    this.formType = _.defaultValue(viewData.formType, 'form')
    this.code = _.defaultValue(viewData.code, this.id)
    this.renderType = _.defaultValue(viewData.renderType, 'form')
    this.title = _.defaultValue(viewData.title, `视图-${this.code}`)
    this.isShow = _.defaultValue(viewData.isShow, true)
    this.disabled = _.defaultValue(viewData.disabled, false)
    this.isDialog = _.defaultValue(viewData.isDialog, false)
    this.prop = `V${TAG}${this.code}`
    this.viewProp = viewData.fatherViewProp ? `${viewData.fatherViewProp}${DEVIDE}${this.prop}` : this.prop

    this.initColumns(viewData.columnData, this)
    this.initBatchRows(viewData, formModelDatas)
    this.initFormModel()
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

  get operationRuleData() {
    return _.defaultValue(this.viewData.operationRuleData, [])
  }


  initColumns(columnsData, view) {
    let columns = columnsData.map(data => {
      return new TableColumn(data, view);
    });
    this.tableColumns = columns
  }

  initBatchRows(viewData, formModelDatas) {
    let batchRows = formModelDatas.map(formModelData => {
      return new View(viewData, formModelData)
    })
    this.batchRows = batchRows
  }

  initFormModel() {
    let formModel = this.batchRows.map(batchRow => {
      return batchRow.formModel
    })
    this.formModel = formModel
  }
}

export default BatchView