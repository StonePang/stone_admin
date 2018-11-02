<template>
  <div class='form-wrap'>
    <el-button class='opration-top' @click='validateTest'>validate</el-button>
    <el-button class='opration-top' @click='resetForm'>resetForm</el-button>
    <el-button class='opration-top' @click='changeRenderType'>rendertype</el-button>
    <template v-for='operation in operations'>
      <my-button v-if='operation.isShow' :operation='operation' :key='operation.id' @click='clickButton'/>
    </template>
    <p class='form-title'>{{view.title}}</p>
    <el-form :model="formModel" v-if='view.isShow' ref='form' class='form-content' show-message label-width="100px" validate-on-rule-change style='width: 1200px'>
      <el-row :gutter='gutter'>
        <el-col v-for='(item, index) in columns' v-if='item.isShow' :key='index' :span='item.isFull?24:12' :push='0'>
          <el-form-item  :label="item.label + ' : '" :prop='item.columnProp' :rules='item.rules' class='form-item'>
            <input-adapt v-if='item.renderType==="form"' v-model='formModel[item.columnProp]' :column='item' class='form-input'></input-adapt>
            <detail-form-item v-else :model='formModel[item.columnProp]' :column='item' />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- <template v-if='view.subView'>
      <my-form v-for='subView in view.subView' :key='subView.id' :view='subView' ref='subforms'/>
    </template> -->
    <div v-if='view.subView'>
      <div v-for='subView in view.subView' :key='subView.id'>
        <el-dialog :title='subView.title' :visible.sync="subView.isShow" width='80%' v-if='subView.isDialog'>
          <my-form :view='subView' ref='subforms'/>
          <span slot="footer">
            <el-button @click="subView.isShow = false">取 消</el-button>
          </span>
        </el-dialog>
        <my-form :view='subView' ref='subforms' v-else/>
      </div>
      <!-- <my-form v-for='subView in view.subView' :key='subView.id' :view='subView' ref='subforms'/> -->
    </div>
  </div>
</template>

<script>
import inputAdapt from '~input/input-adapt'
import MyButton from '~common/button'
import detailFormItem from '~input/detail-form-item'
import Column from '~rules/column'
export default {
  name: 'MyForm',
  components: {
    inputAdapt,
    detailFormItem,
    MyButton,
  },
  props: {
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
      operations: this.view.operations,
      gutter: 30,
    }
  },
  computed: {
  },
  methods: {
    validateAll() {
      let formValidate = new Promise((resolve, reject) => {
        setTimeout(() => {
          if(!this.$refs.form) {
            return resolve()
          }
          this.$refs.form.validate((valid) => {
            if (valid && this.formModel) {
              resolve();
            } else {
              reject(false);
            }
          });
        }, 2500)
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
            if (valid && this.formModel) {
              resolve();
            } else {
              reject(false);
            }
          });
        }, 2500)
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
    validateTest() {
      this.validate().then(() => {
        console.log(`form-->(${this.view.title})校验成功`)
      }).catch(() => {
        console.log(`form-->(${this.view.title})校验失败`)
      })
    },
    changeRenderType() {
      this.view.columns.forEach(column => {
        column.renderType = column.renderType === 'form' ? 'table' : 'form'
      })
    },
    clickButton(operation) {
      operation.triggerClick(this)
      // operation.clickHandler()(this).then(() => {
      //   console.log('外部调用成功')
      //   return Promise.resolve(true)
      // }).catch(err => {
      //   console.log('外部调用失败', err)
      //   return Promise.resolve(false)
      // }).then(status => {
      //   console.log('操作结果：', status)
      // })
    }
  },
  mounted() {
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
  .form-wrap{
    // width: 1200px;
    margin-top: 50px;
    background-color: #a39c9c10;
    .opration-top {
      // text-align: left;
    }
    .form-title {
      font-family: STHeitiSC-Medium;
      font-size: 18px;
      color: #2f3748;
      // background: #fcfdff;
      line-height: 43px;
      height: 43px;
      // padding-left: 20px;
      // border-bottom: solid 1px #f1f1f1;
      // text-align: left
    }
    .form-content {
      max-width: 100%;
      // padding: 20px 20px 0 0;
      background-color: rgba(201, 196, 196, 0.24);
      font-family: STHeitiSC-Medium;
      font-size: 14px;
      color: #a39c9c;
      .form-item {
        background-color: #bfc6d446;
        .form-input {
          // background-color: #2f374846;
        }
      }
    }
  }
</style>


