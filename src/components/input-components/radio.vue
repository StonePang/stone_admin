<template>
  <el-radio-group v-model='currentValue' :disabled="disabled">
    <el-radio v-for="(item, index) in currentOptions" :key="item.value + '_' + index" :label="item.value" :disabled="item.disabled">
      {{item.label}}
    </el-radio>
  </el-radio-group>
</template>

<script>
import _ from "~utils/utils";
export default {
  name: "MyRadio",
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
        if(!this.inOptions(val)) {
          let errMsg = `值(${val})不在radio组件(${this.placeholder})的选项中`;
          console.log(errMsg);
        }
        return val
      },
      set(val) {
        let emitValue = val;
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
      return this.has(value);
    },
  },
};
</script>

