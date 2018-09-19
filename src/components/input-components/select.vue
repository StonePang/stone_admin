<template>
  <el-select v-model='currentValue' :placeholder="placeholder" :disabled="disabled" :filterable="filterable" :remote="remote" :multiple="multiple"
    clearable :collapse-tags='false'>
    <el-option
      v-for="(item, index) in currentOptions"
      :key="item.value + '_' + index"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled">
    </el-option>
  </el-select>
</template>

<script>
import _ from '~utils/utils'
export default {
  name: 'MySelect',
  props: {
    value: {
      required: true
    },
    placeholder: {
      type: String,
      default: 'default placeholder',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    remote: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  data() {
    return {
    }
  },
  computed: {
    currentOptions() {
      return this.options.map(item => {
        return {
          key: item.value,
          value: item.value,
          label: item.label,
          disabled: item.disabled || false
        }
      })
    },
    currentValue: {
      get() {
        if(this.multiple && !this.value) {
          return []
        }
        if(!this.multiple && !this.value) {
          return null
        }
        return this.value
      },
      set(val) {
        let emitValue = val
        if(!this.multiple && !val) {
          emitValue = null
        }else if(this.multiple && _.isEmptyArray(val)) {
          emitValue = null
        }
        this.$emit('input', emitValue)
      }
    }
  },
}
</script>

