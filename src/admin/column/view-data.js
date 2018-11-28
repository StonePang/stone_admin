import columnData from './column-data'
// import viewRuleDataMap from './viewRule-data-map'
// import operationdataMap from './operation-data-map'
// import operationRuleDataMap from './operation-rule-data-map'
export default {
  id: 1,
  isShow: true,
  title: '字段配置',
  code: 'columnForm',
  formType: 'mainForm',
  columnData: [
    columnData.type,
    columnData.code,
  ],
  viewRuleData: [
    // viewRuleDataMap['1'],
    // viewRuleDataMap['2'],
    // viewRuleDataMap['3'],
    // viewRuleDataMap['5'],
    // viewRuleDataMap['6'],
    // viewRuleDataMap['8'],
  ],
  operationData: [
    // operationdataMap['1'],
  ],
  operationRuleData: [
    // operationRuleDataMap['1']
  ],
  subViewData: [
    // {
    //   id: 2,
    //   title: '子表',
    //   isShow: true,
    //   isDialog: false,
    //   code: 'subForm',
    //   formType: 'mainForm',
    //   columnData: [
    //     columnDataMap.textarea,
    //     columnDataMap.date,
    //     columnDataMap.switch,
    //   ],
    //   viewRuleData: [
    //     viewRuleDataMap['2'],
    //     // viewRuleDataMap['7'],
    //   ],
    //   operationData: [
    //     operationdataMap['2'],
    //     operationdataMap['3'],
    //   ],
    //   operationRuleData: [
    //     operationRuleDataMap['2']
    //   ],
    // },
    // {
    //   id: 3,
    //   isShow: true,
    //   formType: 'batchForm',
    //   // formType: 'mainForm',
    //   title: '批量表',
    //   code: 'batchForm',
    //   columnData: [
    //     columnDataMap.input,
    //     columnDataMap.select,
    //     columnDataMap.checkbox,
    //     columnDataMap.datetime,
    //   ],
    //   operationData: [
    //     operationdataMap['4'],
    //   ],
    //   viewRuleData: [
    //     // viewRuleData['1'],
    //     // viewRuleDataMap['2'],
    //   ],
    //   // subView: []
    // }
  ]
}
