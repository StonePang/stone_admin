import columnDataMap from './column-data-map'
import viewRuleDataMap from './viewRule-data-map'
export default {
  id: 1,
  isShow: true,
  title: '主表',
  prop: 'form',
  columnData: [
    columnDataMap.input,
    columnDataMap.select,
    columnDataMap.checkbox,
    columnDataMap.datetime,
  ],
  viewRuleData: [
    // viewRuleDataMap['1'],
    // viewRuleDataMap['2'],
    viewRuleDataMap['3'],
    // viewRuleDataMap['5'],
    // viewRuleDataMap['6'],
    // viewRuleDataMap['8'],
  ],
  formModel: {
    // 'V:1': {
      'V#1-C#1': 'r',
      'V#1-C#2': 'gua',
      'V#1-C#3': ['value_1', 'gua_2'],
      'V#1-C#4': null,
    // }
  },
  subViewData: [{
    id: 2,
    title: '子表',
    isShow: true,
    prop: 'subForm',
    columnData: [
      columnDataMap.textarea,
      columnDataMap.date,
    ],
    viewRuleData: [
      // viewRuleDataMap['4'],
      // viewRuleDataMap['7'],
    ],
    formModel: {
      'V#1-V#2-C#11': 'gua',
      'V#1-V#2-C#42': null,
      // 'V#2-C#11': 'gua',
      // 'V#2-C#42': null,
    }
  }]
}
