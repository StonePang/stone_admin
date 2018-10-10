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
    <!-- <my-form :view/> -->
  </div>

</template>

<script>
import inputAdapt from '~input/input-adapt'
import Column from '~rules/column'
export default {
  name: 'MyForm',
  components: {
    inputAdapt,
  },
  props: {
    // columns: {
    //   type: Array,
    // },
    // formModel: {
    //   type: Object,
    // },
    view: {
      type: Object
    },
    //加载完成后是否校验
    loadingCheck: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      columns: this.view.columns,
      formModel: this.view.formModel,
    }
  },
  computed: {
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid && this.formModel) {
            resolve();
          } else {
            console.log('error')
            reject(false);
          }
        });
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
  },
  mounted() {
    // let columns = this.columnData.map(data => {
    //   return new Column(data)
    // })
    // this.columns = columns
    // console.log(this.columns)
    if(this.loadingCheck) {
      this.validate()
    }
  },
  beforeDestroy() {
    this.view.destroy()
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


