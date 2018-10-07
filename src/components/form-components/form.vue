<template>
  <div class='group-form'>
    <!-- <div :class='{"form-title-none":titleNone, "form-title-top":titleTop}'>{{formData.title}}</div> -->
    <!-- 隐藏label -->
    <!-- <el-form :inline="formData.inline" :model="formModel" ref='form' class='form-content' :show-message='showErrMessage' v-if='hideLabel'>
      <my-col v-for='(item, index) in formData.head' :key='index' :status='fullStatus(item)'>
        <el-form-item :prop='item.prop' :rules='item.rules' :style='{"margin-bottom": marginBottom}' v-if='showFormItem(item.show)'>
          <input-adapt :type='item.type' v-model='formModel[item.prop]' :placeholder='item.placeholder' 
            :options='item.options' :filterable='item.filterable' :changeEvent='item.changeEvent' :visibleChange='item.visibleChange'></input-adapt>
        </el-form-item>
      </my-col>
      <my-col status='inline'>
        <slot name='puiInput'></slot>
      </my-col>
      <my-col status='inline'>
        <slot name='button'></slot>
      </my-col>
      <div :style='{"clear": "both"}'></div>
    </el-form> -->
    <!-- 显示label -->
    <el-button @click='validate'>validate</el-button>
    <el-form :model="formModel" ref='form' class='form-content' show-message label-width="100px" validate-on-rule-change style='width: 1200px'>
      <el-col v-for='(item, index) in columns' v-if='item.isShow' :key='index' :is-full='item.isFull' :span='item.isFull?24:12'>
        <el-form-item  :label="item.label" :prop='item.prop' :rules='item.rules' class='form-item'>
          <input-adapt v-model='formModel[item.prop]' :column='item'></input-adapt>
        </el-form-item>
      </el-col>
      <!-- <el-form-item  label="input1" prop='input1' :rules='columns[0].rules' class='form-item'>
        <el-input v-model='formModel.input1' :column='columns[0]'></el-input>
      </el-form-item> -->

      <!-- <my-col status='inline'>
        <slot name='button'></slot>
      </my-col> -->
      <!-- <div :style='{"clear": "both"}'></div> -->
    </el-form>
  </div>

</template>

<script>
import inputAdapt from '~input/input-adapt'
import Column from '~rules/column'
export default {
  components: {
    inputAdapt,
  },
  props: {
    // formData: {
    //   type: Object,
    //   required: true,
    // },
    // value: {
    //   required: true,
    // },
    // titlePosition: {
    //   default: 'none'
    // },
    // showErrMessage: {
    //   default: true,
    // },
    // labelWidth: {
    //   default: '100px',
    // }
  },
  data() {
    return {
      colWidth: '300px',
      columnData:[{
        type: 'input',
        prop: 'input',
        label: 'input',
        placeholder: 'input',
        disabled: false,
        isFull: false,
        isShow: true,
        required: true,
        rules: [{
          ruleType: 'length',
          min:2, 
          max: 13
        }, {
          ruleType: 'custom',
          reg: /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/,
          message: '手机号码格式不正确',
        }]
      }, {
        type: 'select',
        prop: 'select',
        label: 'select',
        required: true,
        placeholder: 'select',
        disabled: false,
        isFull: false,
        isShow: false,
        rules: null,
        options: [{
          value: 'value_1',
          label: 'label_1',
        }, {
          value: 'value_2',
          label: 'label_2',
        }, {
          value: 'value_3',
          label: 'label_3',
        }, ]
      }, {
        type: 'checkbox',
        prop: 'checkbox',
        label: 'checkbox',
        placeholder: 'checkbox',
        disabled: false,
        required: true,
        isFull: false,
        isShow: true,
        rules: [{
          ruleType: 'type',
          type: 'array',
        }],
        showChooseAll: false,
        options: [{
          value: 'value_1',
          label: 'label_1',
        }, {
          value: 'value_2',
          label: 'label_2',
        }, {
          value: 'value_3',
          label: 'label_3',
        }]
      }, {
        type: 'datetime',
        prop: 'datetime',
        label: 'datetime',
        placeholder: 'datetime',
        disabled: false,
        required: true,
        isFull: false,
        isShow: true,
        rules: []
      }],

      /**
       * formModel
       */
      formModel: {
        input: null,
        select: null,
        checkbox: null,
        datetime: null,
        input1: null,
      }
    }
  },
  computed: {
    // formModel: {
    //   get() {
    //     return this.value
    //   },
    //   set(newValue) {
    //     // this.value = newValue
    //     this.$emit('input', newValue)
    //   }
    // },
    // hideLabel() {
    //   return this.formData.showLabel === false
    // },
    // showLabel() {
    //   return this.formData.showLabel === undefined || this.formData.showLabel === true
    // },
    // titleNone() {
    //   return this.titlePosition === 'none'
    // },
    // titleTop() {
    //   return this.titlePosition === 'top'
    // },
    // marginBottom() {
    //   if (!this.showErrMessage) {
    //     return '0'
    //   }
    // },
  },
  methods: {
    // fullStatus(item) {
    //   if(this.formData.inline) {
    //     return 'inline'
    //   }
    //   if(item.full === undefined) {
    //     return 'full'
    //   }
    //   let r = item.full === true ? 'full' : 'half'
    //   return r
    // },
    // showFormItem(show) {
    //   if(show === undefined) {
    //     return true
    //   }
    //   return show
    // },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          // setTimeout(() =>{
            if (valid && this.formModel) {
              // let result = {}
              // result[this.formData.formName] = this.formModel
              resolve();
            } else {
              console.log('error')
              reject(false);
            }
          // });
        });
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
  },
  created() {
    let columns = this.columnData.map(data => {
      return new Column(data)
    })
    this.columns = columns
    console.log(this.columns)
  }
}
</script>
<style lang="scss" scoped>
  .group-form{
    width: 100%;
    .form-title-none {
      display: none;
    }
    .form-title-top {
      font-family: STHeitiSC-Medium;
      font-size: 18px;
      color: #2f3748;
      background: #fcfdff;
      line-height: 43px;
      height: 43px;
      padding-left: 20px;
      border-bottom: solid 1px #f1f1f1;
    }
    .form-content {
      max-width: 1000px;
      // padding: 20px 20px 0 0;
      background-color: rgba(201, 196, 196, 0.24);
      font-family: STHeitiSC-Medium;
      font-size: 14px;
      color: #a39c9c;
      .form-item {
        background-color: #2f374846
      }
    }
  }
</style>


