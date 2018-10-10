<template>
  <div>
    <p>test page</p>
    <!-- <my-select v-model='model' :placeholder="placeholder" :options='options' :multiple='multiple'></my-select>
    <my-radio v-model='model' :options='options'></my-radio> -->
    <!-- <my-checkbox v-model='model' :options='options'></my-checkbox> -->
    <!-- <el-date-picker v-model="date" type="datetime" placeholder="选择日期" value-format='timestamp' :picker-options='pickerOptions'/> -->
    <!-- <el-time-picker v-model="date" placeholder="选择日期" value-format='timestamp' :picker-options="pickerOptions"/> -->
    <!-- <my-week-picker v-model='date' :picker-options="pickerOptions"/> -->
    <!-- <date-adapt v-model='date' :type='type' :start='start' :end='end' v-if='show'/> -->
    <!-- <el-input-number v-model='index'/> -->
    <!-- <el-input v-model='inputValue' :placeholder="this.column.placeholder"/> -->
    <!-- <input-adapt :column='column' v-model='inputValue'/> -->
    <my-form v-if='!loading' :columns='view.columns' :formModel='view.formModel' />
  </div>
</template>

<script>
// import dateUtil from "~utils/date";
// import MySelect from "~input/select";
import MyRadio from "~input/radio";
// import MyCheckbox from "~input/checkbox";
// import MyWeekPicker from "~input/week-picker";
// // import DateAdapt from "~input/date-adaptive";
// import DateAdapt from "~input/date-adapt";
// import InputAdapt from "~input/input-adapt";
import MyForm from "~form/form";
import View from "~rules/view";
export default {
  components: {
    // MySelect,
    MyRadio,
    // MyCheckbox,
    // MyWeekPicker,
    // DateAdapt,
    // InputAdapt,
    MyForm
  },
  data() {
    return {
      // show: true,
      // model: [1,"value_1"],
      // placeholder: "select",
      // multiple: false,
      // date: null,
      // mood: {
      //   1: 'date',
      //   2: 'datetime',
      //   3: 'year',
      //   4: 'month',
      //   5: 'week',
      //   6: 'dates',
      //   7: 'daterange',
      //   8: 'time',
      //   9: 'timerange',
      // },
      // index: 7,
      // // type: this.mood[this.index],
      // start: 1536153480000,
      // end: 1538144202000,
      // options: [
      //   {
      //     value: "value_1",
      //     label: "label_1"
      //   },
      //   {
      //     value: "",
      //     label: "label_2"
      //   },
      //   {
      //     value: "value_3",
      //     label: "label_3",
      //     disabled: false
      //   }
      // ],
      // pickerOptions: {
      //   selectableRange: '18:30:00 - 20:30:00',
      //   // disabledDate(time) {
      //   //   return time.getTime() > Date.now();
      //   // }
      //   disabledDate: this.disabledDate
      // },
      // inputValue: null,
      view: null,
      loading: true,
      viewData: {
        id: 1,
        columnData: [
          {
            id: 1,
            type: "input",
            prop: "input",
            label: "input",
            placeholder: "input",
            disabled: false,
            isFull: false,
            isShow: true,
            required: true,
            rules: [
              {
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
          {
            id: 2,
            type: "select",
            prop: "select",
            label: "select",
            required: true,
            placeholder: "select",
            disabled: false,
            isFull: false,
            isShow: true,
            rules: null,
            options: [
              {
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
              }
            ],
            //委托渲染
            componentRender: (h, config) => {
              return (<my-radio {...config}/>)
            }
          },
          {
            id: 3,
            type: "checkbox",
            prop: "checkbox",
            label: "checkbox",    
            placeholder: "checkbox",
            disabled: true,
            required: true,
            isFull: false,
            isShow: true,
            rules: [
              {
                ruleType: "type",
                type: "array"
              }
            ],
            showChooseAll: false,
            options: [
              {
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
              }
            ]
          },
          {
            id: 4,
            type: "datetime",
            prop: "datetime",
            label: "datetime",
            placeholder: "datetime",
            disabled: false,
            required: true,
            isFull: false,
            isShow: true,
            rules: []
          }
        ],
        viewRuleData:[{
          id: 21,
          affectColumns: [4],
          type: 'hidden',
          conditions: [{
            bindColumn: 1,
            conditionType: 3,
            conditionValue: 'r'
          }, {
            bindColumn: 2,
            conditionType: 3,
            conditionValue: 'value_2'
          }]
        }, {
          id: 22,
          affectColumns: [3],
          type: 'disabled',
          conditions: [{
            bindColumn: 1,
            conditionType: 3,
            conditionValue: '123'
          }, {
            bindColumn: 2,
            conditionType: 3,
            conditionValue: 'value_1'
          }]
        }],
        formModel: {
          input: 'r',
          select: 'value_2',
          checkbox: null,
          datetime: null,
          input1: null
        }
      }
    };
  },
  computed: {
    // type() {
    //   return this.mood[this.index]
    //   // return 'dsa'
    // }
  },
  watch: {
    // model(val) {
    //   console.log("watch model", val);
    // },
    // index(val) {
    //   this.show = false
    //   this.$nextTick(() => {
    //     setTimeout(() => {
    //       this.show = true
    //     })
    //   })
    // }
  },
  methods: {
    // disabledDate(time) {
    //   return time.getTime() > Date.now();
    //   // return true
    // }
  },
  mounted() {
    setTimeout(() => {
      // let columns = this.columnData.map(data => {
      //   return new Column(data);
      // });
      // this.view.columns = columns;
      // console.log(this.view.columns);
      // this.view.loading = false;
      let view = new View(this.viewData)
      this.view = view
      this.loading = false
      console.log(this.view)
    }, 2000);
  }
};
</script>

