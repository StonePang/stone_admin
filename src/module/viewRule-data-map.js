    export default {
    1:{
      id: 21,
      affectItems: [1],
      targetViewId: '1',
      affectType: 'operation',
      type: 'disabled',
      conditionType: 'OR',
      changeValue: ['value_3'],
      changeRender: 'table',
      isClear: true,
      desc: 'datetime隐藏<--input && select',
      // customHandler: (view, result) => {
      //   if(result) {
      //     view.triggerEvent('update', 'clearFormModel')
      //   }
      // },
      conditions: [{
        bindColumn: 1,
        targetViewId: '1',
        conditionType: 3,
        conditionValue: '123',
        customCondition: view => {
          // console.log(view)
          let value = view.formModel[view.columns[0].columnProp]
          let result = value === '21'
          return Promise.resolve(result)
        }
      },
      {
        bindColumn: 2,
        targetViewId: '1',
        conditionType: 3,
        conditionValue: 'value_2'
      }
    ]
    }, 
    2:{
      id: 22,
      affectItems: [3],
      affectType: 'column',
      targetViewId: '1',
      isClear: true,
      type: 'disabled',
      isClear: true,
      desc: 'checkbox禁用<--input && select',
      conditions: [{
        targetViewId: '1',
        bindColumn: 1,
        conditionType: 3,
        conditionValue: '123'
      }, {
        targetViewId: '1',
        bindColumn: 2,
        conditionType: 3,
        conditionValue: 'value_1'
      }, ],
    }, 
    3:{
      id: 25,
      affectItems: [2],
      affectType: 'subView',
      targetViewId: '1',
      conditionType: 'OR',
      type: 'clear',
      isClear: false,
      desc: 'subView<--input && select',
      conditions: [{
        targetViewId: '1',
        bindColumn: 1,
        conditionType: 3,
        conditionValue: 'r'
      }, {
        targetViewId: '1',
        bindColumn: 2,
        conditionType: 3,
        conditionValue: 'value_3'
      }]
    },
    4: {
      id: 222,
      affectItems: [42],
      affectType: 'column',
      isClear: true,
      targetViewId: '1-2',
      type: 'hidden',
      desc: '子表date隐藏<--textarea',
      conditions: [{
        targetViewId: '1-2',
        bindColumn: 11,
        conditionType: 3,
        conditionValue: 'r'
      }]
    },
    5: {
      id: 123,
      affectItems: [42, 11],
      affectType: 'column',
      targetViewId: '1-2',
      isClear: true,
      type: 'hidden',
      desc: '子表date隐藏<--input',
      isClear: true,
      conditions: [{
        targetViewId: '1',
        bindColumn: 1,
        conditionType: 3,
        conditionValue: '321'
      }]
    },
    6: {
      id: 124,
      affectItems: [42],
      affectType: 'column',
      targetViewId: '1-2',
      isClear: true,
      type: 'disabled',
      desc: '6->子表date隐藏<--input,主表中做子表视图条件',
      isClear: true,
      conditions: [{
        targetViewId: '1-2',
        bindColumn: 11,
        conditionType: 3,
        conditionValue: '6'
      }]
    },
    7: {
      id: 125,
      affectItems: [1],
      affectType: 'column',
      targetViewId: '1',
      isClear: true,
      type: 'disabled',
      desc: '7->date-->input,子表的视图条件，影响主表.不能执行',
      isClear: true,
      conditions: [{
        targetViewId: '1-2',
        bindColumn: 11,
        conditionType: 3,
        conditionValue: '7'
      }]
    },
    8: {
      id: 29,
      affectItems: [1],
      targetViewId: '1',
      affectType: 'column',
      type: 'changeValue',
      changeValue: 'test',
      isClear: false,
      desc: 'datetime隐藏<--input && select',
      conditions: [{
        bindColumn: 2,
        targetViewId: '1',
        conditionType: 3,
        conditionValue: 'value_3'
      }]
    },

  }
