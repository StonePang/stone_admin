export default {
  input: {
    id: 1,
    desc: 'input',
    type: "input",
    prop: "input",
    label: "input",
    placeholder: "input",
    disabled: false,
    isFull: false,
    isShow: true,
    required: false,
    rules: [{
        ruleType: "length",
        min: 2,
        max: 13
      },
      {
        ruleType: "custom",
        reg: /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/,
        message: "手机号码格式不正确"
      }
    ]
  },
  select: {
    id: 2,
    desc: 'select',
    type: "select",
    prop: "select",
    label: "select",
    required: true,
    placeholder: "select",
    disabled: false,
    isFull: false,
    isShow: true,
    rules: null,
    options: [{
      value: "value_1",
      label: "label_1"
    },
    {
      value: "value_2",
      label: "label_2"
    },
    {
      value: "value_3",
      label: "label_3"
    }],
    //委托渲染
    componentRender: (h, config) => {
      return ( < my-radio {...config} />)
    }
  },
  checkbox: {
    id: 3,
    desc: 'checkbox',
    type: "checkbox",
    prop: "checkbox",
    label: "checkbox",
    placeholder: "checkbox",
    disabled: true,
    required: true,
    isFull: false,
    isShow: true,
    rules: [{
      ruleType: "type",
      type: "array"
    }],
    showChooseAll: false,
    options: [{
      value: "value_1",
      label: "label_1",
      // disabled: true,
    },
    {
      value: "value_2",
      label: "label_2"
    },
    {
      value: "value_3",
      label: "label_3"
    }]
  },
  datetime: {
    id: 4,
    desc: 'datetime',
    type: "datetime",
    prop: "datetime",
    label: "datetime",
    placeholder: "datetime",
    disabled: false,
    required: false,
    isFull: false,
    isShow: true,
    rules: []
  }, 
  textarea: {
    id: 11,
    desc: 'textarea',
    type: "textarea",
    prop: "textarea",
    label: "textarea",
    placeholder: "textarea",
    disabled: false,
    isFull: false,
    isShow: true,
    required: true,
    rules: [{
      ruleType: "length",
      min: 2,
      max: 13
    },
    {
      ruleType: "custom",
      reg: /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/,
      message: "手机号码格式不正确"
    }]
  }, 
  date: {
    id: 42,
    desc: 'date',
    type: "date",
    prop: "date",
    label: "date",
    placeholder: "date",
    disabled: false,
    required: true,
    isFull: false,
    isShow: true,
    rules: []
  }
}