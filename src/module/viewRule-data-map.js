    export default {
    1:{
      id: 21,
      affectItems: ['checkbox'],
      // targetViewCode: 'mainForm',
      targetViewCode: 'batchForm',
      affectType: 'column',
      type: 'disabled',
      sort: 1,
      disabled: false,
      isTriggerNow: true,
      isTriggerOnce: false,
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
      //   {
      //   bindColumnCode: 1,
      //   targetViewCode: '1',
      //   conditionType: 3,
      //   conditionValue: '123',
      //   // customCondition: view => {
      //   //   let value = view.formModel[view.columns[0].columnProp]
      //   //   let result = value === '21'
      //   //   return Promise.resolve(result)
      //   // }
      // },
      {
        bindColumnCode: 'select',
        bindItemType: 'column',
        // targetViewCode: 'mainForm',
        targetViewCode: 'batchForm',
        conditionType: 3,
        conditionValue: 'value_2',
        isClickResultNow: true,
      }
    ]
    }, 
    2:{
      id: 22,
      affectItems: ['input'],
      affectType: 'column',
      targetViewCode: 'batchForm',
      isClear: true,
      sort: 2,
      isTriggerNow: true,
      isTriggerOnce: false,
      type: 'disabled',
      isClear: false,
      desc: 'checkbox禁用<--input && select',
      conditions: [{
        targetViewCode: 'batchForm',
        bindColumnCode: 'select',
        conditionType: 3,
        conditionValue: 'value_1'
      }],
    }, 
    3:{
      id: 25,
      affectItems: ['subForm'],
      affectType: 'subView',
      targetViewCode: 'mainForm',
      conditionType: 'OR',
      type: 'clear',
      isClear: false,
      desc: 'subView<--input && select',
      conditions: [{
        targetViewCode: 'mainForm',
        bindColumnCode: 'input',
        conditionType: 3,
        conditionValue: 'r'
      }, {
        targetViewCode: 'mainForm',
        bindColumnCode: 'select',
        conditionType: 3,
        conditionValue: 'value_3'
      }]
    },
    4: {
      id: 222,
      affectItems: ['date'],
      affectType: 'column',
      isClear: true,
      targetViewCode: 'subForm',
      type: 'hidden',
      desc: '子表date隐藏<--textarea',
      conditions: [{
        targetViewCode: 'subForm',
        bindColumnCode: 'textarea',
        conditionType: 3,
        conditionValue: 'r'
      }]
    },
    5: {
      id: 123,
      affectItems: ['date', 'textarea'],
      affectType: 'column',
      targetViewCode: 'subForm',
      isClear: true,
      type: 'hidden',
      desc: '子表date隐藏<--input',
      isClear: true,
      conditions: [{
        targetViewCode: 'mainForm',
        bindColumnCode: 'input',
        conditionType: 3,
        conditionValue: '321'
      }]
    },
    6: {
      id: 124,
      affectItems: ['textarea'],
      affectType: 'column',
      targetViewCode: 'subForm',
      isClear: true,
      type: 'disabled',
      desc: '6->子表date隐藏<--input,主表中做子表视图条件',
      isClear: true,
      conditions: [{
        targetViewCode: 'subForm',
        bindColumnCode: 'textarea',
        conditionType: 3,
        conditionValue: '6'
      }]
    },
    7: {
      id: 125,
      affectItems: ['input'],
      affectType: 'column',
      targetViewCode: 'mainForm',
      isClear: true,
      type: 'disabled',
      desc: '7->date-->input,子表的视图条件，影响主表.不能执行',
      isClear: true,
      conditions: [{
        targetViewCode: 'subForm',
        bindColumnCode: 'textarea',
        conditionType: 3,
        conditionValue: '7'
      }]
    },
    8: {
      id: 29,
      affectItems: ['input'],
      targetViewCode: 'mainForm',
      affectType: 'column',
      type: 'changeValue',
      changeValue: 'test',
      isClear: false,
      desc: 'datetime隐藏<--input && select',
      conditions: [{
        bindColumnCode: 'select',
        targetViewCode: 'mainForm',
        conditionType: 3,
        conditionValue: 'value_3'
      }]
    },

  }
