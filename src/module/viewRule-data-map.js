    export default {
    1:{
      id: 21,
      desc: '对mainForm的测试',
      disabled: false,
      type: 'changeType',
      affectType: 'column',
      conditionType: 'OR',
      affectItems: ['textarea'],
      targetViewCode: 'mainForm-subForm',
      isViewSelf: false,
      sort: 1,
      isTriggerNow: true,
      isTriggerOnce: false,
      changeValue: ['value_3'],
      changeType: 'input',
      changeRender: 'table',
      isClear: false,
      isToogle: false,
      // customHandler: (affectItems, result) => {
      //   console.log('affectItems, result', affectItems, result)
      // },
      conditions: [
        {
          bindColumnCode: 'input',
          targetViewCode: 'mainForm',
          conditionType: 3,
          conditionValue: '1',
          conditionMethod: 'AND',
      },
      {
        bindColumnCode: 'select',
        targetViewCode: 'mainForm-batchForm',
        conditionType: 3,
        conditionValue: 'value_2',
        conditionMethod: 'AND',
      }
    ]
    }, 
    2:{
      id: 22,
      desc: '对batchForm的测试',
      disabled: false,
      type: 'disabled',
      affectType: 'column',
      conditionType: 'OR',
      affectItems: ['date'],
      targetViewCode: 'mainForm-subForm',
      isViewSelf: false,
      sort: 1,
      isTriggerNow: true,
      isTriggerOnce: false,
      changeValue: ['value_3'],
      // changeValue: 'new value',
      changeRender: 'table',
      isClear: false,
      isToogle: false,
      // customHandler: (affectItems, result) => {
      //   console.log('affectItems, result', affectItems, result)
      // },
      conditions: [{
          bindColumnCode: 'textarea',
          targetViewCode: 'mainForm-subForm',
          conditionType: 3,
          conditionValue: '1',
          conditionMethod: 'AND',
        },
        // {
        //   bindColumnCode: 'select',
        //   targetViewCode: 'mainForm-batchForm',
        //   conditionType: 3,
        //   conditionValue: 'value_2',
        //   conditionMethod: 'AND',
        // }
      ]
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
