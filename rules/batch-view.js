import View from './view'
import Column from './column'
import TableColumn from './table-column'
import _ from '~utils/utils'
import Operation from './operation';
import EventHandler from './event-handler'
import EventBus from './event-bus'
import ViewRule from './view-rule-new'



const DEVIDE = '-'
const TAG = '#'
class BatchView {
  constructor(viewData, formModelDatas=undefined) {
    this.eventBus = new EventBus()
    this.viewData = viewData
    this.initFormModelData(formModelDatas)
    this.id = viewData.id
    this.formType = _.defaultValue(viewData.formType, 'batchForm')
    this.code = _.defaultValue(viewData.code, this.id)
    this.renderType = _.defaultValue(viewData.renderType, 'form')
    this.title = _.defaultValue(viewData.title, `视图-${this.code}`)
    this.isShow = _.defaultValue(viewData.isShow, true)
    this.disabled = _.defaultValue(viewData.disabled, false)
    this.isDialog = _.defaultValue(viewData.isDialog, false)
    this.prop = `V${TAG}${this.code}`
    this.viewProp = viewData.fatherViewProp ? `${viewData.fatherViewProp}${DEVIDE}${this.prop}` : this.prop

    this.initBatchRowData(viewData)
    this.initBatchRows()
    this.initFormModel()
    
    this.initColumns()
    this.initColumnMap()
    this.initOperations()
    this.initOperationMap()
    // this.initBatchRowData(viewData)
    // this.initBatchRows()
    // this.initFormModel()

    this.initViewRules(this.viewRuleData, this)
    this.initOperationRules(this.operationRuleData, this)

    this.initViewEventHandler()
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
    if (!formModelDatas && !this.formModel) {
      this.formModelData = []
      return
    }
    if (formModelDatas) {
      if (!_.isArray(formModelDatas)) {
        this.formModelData = [formModelDatas]
        return
      }
      this.formModelData = formModelDatas
      return 
    }
    // if (!_.isArray(formModelDatas)) {
    //   this.formModelData = [formModelDatas]
    //   return 
    // }
    if(this.formModel) {
      this.formModelData = this.formModel
      return
    }
    // this.formModelData = formModelDatas
  }

  initColumns() {
    let columns = this.columnData.map(data => {
      return new TableColumn(data, this);
      // return new Column(data, this);
    });
    this.tableColumns = columns
  }

  initColumnMap() {
    let columnMap = {}
    this.tableColumns.forEach(column => {
      columnMap[column.columnProp] = column
    })
    this.columnMap = columnMap
  }

  initOperations() {
    let operations = this.operationData.map(data => {
      return new Operation(data, this)
    })
    this.operations = operations
  }

  initOperationMap() {
    let operationMap = {}
    this.operations.forEach(operation => {
      operationMap[operations.operationProp] = operation
    })
    this.operationMap = operationMap
  }

  initViewRuleData() {
    let viewRuleData = this.viewData.viewRuleData
    let batchViewRuleData = []
    let batchRowRuleData = []
    viewRuleData.forEach(data => {
      let conditionsTargetViewCodes = data.conditions.map(condition => {
        return condition.targetViewCode
      })
      let affectItemsTargetViewCode = data.targetViewCode
      let targetViewCodes = [...conditionsTargetViewCodes, affectItemsTargetViewCode]
      let allInThisBatchView = targetViewCodes.every(targetViewCode => {
        return this.viewRuleTargetViewProp(targetViewCode) === this.viewProp
      })
      if (allInThisBatchView) {
        batchRowRuleData.push(data)
      }else {
        batchViewRuleData.push(data)
      }
    })
    let res = {
      batchRowRuleData,
      batchViewRuleData,
    }
    return res
  }

