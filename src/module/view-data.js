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
    viewRuleDataMap['1'],
    viewRuleDataMap['2'],
    viewRuleDataMap['3'],
    viewRuleDataMap['5'],
  ],
  formModel: {
    input: 'r',
    select: null,
    checkbox: null,
    datetime: null,
    input1: null
  },
  subViewData: [{
    id: 100,
    title: '子表',
    isShow: true,
    prop: 'subForm',
    columnData: [
      columnDataMap.textarea,
      columnDataMap.date,
    ],
    viewRuleData: [
      viewRuleDataMap['4'],
    ],
    formModel: {
      textarea: 'gua',
      date: null,
    }
  }]
}
