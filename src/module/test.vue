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
    <my-form />
  </div>
</template>

<script>
import dateUtil from "~utils/date";
import MySelect from "~input/select";
import MyRadio from "~input/radio";
import MyCheckbox from "~input/checkbox";
import MyWeekPicker from "~input/week-picker";
// import DateAdapt from "~input/date-adaptive";
import DateAdapt from "~input/date-adapt";
import InputAdapt from "~input/input-adapt";
import MyForm from '~form/form'
export default {
  components: {
    MySelect,
    MyRadio,
    MyCheckbox,
    MyWeekPicker,
    DateAdapt,
    InputAdapt,
    MyForm,
  },
  data() {
    return {
      show: true,
      model: [1,"value_1"],
      placeholder: "select",
      multiple: false,
      date: null,
      mood: {
        1: 'date',
        2: 'datetime',
        3: 'year',
        4: 'month',
        5: 'week',
        6: 'dates',
        7: 'daterange',
        8: 'time',
        9: 'timerange',
      },
      index: 7,
      // type: this.mood[this.index],
      start: 1536153480000,
      end: 1538144202000,
      options: [
        {
          value: "value_1",
          label: "label_1"
        },
        {
          value: "",
          label: "label_2"
        },
        {
          value: "value_3",
          label: "label_3",
          disabled: false
        }
      ],
      pickerOptions: {
        selectableRange: '18:30:00 - 20:30:00',
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // }
        disabledDate: this.disabledDate
      },
      inputValue: null,
      column: {
        type: 'input',
        placeholder: 'column',
        disabled: true,
        multiple: true,
        filterable: false,
        loading: false,
        remote: false,
        showChooseAll: true,
        start: null,
        end: null,
        rows: 3,
        options: [{
          value: "value_1",
          label: "label_1"
        }, {
          value: "",
          label: "label_2"
        }, {
          value: "value_3",
          label: "label_3",
          disabled: false
        }],

      }
    };
  },
  computed: {
    type() {
      return this.mood[this.index]
      // return 'dsa'
    }
  },
  watch: {
    model(val) {
      console.log("watch model", val);
    },
    index(val) {
      this.show = false
      this.$nextTick(() => {
        setTimeout(() => {
          this.show = true
        })
        
      })
    }
  },
  methods: {
    disabledDate(time) {
      return time.getTime() > Date.now();
      // return true
    }
  },
  mounted() {
    // setTimeout(() => {
    //   this.model = [2,5]
    // }, 2000)
    // let r = dateUtil.moment(null);
    // console.log(r);
  }
};
</script>

