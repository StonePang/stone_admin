<template>
  <div>
    <!-- <template v-for='operation in operations'>
      <my-button v-if='operation.isShow' :operation='operation' :key='operation.id' @click='clickButton'/>
    </template> -->
    <p class='form-title'>{{view.title}}</p>
    <el-form  label-position="left" label-width="0" class='form-content' :model="{formModel:view.formModel}" ref='form' show-message validate-on-rule-change	>
      <!-- 表格主体 -->
      <el-table :data="view.formModel" style="width: 100%" stripe border empty-text="暂无数据" @row-click='actionRowClick'>
        <!-- 索引序号 -->
        <el-table-column type="index" :index="indexMethod" label="序号" width="55" fixed="left" align='center'>
        </el-table-column>
        <!-- 表格内容 -->
        <template v-for='(column, index) in view.tableColumns'>
          <el-table-column v-if='column.isShow' :prop="column.columnProp" :key='column.columnProp + index' header-align='center' :render-header="(h)=>renderLable(h, column)">
            <template slot-scope="scope">
              <el-form-item :rules='columnInBatchRow(scope.$index, column.columnProp).rules' :prop='formItemProp(scope.$index, column.columnProp)' :key='formItemProp(scope.$index, column.columnProp)'>
                <input-adapt v-if='columnInBatchRow(scope.$index, column.columnProp).renderType==="form"' :column='columnInBatchRow(scope.$index, column.columnProp)' 
                  v-model='batchRows[scope.$index].formModel[column.columnProp]' :key='column.columnProp+scope.$index'></input-adapt>
                <detail-form-item v-else :column='columnInBatchRow(scope.$index, column.columnProp)' :model='batchRows[scope.$index].formModel[column.columnProp]'/>
              </el-form-item>
            </template>
          </el-table-column>
        </template>
        <!-- 新增/删除按钮列 -->
        <el-table-column width="75" fixed="right" :render-header="renderHeader" align="center" label='operation'>
          <template slot-scope="scope">
            <el-button type="text" size="large" icon="el-icon-delete" @click="deleteData(scope.$index)" :disabled='false'></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import inputAdapt from '~input/input-adapt'
import detailFormItem from '~input/detail-form-item'
import date from '~utils/date'
import columnDataMap from '../../module/column-data-map'
import BatchView from '~rules/batch-view'

export default {
  name:'BatchForm',
  // mixins: [mixin],
  components: {
    inputAdapt,
    detailFormItem,
  },
  props: {
    view: {
      type: Object,
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    console.log('haha', this.view)
  },
  computed: {
    batchRows() {
      return this.view.batchRows
    },
    operations() {
      return this.view.operations
    }
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    tableColumnKey(prop) {
      let key =  prop + date.now().unix
      console.log('key', key)
      return key
    },
    renderHeader(h) {
      if(this.view.renderType === 'table') {
        return (<span>操作</span>)
      }else if(this.view.renderType === 'form'){
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
    renderLable(h, column) {
      if (column.required) {
        return (
          <span>
            <font style="color: red;font-weight: 700;">* </font>
            {column.label}
          </span>
        );
      }
      return <span>{column.label}</span>;
    },

    formItemProp(index, prop) {
      return `formModel.${index}.${prop}`;
    },
    columnInBatchRow(index, prop) {
      return this.batchRows[index].columnMap[prop]
    },
    valueInBatchRow(index, prop) {
      return this.batchRows[index].formModel[prop]
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
      // let defaultData = this.defaultFormData()
      console.log(`添加一行`)
      // this.view.insertBatchRow()
      this.view.triggerEvent('insertBatchRow')
      // this.view.triggerEvent('clearFormModel')
      // this.view.triggerEvent('disabledChange', true)
      // this.view.triggerEvent('changeRender', 'table')
    },
    deleteData(index) {
      console.log('删除一行')
      // this.view.deleteBatchRow(index)
      this.view.triggerEvent('deleteBatchRow', index)
    },
    actionRowClick(row, event, column, index) {
      // if(this.formData.showType !== 'TABLE' || column.label === 'operation') {
      //   return
      // }
      // this.$emit('table-row-click', {
      //   row, 
      //   event, 
      //   column, 
      //   index,
      // })
    },
    validate() {
      //form table均会校验
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid, msg) => {
          setTimeout(() =>{
            if (valid) {
              // let result = {}
              // result[this.formData.formName] = this.formModel
              resolve(valid);
            } else {
              // console.log('error', this.formData)
              let title = this.view.title
              reject(`批量表单--(${title})--校验未通过`, msg);
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
      overflow-x: auto;
      // border: solid 1px #f1f1f1;
    }
  }
  .pointer {
    cursor: pointer;
  }
</style>


