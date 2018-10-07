import MySelect from "~input/select";
import MyRadio from "~input/radio";
import MyCheckbox from "~input/checkbox";
import DateAdapt from '~input/date-adapt'
import _ from "~utils/utils";

export default {
  name: 'InputAdapt',
  components: {
    MySelect,
    MyRadio,
    MyCheckbox,
    DateAdapt,
  },
  props: {
    column: {
      type: Object,
      default: () => {
        return {}
      },
    },
    value: {
      required: true,
      default: null
    }
  },
  data() {
    return {
      dateType: [
        'date',
        'datetime',
        'year',
        'month',
        'week',
        'dates',
        'daterange',
        'time',
        'timerange',
      ]
    }
  },
  computed: {
    // placeholder() {
    //   return this.column.placeholder
    // },
    // disabled() {
    //   return this.column.disabled
    // },
    type() {
      return this.column.type
    },
    currentValue: {
      get() {
        let val = this.value
        // if(_.invalid(val)) {
        //   return null
        // }
        return val
      },
      set(val) {
        // let emitValue = null
        // if(_.valid(val)) {
        //   emitValue = val
        // }
        // this.$emit('input', emitValue)
        this.$emit('input', val)
      }
    },
  },  
  watch: {
    currentValue(val) {
      let column = this.column
      let emitData = {
        column,
        value: val,
      }
      this.$emit('input-change', emitData)
      this.column.triggerChange(val)
    }
  },
  methods: {
    //input,textarea 没有做封装，input回调把''-->null
    onInput(val) {
      let emitValue = null
      if(_.valid(val)) {
        emitValue = val
      }
      this.$emit('input', emitValue)
    },
    selectRender(config) {
      config.props.options = this.column.options
      config.props.filterable = this.column.filterable
      config.props.loading = this.column.loading
      config.props.remote = this.column.remote
      config.props.multiple = this.column.multiple
      return (<my-select {...config}></my-select>)
    },
    radioRender(config) {
      config.props.options = this.column.options
      return (<my-radio {...config}></my-radio>)
    },
    checkboxRender(config) {
      config.props.options = this.column.options
      config.props.showChooseAll = this.column.showChooseAll
      return (<my-checkbox {...config}></my-checkbox>)
    },
    dateAdaptRender(config) {
      config.props.type = this.column.type
      config.props.start = this.column.start
      config.props.end = this.column.end
      return (<date-adapt {...config}></date-adapt>)
    },
    textareaRender(config) {
      config.props.type = 'textarea'
      config.props.rows = this.column.rows
      config.props.resize = 'none'
      config.props.clearable = true
      config.on.input = this.onInput
      return (<el-input {...config} placeholder={config.props.placeholder}></el-input>)
    },
    inputRender(config) {
      config.props.type = 'text'
      config.props.clearable = true
      config.on.input = this.onInput
      return (<el-input {...config} placeholder={config.props.placeholder}></el-input>)
    }

  },
  render(h) {
    let config = {
      props: {
        placeholder: this.column.placeholder,
        disabled: this.column.disabled,
        value: this.currentValue,
      },
      on: {
        input: (val) => {
          this.currentValue = val
        }
      },
    }
    // console.log(config)
    if(this.type === 'select') {
      return this.selectRender(config)
    } 
    if (this.type === 'radio') {
      return this.radioRender(config)
    } 
    if(this.type === 'checkbox') {
      return this.checkboxRender(config)
    } 
    if(_.includes(this.dateType, this.type)) {
      return this.dateAdaptRender(config)
    } 
    if(this.type === 'textarea') {
      return this.textareaRender(config)
    }
    if(this.type === 'input') {
      return this.inputRender(config)
    }
    return this.inputRender(config)
    
  }

}
