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
import _ from "~utils/utils";
export default {
  name: "MySelect",
  props: {
    value: {
      required: true
    },
    placeholder: {
      type: String,
      default: "default placeholder"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    remote: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
    };
  },
  computed: {
    currentOptions() {
      let r = this.options.map(item => {
        return {
          key: item.value,
          value: item.value,
          label: item.label,
          disabled: item.disabled || false
        };
      });
      return r
    },
    //多选只能接受[]，将无效值代理为[]
    currentValue: {
      get() {
        let val = this.value
        //值不再选项中时报错
        if(!this.inOptions(val)) {
          let invalidOptions = this.invalidOptions(val)
          let tag = this.multiple ? "多选" : "单选";
          let errMsg = `值(${invalidOptions})不在select组件-${tag}-(${this.placeholder})的选项中`;
          console.log(errMsg);
        }
        if(!_.valid(val) && this.multiple) {
          return []
        }
        return val
      },
      set(val) {
        let emitValue = val;
        // if (!this.multiple && _.invalid(val)) {
        //   emitValue = null;
        // } else if (this.multiple && _.isEmptyArray(val)) {
        //   emitValue = null;
        // }
        if (this.multiple && _.isEmptyArray(val)) {
          emitValue = null
        }
        this.$emit("input", emitValue);
      }
    }
  },
  methods: {
    has(value) {
      let r = this.currentOptions.some(item => {
        return item.value === value;
      });
      return r
    },
    //普通参数value 是否在currentoptions的.value中
    //数组参数必须每项都在currentOption的.value中
    inOptions(value) {
      if (!_.isArray(value)) {
        return this.has(value);
      }
      return value.every(e => {
        let r = this.has(e);
        return r;
      });
    },
    //不再选项中的值
    invalidOptions(value) {
      if(!_.isArray(value) && !this.has(value)) {
        return value
      }
      return value.filter(e => {
        return !this.has(e);
      });
    },
  },
};
</script>

