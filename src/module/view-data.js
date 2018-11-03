import columnDataMap from './column-data-map'
import viewRuleDataMap from './viewRule-data-map'
import operationdataMap from './operation-data-map'
import operationRuleDataMap from './operation-rule-data-map'
export default {
  id: 1,
  isShow: true,
  title: '主表',
  code: 'mainForm',
  columnData: [
    columnDataMap.input,
    columnDataMap.select,
    columnDataMap.checkbox,
    columnDataMap.datetime,
  ],
  viewRuleData: [
    viewRuleDataMap['1'],
    viewRuleDataMap['2'],
    // viewRuleDataMap['3'],
    // viewRuleDataMap['5'],
    // viewRuleDataMap['6'],
    // viewRuleDataMap['8'],
  ],
  operationData: [
    operationdataMap['1'],
  ],
  operationRuleData: [
    operationRuleDataMap['1']
  ],
  formModel: {
    // 'V#1-C#1': '123',
    // 'V#1-C#2': 'value_2',
    // 'V#1-C#3': ['value_1', 'gua_2'],
    // 'V#1-C#4': null,
    input: '123',
    select: null,
    checkbox: ['value_1', 'gua_2'],
    datetime: null,
  },
  subViewData: [{
    id: 2,
    title: '子表',
    isShow: true,
    isDialog: false,
    code: 'subForm',
    columnData: [
      columnDataMap.textarea,
      columnDataMap.date,
    ],
    viewRuleData: [
      // viewRuleDataMap['4'],
      // viewRuleDataMap['7'],
    ],
    operationData: [
        operationdataMap['2'],
        operationdataMap['3'],
      ],
      operationRuleData: [
        operationRuleDataMap['2']
      ],
    formModel: {
      // 'V#1-V#2-C#11': 'gua',
      // 'V#1-V#2-C#42': null,
      textarea: 'gua',
      date: null,
    },
    // subViewData: [{
    //   id: 2,
    //   title: '子表-2',
    //   isShow: true,
    //   isDialog: false,
    //   code: 'subForm',
    //   columnData: [
    //     columnDataMap.textarea,
    //     columnDataMap.date,
    //   ],
    //   viewRuleData: [
    //     // viewRuleDataMap['4'],
    //     // viewRuleDataMap['7'],
    //   ],
    //   operationData: [
    //     operationdataMap['2'],
    //     operationdataMap['3'],
    //   ],
    //   operationRuleData: [
    //     operationRuleDataMap['2']
    //   ],
    //   formModel: {
    //     // 'V#1-V#2-C#11': 'gua',
    //     // 'V#1-V#2-C#42': null,
    //     textarea: 'gua',
    //     date: null,
    //   },
    // }]
  }]
}
