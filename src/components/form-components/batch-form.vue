<template>
    <!-- 表格 ？？？？校验-->
    <el-form  label-position="left" label-width="0" class='form-content' :model="{formModel}" ref='form' :show-message='false' validate-on-rule-change	>
    <!-- <el-form-item :label="formData.title"> -->
      <!-- 表格主体 -->
      <el-table :data="formModel" style="width: 100%" stripe border empty-text="暂无数据" @row-click='actionRowClick'>
        <!-- 索引序号 -->
        <el-table-column type="index" :index="indexMethod" label="序号" width="55" fixed="left" align='center'>
        </el-table-column>
        <!-- 表格内容 -->
        <template v-for='(item, index) in formData.head'>
          <el-table-column :prop="item.prop" :label="item.label" :key='item.prop' header-align='center'>
            <template slot-scope="scope">
              <form-column :item='item' :form-data='formData' :row-index="scope.$index" :form-model='formModel' :head-index='index'></form-column>
            </template>
          </el-table-column>
        </template>
        <!-- 新增/删除按钮列 -->
        <el-table-column width="75" fixed="right" :render-header="renderHeader" align="center" label='operation'>
          <template slot-scope="scope">
            <el-button type="text" size="large" icon="el-icon-delete" @click="deleteData(scope.$index)" :disabled='formModel.length<=minLen'></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- </el-form-item> -->
    </el-form>
</template>

<script>
import inputAdapt from './inputAdapt'
import mixin from '../mixin/mixin'
export default {
  name:'stepForm',
  mixins: [mixin],
  components: {
    inputAdapt,
    FormColumn: {
      name: 'formColumn',
      // props: ['item', 'rowIndex', 'formData', 'formModel', 'headIndex'],
      props: {
        item: Object,
        rowIndex: Number,
        formData: Object,
        formModel: Array,
        headIndex: Number,
      },
      components: {
        inputAdapt,
      },
      computed: {
        //关联校验规则
        rules() {
          // let rules = this.formData.rules[this.tableProp]
          let rules = JSON.parse(JSON.stringify(this.formData.rules[this.tableProp]))
          let prop = this.tableProp
          let formModelRow = this.formModel[this.rowIndex]
          let source = this.item.source
          let result = rules
          if(!source) {
            // console.log(result)
            return result
          }
          // 增加配置的规则，关联其他输入框的值
          source.forEach(s => {
            let sourceProp = s.sourceProp
            let inputType = s.inputType
            let sourceValue = s.sourceValue
            if(s.rules && formModelRow[sourceProp] === sourceValue) {
              result = [...result, ...s.rules]
            }
          })
          // console.log(result)
          return result
        },
        itemProp() {
          return `formModel.${this.rowIndex}.${this.tableProp}`;
        },
        tableProp() {
          return this.item.prop
        },
        itemLabel() {
          return this.item.label
        },
        showTableValue() {
          if(!this.item.formatter) {
            return this.formModel[this.rowIndex][this.tableProp]
          }
          return this.item.formatter(this.formModel[this.rowIndex][this.tableProp])
        },
        //输入类型关联其他输入框的值
        inputType() {
          if(!this.item.source) {
            return this.item.type
          }
          let formModelRow = this.formModel[this.rowIndex]
          let source = this.item.source
          let result = this.item.type
          source.forEach(s => {
            let sourceProp = s.sourceProp
            let inputType = s.inputType
            let sourceValue = s.sourceValue
            if(inputType && formModelRow[sourceProp] === sourceValue) {
              result = inputType
            }
          })
          return result
        }
      },
      watch: {
        inputType(newVal, oldVal) {
          // console.log('watch inputType')
          this.formModel[this.rowIndex][this.tableProp] = ''
        },
        rules(newVal, oldVal) {
          //不能正确拿到newVal和oldVal,取消此部清空
          // this.formModel[this.rowIndex][this.tableProp] = ''
        }
      },
      render(h) {
        let itemConfig = {
          props: {
            // label: this.itemLabel,
            prop: this.itemProp,
            rules: this.rules,
            // formatter: this.formData.head[this.headIndex].formatter,
          },
          style: {
            "margin-bottom": "0px",
          }
        };
        let adaptiveConfig = {
          props: {
            // type: this.item.type,
            type: this.inputType,
            placeholder: this.item.placeholder,
            value: this.formModel[this.rowIndex][this.tableProp],
            options: this.formData.head[this.headIndex].options,
            filterable: this.item.filterable,
            changeEvent: this.item.changeEvent,
            visibleChange: this.item.visibleChange,
            choose: this.item.choose,
          },
          on: {
            input: value => {
              this.formModel[this.rowIndex][this.tableProp] = value
            }
          }
        };
        if(this.formData.showType === 'FORM') {
          return (
            <el-form-item {...itemConfig}>
              <input-adapt {...adaptiveConfig}></input-adapt>
            </el-form-item>
          );
        } else if(this.formData.showType === 'TABLE') {
          return (
            <el-form-item {...itemConfig} align='center' class='pointer'>
              {this.showTableValue}
            </el-form-item>
          );
        }
      }
    }
  },
  props: {
    formData: {
      type: Object,
      required: true, 
    },
    rowDelete: {
      type: Function,
      default: (index) => {
        // console.log('delete row default',index)
      }
    },
    value: Array,
    required: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      dialogVisiable: false,

    }
  },
  computed: {
    formModel: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      }
    },
    minLen() {
      return this.formData.minLen || 0
    },
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    renderHeader(h) {
      if(this.formData.showType === 'TABLE') {
        return (<span>操作</span>)
      }else if(this.formData.showType === 'FORM'){
        return (
          <span>
            <el-button
              size="medium"
              type="text"
              icon="el-icon-plus"
              onClick={this.insertData}
              style="padding:0 20px"
            />
          </span>
        );
      }
    },
    defaultFormData(defaultVal='') {
      let defaultObj = {}
      this.formData.head.forEach(e => {
        let prop = e.prop
        defaultObj[prop] = defaultVal
      })
      return defaultObj
    },

    insertData() {
      let defaultData = this.defaultFormData()
      this.formModel.push(defaultData)
    },
    deleteData(index) {
      this.deleteMessage(() => {
        this.formModel.splice(index, 1)
        this.rowDelete(index)
      })
    },
    actionRowClick(row, event, column, index) {
      if(this.formData.showType !== 'TABLE' || column.label === 'operation') {
        return
      }
      this.$emit('table-row-click', {
        row, 
        event, 
        column, 
        index,
      })
    },
    validate() {
      //form table均会校验
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          setTimeout(() =>{
            if (valid && this.formModel) {
              let result = {}
              result[this.formData.formName] = this.formModel
              // console.log('step form result ', result)
              resolve(result);
            } else {
              // console.log('error', this.formData)
              let title = this.formData.title
              reject(title);
            }
          });
        });
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
    },

  },
}
</script>

<style lang="scss" scoped>
  .step-form{
    // padding: 20px 20px 0 0;
    box-sizing: border-box;
    width: 100%;
    .form-title {
      width: 100px;
      height: 40px;
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      box-sizing: border-box;
      .required-tag {
        color: #f56c6c;
        margin-right: 4px;     
      }
    }
    .form-content {
      margin-left: 100px;
      // border: solid 1px #f1f1f1;
    }
  }
  .pointer {
    cursor: pointer;
  }
</style>


