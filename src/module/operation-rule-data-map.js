export default {
  1: {
    id: 12,
    affectItems: ['subForm'],
    targetViewCode: 'mainForm',
    operationId: 1,
    affectType: 'view',
    type: 'changeRender',
    sort: 1,
    isViewSelf: false,
    isTriggerNow: false,
    isTriggerOnce: false,
    conditionType: 'or',
    changeValue: ['value_3'],
    changeRender: 'table',
    isClear: false,
    isToogle: true,
    desc: 'datetime隐藏<--input && select',
    // customHandler: (view, result) => {
    //   if(result) {
    //     view.triggerEvent('update', 'clearFormModel')
    //   }
    // },
    conditions: [
      {
        bindColumnCode: 'select',
        // bindItemType: 'column',
        targetViewCode: 'mainForm',
        conditionType: 3,
        conditionValue: 'value_1',
        // isClickResultNow: true,
      }
    ]
  },
  2: {
    id: 12,
    affectItems: ['test-3'],
    targetViewCode: 'mainForm-subForm',
    operationId: 2,
    affectType: 'operation',
    type: 'disabled',
    isToogle: true, 
    sort: 2,
    isTriggerNow: false,
    isTriggerOnce: true,
    conditionType: 'or',
    changeValue: ['value_3'],
    changeRender: 'table',
    isClear: false,
    desc: 'datetime隐藏<--input && select',
    // customHandler: (view, result) => {
    //   if(result) {
    //     view.triggerEvent('update', 'clearFormModel')
    //   }
    // },
    conditions: [{
      bindColumnCode: 'textarea',
      bindItemType: 'column',
      targetViewCode: 'mainForm-subForm',
      conditionType: 3,
      conditionValue: 'gua',
      isClickResultNow: true,
    }]
  }
}
