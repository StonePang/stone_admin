<template>
  <div v-if='view.isShow'>
    <main-form v-if='formType==="mainForm"' :view='view' ref='form'/>
    <batch-form v-else-if='formType==="batchForm"' :view='view' ref='form'/>
    <h1 v-else>{{errMsg}}</h1>
    <div v-if='showSubView'>
      <div v-for='subView in view.subView' :key='subView.id'>
        <el-dialog :title='subView.title' :visible.sync="subView.isShow" width='80%' v-if='subView.isDialog' append-to-body>
          <form-adapt :view='subView' ref='subforms'/>
          <span slot="footer">
            <el-button @click="subView.isShow = false">取 消</el-button>
          </span>
        </el-dialog>
        <form-adapt :view='subView' ref='subforms' v-else/>
      </div>
    </div>
  </div>
</template>
<script>
import MainForm from './form'
import BatchForm from './batch-form'
export default {
  name: 'FormAdapt',
  components: {
    MainForm,
    BatchForm,
  },
  props: {
    view: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    formType() {
      return this.view.formType
    },
    errMsg() {
      return `view.formType出错---(${this.formType}),不能找到对应form组件渲染.`
    },
    showSubView() {
      if(this.view.subView && this.formType === 'batchForm') {
        console.warn(`batchView不支持有下级子表subView, 不渲染subView`, this.view)
      }
      return this.view.subView && this.formType === 'mainForm'
    }
  },
  methods: {
    validateAll() {
      let formValidate = new Promise((resolve, reject) => {
        setTimeout(() => {
          if(!this.$refs.form) {
            return resolve()
          }
          this.$refs.form.validate((valid) => {
            // if (valid && this.formModel) {
            if (valid) {
              resolve();
            } else {
              reject(false);
            }
          });
        })
      });
      if(!this.$refs.subforms) {
        return formValidate
      }
      let promises = this.$refs.subforms.map(item => {
        return item.validateAll()
      })
      promises.push(formValidate)
      return Promise.all(promises)
    },
    validateThisForm() {
      let formValidate = new Promise((resolve, reject) => {
        setTimeout(() => {
          this.$refs.form.validate((valid) => {
            // if (valid && this.formModel) {
            if (valid) {
              resolve();
            } else {
              reject(false);
            }
          });
        })
      });
      return formValidate
    },
    resetForm() {
      this.$refs.form.resetFields();
      if(this.$refs.subforms) {
        this.$refs.subforms.forEach(item => {
          item.resetForm()
        })
      }
    },
  }
}
</script>

