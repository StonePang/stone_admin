import columnData from './column-data'
import viewRuleData from './view-rule-data'
// import operationdataMap from './operation-data-map'
// import operationRuleDataMap from './operation-rule-data-map'
export default {
  id: 1,
  isShow: true,
  title: '字段配置',
  code: 'column',
  formType: 'mainForm',
  columnData: [
    columnData.type,
    columnData.code,
    columnData.renderType,
    columnData.isShow,
    columnData.disabled,
    columnData.label,
    columnData.placeholder,
    columnData.required,
    columnData.isFull,
    columnData.desc,
    columnData.multiple,
    columnData.filterable,
    columnData.start,
    columnData.end,
    columnData.showChooseAll,
    columnData.defaultValue,
  ],
  viewRuleData: [
    viewRuleData.showMultiple,
    viewRuleData.showFilterable,
    viewRuleData.showChooseAll,
    viewRuleData.showOptions,
    viewRuleData.showStartAndEnd,
    viewRuleData.changeDefaultValueType,
    viewRuleData.changeStartAndEndType,
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
    {
      id: 2,
      title: '字段选项设置',
      isShow: true,
      isDialog: false,
      code: 'options',
      formType: 'batchForm',
      columnData: [
        columnData.label,
        columnData.value,
      ],
      viewRuleData: [
        // viewRuleDataMap['2'],
        // viewRuleDataMap['7'],
      ],
      operationData: [
        // operationdataMap['2'],
        // operationdataMap['3'],
      ],
      operationRuleData: [
        // operationRuleDataMap['2']
      ],
    },
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
