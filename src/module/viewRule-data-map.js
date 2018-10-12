    export default {
    1:{
      id: 21,
      affectItems: [4],
      affectType: 'column',
      type: 'hidden',
      desc: 'datetime隐藏<--input && select',
      conditions: [{
        bindColumn: 1,
        conditionType: 3,
        conditionValue: 'r'
      }, {
        bindColumn: 2,
        conditionType: 3,
        conditionValue: 'value_2'
      }]
    }, 
    2:{
      id: 22,
      affectItems: [3],
      affectType: 'column',
      type: 'disabled',
      isClear: true,
      desc: 'checkbox禁用<--input && select',
      conditions: [{
        bindColumn: 1,
        conditionType: 3,
        conditionValue: '123'
      }, {
        bindColumn: 2,
        conditionType: 3,
        conditionValue: 'value_1'
      }, ],
    }, 
    3:{
      id: 25,
      affectItems: [100],
      affectType: 'subView',
      type: 'disabled',
      isClear: true,
      desc: 'subView隐藏<--input && select',
      conditions: [{
        bindColumn: 1,
        conditionType: 3,
        conditionValue: 'r'
      }, {
        bindColumn: 2,
        conditionType: 3,
        conditionValue: 'value_3'
      }]
    },
    4: {
      id: 222,
      affectItems: [42],
      affectType: 'column',
      type: 'hidden',
      desc: '子表date隐藏<--textarea',
      conditions: [{
        bindColumn: 11,
        conditionType: 3,
        conditionValue: 'r'
      }]
    },
    5: {
      id: 123,
      affectItems: [42],
      affectType: 'column',
      type: 'hidden',
      desc: '子表date隐藏<--input',
      isClear: true,
      conditions: [{
        bindColumn: 1,
        conditionType: 3,
        conditionValue: '321'
      }]
    }
  }
