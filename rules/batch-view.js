import View from './view'
import Column from './column'
import _ from '~utils/utils'


const DEVIDE = '-'
const TAG = '#'
class BatchView {
  constructor(viewData, formModelDatas) {
    // this.eventBus = new EventBus()
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
    this.subViewData = _.defaultValue(viewData.subViewData, [])
    this.viewProp = viewData.fatherViewProp ? `${viewData.fatherViewProp}${DEVIDE}${this.prop}` : this.prop

    // this.initColumns(viewData.columnData, this)
    this.initBatchRows(viewData, formModelDatas)
  }

  // get columnData() {
  //   return _.defaultValue(this.viewData.columnData, [])
  // }

  // get viewRuleData() {
  //   return _.defaultValue(this.viewData.viewRuleData, [])
  // }

  // get subViewData() {
  //   return _.defaultValue(this.viewData.subViewData, [])
  // }

  // get operationData() {
  //   return _.defaultValue(this.viewData.operationData, [])
  // }

  // get operationRuleData() {
  //   return _.defaultValue(this.viewData.operationRuleData, [])
  // }


  initColumns(columnsData, view) {
    let columns = columnsData.map(data => {
      return new Column(data, view);
    });
    this.columns = columns
  }

  initBatchRows(viewData, formModelDatas) {
    let batchRows = formModelDatas.map(formModelData => {
      return new View(viewData, formModelData)
    })
    this.batchRows = batchRows
  }
}

export default BatchView