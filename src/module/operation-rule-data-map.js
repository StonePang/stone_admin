export default {
  1: {
    id: 12,
    affectItems: [2],
    targetViewId: '1',
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
        bindItem: 2,
        bindItemType: 'column',
        targetViewId: '1',
        conditionType: 3,
        conditionValue: 'value_1',
        isClickResultNow: true,
      }
    ]
  }
}
