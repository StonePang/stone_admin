<template>
  <div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" v-if='showChooseAll' class='check-all'>全选</el-checkbox>
    <el-checkbox-group v-model='currentValue' :disabled="disabled" class='group'>
      <el-checkbox v-for="(item, index) in currentOptions" :key="item.value + '_' + index" :label="item.value" :disabled="item.disabled">
        {{item.label}}
      </el-checkbox>
    </el-checkbox-group>
  </div>
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
    },
    showChooseAll: {
      type: Boolean,
      default: true,
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
    //选项value组成的数组
    optionsValue() {
      return this.currentOptions.map(item => {
        return item.value
      })
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
    },
    //全选框的值true: 选中； false: 没选中
    //所有选项值均在value中时为true
    checkAll: {
      get() {
        return this.optionsValue.every(item => {
          let temp = this.currentValue.some(e => {
            return e === item
          })
          return temp
        })
      },
      set(val) {
        if(val) {
          this.currentValue = this.optionsValue
        } else {
          this.currentValue = []
        }
      }
    },
    //全选框中间状态
    //value有但不是包含全部options时是中间状态
    isIndeterminate() {
      let allInCurrentValue = this.optionsValue.every(item => {
        return this.currentValue.indexOf(item) >= 0
      })
      return !allInCurrentValue && this.currentValue.length > 0
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

<style lang="scss" scoped>
  .check-all {
    display: inline-block;
    margin-right: 30px;
  }
  .group {
    display: inline-block
  }
</style>


