<template>
  <el-checkbox-group v-model='currentValue' :disabled="disabled">
    <el-checkbox v-for="(item, index) in currentOptions" :key="item.value + '_' + index" :label="item.value" :disabled="item.disabled">
      {{item.label}}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script>
import _ from "~utils/utils";
export default {
  name: "MyCheckbox",
  props: {
    value: {
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: "default placeholder"
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
    currentValue: {
      get() {
        let val = this.value
        if(_.invalid(val)) {
          return []
        }
        if(!this.inOptions(val)) {
          let errMsg = `值(${val})不在checkbox组件(${this.placeholder})的选项中`;
          console.log(errMsg);
        }
        return val
      },
      set(val) {
        let emitValue = val;
        if(_.isEmptyArray(val)) {
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
    inOptions(value) {
      return value.every(e => {
        let r = this.has(e);
        return r;
      });
    },
  },
};
</script>

