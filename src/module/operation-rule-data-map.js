export default {
  1: {
    id: 12,
    affectItems: ['subForm'],
    targetViewCode: 'mainForm',
    operationId: 1,
    affectType: 'subView',
    type: 'disabled',
    sort: 1,
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
    conditions: [
      {
        bindColumnCode: 'select',
        bindItemType: 'column',
        targetViewCode: 'mainForm',
        conditionType: 3,
        conditionValue: 'value_1',
        isClickResultNow: true,
      }
    ]
  },
  2: {
    id: 12,
    affectItems: ['subForm'],
    targetViewCode: 'mainForm',
    operationId: 2,
    affectType: 'subView',
    type: 'changeRender',
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
