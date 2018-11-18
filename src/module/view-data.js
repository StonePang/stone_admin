import columnDataMap from './column-data-map'
import viewRuleDataMap from './viewRule-data-map'
import operationdataMap from './operation-data-map'
import operationRuleDataMap from './operation-rule-data-map'
// import formModelData from './form-model-data'
export default {
  id: 1,
  isShow: true,
  title: '主表',
  code: 'mainForm',
  formType: 'mainForm',
  columnData: [
    columnDataMap.input,
    columnDataMap.select,
    columnDataMap.checkbox,
    columnDataMap.datetime,
  ],
  viewRuleData: [
    viewRuleDataMap['1'],
    // viewRuleDataMap['2'],
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
  subViewData: [
    {
    id: 2,
    title: '子表',
    isShow: true,
    isDialog: false,
    code: 'subForm',
    formType: 'mainForm',
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
  }, 
  {
    id: 3,
    isShow: true,
    formType: 'batchForm',
    // formType: 'mainForm',
    title: '批量表',
    code: 'batchForm',
    columnData: [
      columnDataMap.input,
      columnDataMap.select,
      columnDataMap.checkbox,
      columnDataMap.datetime,
    ],
    viewRuleData: [
      // viewRuleData['1'],
      // viewRuleData['2'],
    ],
    // subView: []
  }
]
}
