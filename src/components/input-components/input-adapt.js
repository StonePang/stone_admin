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
    type() {
      return this.column.type
    },
    currentValue: {
      get() {
        let val = this.value
        return val
      },
      set(val) {
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
      this.column.triggerEvent('update', val)
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
    //不同的type的config不同
    handlerConfig() {
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
      if (this.type === 'select') {
        config.props.options = this.column.options
        config.props.filterable = this.column.filterable
        config.props.loading = this.column.loading
        config.props.remote = this.column.remote
        config.props.multiple = this.column.multiple
      }else if (this.type === 'radio') {
        config.props.options = this.column.options
      } else if (this.type === 'checkbox') {
        config.props.options = this.column.options
        config.props.showChooseAll = this.column.showChooseAll
      } else if (_.includes(this.dateType, this.type)) {
        config.props.type = this.column.type
        config.props.start = this.column.start
        config.props.end = this.column.end
      } else if (this.type === 'textarea') {
        config.props.type = 'textarea'
        config.props.rows = this.column.rows
        config.props.resize = 'none'
        config.props.clearable = true
        config.on.input = this.onInput
      } else {
        config.props.type = 'text'
        config.props.clearable = true
        config.on.input = this.onInput
      }
      return config
    },
  },
  render(h) {
    let config = this.handlerConfig()
    //委托渲染
    if(this.column.componentRender) {
      console.log(`字段(${this.column.id}-${this.column.prop})执行委托渲染, column-->`, this.column, 'config-->', config)
      return this.column.componentRender(h, config)
    }
    if(this.type === 'select') {
      return (<my-select {...config}></my-select>)
    } 
    if (this.type === 'radio') {
      return (<my-radio {...config}></my-radio>)
    } 
    if(this.type === 'checkbox') {
      return (<my-checkbox {...config}></my-checkbox>)
    } 
    if(_.includes(this.dateType, this.type)) {
      return (<date-adapt {...config}></date-adapt>)
    } 
    if(this.type === 'textarea') {
      return (<el-input {...config} placeholder={config.props.placeholder}></el-input>)
    }
    if(this.type === 'input') {
      return (<el-input {...config} placeholder={config.props.placeholder}></el-input>)
    }
    return (<el-input {...config} placeholder={config.props.placeholder}></el-input>)
  }

}
