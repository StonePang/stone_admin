export default {
  showMultiple: {
    id: 1,
    sort: 1,
    type: 'show',
    affectType: 'column',
    conditionType: 'OR',
    affectItems: ['multiple'],
    targetViewCode: 'column',
    isViewSelf: false,
    desabled: false,
    desc: 'select/checkbox类型时显示是否多选',
    isTriggerNow: true,
    isTriggerOnce: false,
    changeValue: null,
    changeType: null,
    changeRender: null,
    isClear: false,
    isToogle: false,
    customHandler: null,
    conditions: [{
      bindColumnCode: 'type',
      targetViewCode: 'column',
      conditionType: 3,
      conditionValue: 'select',
      conditionMethod: 'AND',
    }, {
      bindColumnCode: 'type',
      targetViewCode: 'column',
      conditionType: 3,
      conditionValue: 'checkbox',
      conditionMethod: 'AND',
    }]
  },
  showFilterable: {
    id: 2,
    sort: 2,
    type: 'show',
    affectType: 'column',
    conditionType: 'OR',
    affectItems: ['filterable'],
    targetViewCode: 'column',
    isViewSelf: false,
    desabled: false,
    desc: 'select类型时显示是否可搜索',
    isTriggerNow: true,
    isTriggerOnce: false,
    changeValue: null,
    changeType: null,
    changeRender: null,
    isClear: false,
    isToogle: false,
    customHandler: null,
    conditions: [{
      bindColumnCode: 'type',
      targetViewCode: 'column',
      conditionType: 3,
      conditionValue: 'select',
      conditionMethod: 'AND',
    }]
  },
  showChooseAll: {
    id: 3,
    sort: 3,
    type: 'show',
    affectType: 'column',
    conditionType: 'OR',
    affectItems: ['showChooseAll'],
    targetViewCode: 'column',
    isViewSelf: false,
    desabled: false,
    desc: 'checkbox类型时显示是否显示全选',
    isTriggerNow: true,
    isTriggerOnce: false,
    changeValue: null,
    changeType: null,
    changeRender: null,
    isClear: false,
    isToogle: false,
    customHandler: null,
    conditions: [{
      bindColumnCode: 'type',
      targetViewCode: 'column',
      conditionType: 3,
      conditionValue: 'checkbox',
      conditionMethod: 'AND',
    }]
  },
  showOptions: {
    id: 4,
    sort: 4,
    type: 'show',
    affectType: 'view',
    conditionType: 'OR',
    affectItems: ['options'],
    targetViewCode: 'column',
    isViewSelf: false,
    desabled: false,
    desc: 'select/checkbox/radio类型时显示options配置批量表',
    isTriggerNow: true,
    isTriggerOnce: false,
    changeValue: null,
    changeType: null,
    changeRender: null,
    isClear: false,
    isToogle: false,
    customHandler: null,
    conditions: [{
      bindColumnCode: 'type',
      targetViewCode: 'column',
      conditionType: 3,
      conditionValue: 'select',
      conditionMethod: 'AND',
    }, {
      bindColumnCode: 'type',
      targetViewCode: 'column',
      conditionType: 3,
      conditionValue: 'checkbox',
      conditionMethod: 'AND',
    }, {
      bindColumnCode: 'type',
      targetViewCode: 'column',
      conditionType: 3,
      conditionValue: 'radio',
      conditionMethod: 'AND',
    }]
  },
  showStartAndEnd: {
    id: 5,
    sort: 5,
    type: 'show',
    affectType: 'column',
    conditionType: 'OR',
    affectItems: ['start', 'end'],
    targetViewCode: 'column',
    isViewSelf: false,
    desabled: false,
    desc: '时间类型时显示时间选择起止范围设置',
    isTriggerNow: true,
    isTriggerOnce: false,
    changeValue: null,
    changeType: null,
    changeRender: null,
    isClear: false,
    isToogle: false,
    customHandler: null,
    conditions: [{
      bindColumnCode: 'type',
      targetViewCode: 'column',
      // conditionType: 3,
      // conditionValue: 'select',
      // conditionMethod: 'AND',
      customCondition: (columnValue, bindColumn, view) => {
        let dateType = ['date', 'datetime', 'year', 'month', 'week', 'dates', 'daterange', 'time', 'timerange']
        let result = dateType.includes(columnValue[0])
        return Promise.resolve(result)
      }
    }]
  },
  changeDefaultValueType: {
    id: 6,
    sort: 6,
    type: 'changeType',
    affectType: 'column',
    conditionType: 'OR',
    affectItems: ['defaultValue'],
    targetViewCode: 'column',
    isViewSelf: false,
    desabled: false,
    desc: '根据字段类型改变默认值输入框的类型',
    isTriggerNow: true,
    isTriggerOnce: false,
    changeValue: null,
    changeType: null,
    changeRender: null,
    isClear: false,
    isToogle: false,
    customHandler: (affectItems, result, bindColumnValues) => {
      let type = result ? bindColumnValues[0][0] : 'input'
      affectItems.forEach(column => {
        column.changeColumnValue(null)
        column.type = type
      })
    },
    conditions: [{
      bindColumnCode: 'type',
      targetViewCode: 'column',
      conditionType: 6,
      conditionValue: null,
      conditionMethod: 'AND',
    }]
  },
  changeStartAndEndType: {
    id: 7,
    sort: 7,
    type: 'changeType',
    affectType: 'column',
    conditionType: 'OR',
    affectItems: ['start', 'end'],
    targetViewCode: 'column',
    isViewSelf: false,
    desabled: false,
    desc: '根据字段类型改变起始时间输入框的类型',
    isTriggerNow: true,
    isTriggerOnce: false,
    changeValue: null,
    changeType: null,
    changeRender: null,
    isClear: false,
    isToogle: false,
    customHandler: (affectItems, result, bindColumnValues) => {
      if(!result) {
        return 
      }
      let type = bindColumnValues[0][0] 
      affectItems.forEach(column => {
        column.changeColumnValue(null)
        column.type = type
      })
    },
    conditions: [{
      bindColumnCode: 'type',
      targetViewCode: 'column',
      // conditionType: 6,
      // conditionValue: null,
      // conditionMethod: 'AND',
      customCondition: (columnValue, bindColumn, view) => {
        let dateType = ['date', 'datetime', 'year', 'month', 'week', 'dates', 'daterange', 'time', 'timerange']
        let result = dateType.includes(columnValue[0])
        return Promise.resolve(result)
      }
    }]
  },

}