  //batchRow中没有操作，操作均在batchView中
  //视图条件：影响绑定字段全在本batchView内的，词条视图条件作为batchRow的view的视图条件，不挂在batchView中。此种视图条件只作用于本行
  initBatchRowData() {
    let batchRowData = _.cloneDeep(this.viewData)
    let viewRuleData = this.initViewRuleData()
    batchRowData.formType = 'mainForm'
    batchRowData.formModel = undefined
    batchRowData.operationData = []
    batchRowData.viewRuleData = viewRuleData.batchRowRuleData
    this.batchRowData = batchRowData
    this.viewData.viewRuleData = viewRuleData.batchViewRuleData
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

  insertBatchRow() {
    return (formModelDatas = undefined) => {
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
      this.proxyColumnEventBus()
    }
  }

  //生成视图条件
  initViewRules(viewRuleData, view) {
    let viewRules = viewRuleData.map(data => {
      return new ViewRule(data, view)
    })
    this.viewRules = viewRules
  }

  initOperationRules(operationRuleData, view) {
    let operationRules = operationRuleData.map(data => {
      return new OperationRule(data, view)
    })
    this.operationRules = operationRules
  }

  viewRuleTargetViewProp(targetViewCode) {
    return targetViewCode.split(DEVIDE).map(e => {
      return `V${TAG}${e}`
    }).join(DEVIDE)
  }

  //手动代理字段事件，用于新增batchRow后绑定字段相关事件
  proxyColumnEventBus() {
    this.tableColumns.forEach(tableColumn => {
      let proxyColumns = this.batchRows.map(batchRow => {
        return batchRow.columnMap[tableColumn.columnProp]
      })
      tableColumn.proxyEvent(proxyColumns)
    })
  }

  deleteBatchRow() {
    return (index) => {
      this.formModel.splice(index, 1);
      this.batchRows = this.batchRows.filter((batchRow, i) => {
        return i !== index
      })
    }
  }

  clearFormModel() {
    return () => {
      this.batchRows.forEach(batchView => {
        batchView.triggerEvent('clearFormModel')
      })
    }
  }
  changeRender() {
    return (type) => {
      this.batchRows.forEach(batchView => {
        batchView.triggerEvent('changeRender', type)
      })
    }
  }
  disabledChange() {
    return (status = undefined) => {
      if (_.invalid(status)) {
        status = !this.disabled
        this.disabled = !this.disabled
      }
      this.batchRows.forEach(batchView => {
        batchView.triggerEvent('disabledChange', status)
      })
    }
  }

  initViewEventHandler() {
    let insertBatchRowData = {
      name: `insertBatchRow`,
      sort: 1,
      isSync: true,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    let insertBatchRowHandler = new EventHandler(insertBatchRowData)
    insertBatchRowHandler.addHandler(this.insertBatchRow())
    let deleteBatchRowData = {
      name: `deleteBatchRow`,
      sort: 1,
      isSync: true,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    let deleteBatchRowHandler = new EventHandler(deleteBatchRowData)
    deleteBatchRowHandler.addHandler(this.deleteBatchRow())
    let clearFormModelData = {
      name: `clear`,
      sort: 1,
      isSync: true,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    let clearHandler = new EventHandler(clearFormModelData)
    clearHandler.addHandler(this.clearFormModel())
    let disabledData = {
      name: `disabled`,
      sort: 1,
      isSync: true,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    let disabledHandler = new EventHandler(disabledData)
    disabledHandler.addHandler(this.disabledChange())
    let changeRenderData = {
      name: `changeRender`,
      sort: 1,
      isSync: true,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    let changeRenderHandler = new EventHandler(changeRenderData)
    changeRenderHandler.addHandler(this.changeRender())
    let customData = {
      name: `custom`,
      sort: 1,
      isSync: true,
      isTriggerNow: false,
      isTriggerOnce: false,
    }
    this.customHandler = new EventHandler(customData)

    this.registerEvent('insertBatchRow', insertBatchRowHandler)
    this.registerEvent('deleteBatchRow', deleteBatchRowHandler)
    this.registerEvent('clearFormModel', clearHandler)
    this.registerEvent('disabledChange', disabledHandler)
    this.registerEvent('changeRender', changeRenderHandler)
    this.registerEvent('custom', this.customHandler)
  }

  registerEvent(eventName, eventHandler, ...args) {
    let viewPrefix = `view:${this.code}-`
    let name = eventName
    if (!_.includes(eventName, viewPrefix)) {
      name = viewPrefix + eventName
    }
    this.eventBus.register(name, eventHandler, ...args)
  }

  triggerEvent(eventName, ...args) {
    let viewPrefix = `view:${this.code}-`
    let name = eventName
    if (!_.includes(eventName, viewPrefix)) {
      name = viewPrefix + eventName
    }
    return this.eventBus.trigger(name, ...args)
  }

  destroy() {
    this.eventBus.destroy()
    console.log('eventBus destroy.')
  }

  //暴露给外部的执行自定义时间注册的方法，回调参数是view实例
  addEventListener(type, callback) {
    let typeMap = {
      created: true,
      update: false,
    }
    let customData = {
      name: `custom-${type}`,
      sort: 1,
      isSync: false,
      isTriggerNow: typeMap[type] || false,
      isTriggerOnce: typeMap[type] || false,
    }
    let customHandler = new EventHandler(customData)
    //将函数添加到eventHandler对象中
    customHandler.addHandler(() => {
      callback(this)
    })
    this.customHandler.addHandler(customHandler)
  }

}

export default BatchView