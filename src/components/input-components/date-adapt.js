import WeekPicker from '~input/week-picker'
import date from '~utils/date'
import _ from '~utils/utils'

export default {
  name: "DateAdapt",
  components: {
    WeekPicker
  },
  props: {
    //dates, daterange, timerange类型的value是数组
    //其余类型是时间戳Number
    value: {
      type: [Number, Array],
      default: null
    },
    type: {
      type: String,
      default: "date"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: "default placeholder"
    },
    //选择弹窗的起始时间戳
    start: {
      type: Number,
      default: null
    },
    //选择弹窗的结束时间戳
    end: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      //组件内部的类型映射
      typeMap: {
        date: 'date',
        datetime: 'datetime',
        year: 'year',
        month: 'month',
        week: 'week',
        dates: 'dates',
        daterange: 'daterange',
        time: 'time',
        timerange: 'timerange',
      }
    };
  },
  computed: {
    //组件内部绑定的类型
    currrentType() {
      return this.typeMap[this.type] 
    },
    //双绑
    currentValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    //范围选择的placeholder
    startPlaceholder() {
      if (this.currrentType === "daterange") {
        return `${this.placeholder}开始日期`;
      }
      if (this.currrentType === "timerange") {
        return `${this.placeholder}开始时间`;
      }
      return "";
    },
    endPlaceholder() {
      if (this.currrentType === "daterange") {
        return `${this.placeholder}结束日期`;
      }
      if (this.currrentType === "timerange") {
        return `${this.placeholder}结束时间`;
      }
      return "";
    },
    //time类型的选择范围起始
    selectableRange() {
      let start = date.moment(this.start).time;
      let end = date.moment(this.end).time;
      let s = '00:00:00'
      let e = '23:59:59'
      if (_.invalid(start) && _.invalid(end)) {
        return `${s}-${e}`;
      }
      if (_.invalid(start) && _.valid(end)) {
        return `${s}-${end}`;
      }
      if (_.valid(start) && _.invalid(end)) {
        return `${start}-${e}`;
      }
      if (_.valid(start) && _.valid(end)) {
        return `${start}-${end}`;
      }
    },
    //选项，设置选择范围的起始
    //TODO:timerange不能设置
    pickerOptions() {
      if (this.currrentType === "time" || this.currrentType === "timerange") {
        return {
          selectableRange: this.selectableRange
        }
      }
      return {
        disabledDate: this.disabledDate
      }
    }
  },
  methods: {
    //date类型的选择范围起始
    disabledDate(time) {
      let start = this.start;
      let end = this.end;
      if (_.invalid(start) && _.invalid(end)) {
        return false;
      }
      if (_.invalid(start) && _.valid(end)) {
        return time.getTime() > end;
      }
      if (_.valid(start) && _.invalid(end)) {
        return time.getTime() < start;
      }
      if (_.valid(start) && _.valid(end)) {
        return time.getTime() < start || time.getTime() > end;
      }
    },
  },
  watch: {
  },
  mounted() {
  },
  render(h) {
    //子组件的props和v-model的input事件函数
    let config = {
      props: {
        value: this.value,
        disabled: this.disabled,
        placeholder: this.placeholder,
        pickerOptions: this.pickerOptions
      },
      on: {
        input: val => {
          this.currentValue = val;
        }
      }
    };
    if (this.currrentType === "daterange" || this.currrentType === "timerange") {
      config.props.startPlaceholder = this.startPlaceholder;
      config.props.endPlaceholder = this.endPlaceholder;
    }
    if(this.currrentType === 'date') {
      return  (<el-date-picker {...config} value-format="timestamp" />)
    }
    if(this.currrentType === 'datetime') {
      return  (<el-date-picker {...config} type="datetime" value-format="timestamp" />)
    }
    if (this.currrentType === 'year') {
      return (<el-date-picker {...config} type="year" value-format="timestamp" />)
    }
    if (this.currrentType === 'month') {
      return  (<el-date-picker {...config} type="month" value-format="timestamp" />)
    }
    if (this.currrentType === 'week') {
      return  (<week-picker {...config} ></week-picker>)
    }
    if (this.currrentType === 'dates') {
      return  (<el-date-picker {...config} type="dates" value-format="timestamp" />)
    }
    if (this.currrentType === 'daterange') {
      return  (<el-date-picker {...config} type="daterange" value-format="timestamp" />)
    }
    if (this.currrentType === 'time') {
      return  (<el-time-picker {...config} arrow-control value-format="timestamp" />)
    }
    if (this.currrentType === 'timerange') {
      return  (<el-time-picker {...config} is-range arrow-control value-format="timestamp" />)
    }
    console.log(`(${this.type})类型的时间组件不存在，渲染为默认的date类型`)
    return (<el-date-picker {...config} value-format="timestamp" />)
  }
};
