import View from './view'
import Column from './column'
import TableColumn from './table-column'
import _ from '~utils/utils'
import Operation from './operation';


const DEVIDE = '-'
const TAG = '#'
class BatchView {
  constructor(viewData, formModelDatas=undefined) {
    // this.eventBus = new EventBus()
    this.viewData = viewData
    this.initFormModelData(formModelDatas)
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

    // this.initColumns(viewData.columnData, this)
    // this.initOperations(viewData.operationData, this)
    this.initColumns()
    this.initOperations()
    this.initBatchRowData(viewData)
    this.initBatchRows()
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

  initFormModelData(formModelDatas) {
    if (!formModelDatas) {
      this.formModelData = []
      return
    }
    if (!_.isArray(formModelDatas)) {
      this.formModelData = [formModelDatas]
      return 
    }
    this.formModelData = formModelDatas
  }

  initColumns() {
    let columns = this.columnData.map(data => {
      return new TableColumn(data, this);
    });
    this.tableColumns = columns
  }

  initOperations() {
    let operations = this.operationData.map(data => {
      return new Operation(data, this)
    })
    this.operations = operations
  }

  //batchRow中没有操作，操作均在batchView中
  initBatchRowData() {
    let batchRowData = _.cloneDeep(this.viewData)
    batchRowData.operationData = []
    this.batchRowData = batchRowData
  }

  initBatchRows() {
    let batchRows = this.formModelData.map(formModelData => {
      return new View(this.batchRowData, formModelData)
    })
    this.batchRows = batchRows
  }

  initFormModel() {
    let formModel = this.batchRows.map(batchRow => {
      return batchRow.formModel
    })
    this.formModel = formModel
  }

  insertBatchRow(formModelDatas = undefined) {
    if (!formModelDatas) {
      formModelDatas = {}
      this.tableColumns.forEach(column => {
        let key = column.code
        formModelDatas[key] = null
      })
    }
    if (!_.isArray(formModelDatas)) {
      formModelDatas = [formModelDatas]
    }
    formModelDatas.forEach(formModelData => {
      let batchRow = new View(this.batchRowData, formModelData)
      this.batchRows.push(batchRow)
      this.formModel.push(batchRow.formModel);
    })
    // let batchRow = new View(this.viewData, formModel)
    // this.batchRows.push(batchRow)
    // this.formModel.push(batchRow.formModel);
  }

  deleteBatchRow(index) {
    this.formModel.splice(index, 1);
    this.batchRows = this.batchRows.filter((batchRow, i) => {
      return i !==index
    })
  }

  clearFormModel() {
    // return () => {
      console.log(this)
      this.batchRows.forEach(batchView => {
        batchView.triggerEvent('clearFormModel')
      })
    // }
  }
  changeRender(type) {
    // return (type) => {
      this.batchRows.forEach(batchView => {
        batchView.triggerEvent('changeRender', type)
      })
    // }
  }
  disabledChange(status) {
    // return () => {
      this.batchRows.forEach(batchView => {
        batchView.triggerEvent('disabledChange', status)
      })
    // }
  }

}

export default BatchView