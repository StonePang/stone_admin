<template>
  <el-date-picker v-model="currentValue" type="week" :placeholder="placeholder" :disabled='disabled' format="yyyy 年第 WW 周" :picker-options='pickerOptions'></el-date-picker>
</template>
<script>
import date from '~utils/date'
import _ from '~utils/utils'
export default {
  name: 'WeekPicker',
  props: {
    value: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: "default placeholder"
    },
    pickerOptions: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    currentValue: {
      //unix-->Date
      //null, '' 必须转换成undefined
      get() {
        let val = this.value
        // if(_.valid(val)) {
        //   return date.moment(val).Date
        // }
        // return null
        return date.moment(val).Date
      },
      //Date-->unix
      //null, '', undefined,转换成null
      set(val) {
        // let emitValue = null
        // if(_.valid(val)) {
        //   emitValue = date.moment(val).unix
        // } 
        let  emitValue = date.moment(val).unix
        this.$emit('input', emitValue)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
