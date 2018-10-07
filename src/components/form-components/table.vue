<template>
  <div>
    <!-- 列表按钮模块 -->
    <div class='btn-top'>
      <pui-btn heightStr="34px" padding="0 20px" class='pui-list-grid__oper'  @click='clickToInsertPage'>创建</pui-btn>
      <pui-btn heightStr="34px" padding="0 20px" class='pui-list-grid__oper' :loading='loading.enable' @click='changeStatus("ENABLE")'>启用</pui-btn>
      <pui-btn heightStr="34px" padding="0 20px" class='pui-list-grid__oper' :loading='loading.disable' @click='changeStatus("DISABLE")'>禁用</pui-btn>
    </div>
    <!-- 提示选择条数模块 -->
    <!-- <div class='choose-item'> 
      <div v-if='chooseRowNum>0'>
        <i class="el-icon-warning"></i>
        已选择{{chooseRowNum}}条
      </div>
    </div> -->

    <el-table class='table' ref="table" :data="formModel" tooltip-effect="dark" style="width: 100%" empty-text="暂无数据" stripe v-loading='loading.table' :row-key='getRowKey' @selection-change="handleSelectionChange" @sort-change="handleSortChange">
      <!-- 勾选 -->
      <el-table-column type="selection" width="55" align='center' reserve-selection>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column prop="operations" label="操作" width="55" fixed="left" align='center'>
        <template slot-scope="scope">
          <el-popover ref="popover1" placement="bottom-start" popper-class="pui-list-grid_popover" trigger="hover">
            <ul>
              <li v-for="(item, index) in operation" :key="index" class="pui-list-grid__oper-in-row-item" @click="handleButtonClick(item.type, scope.$index)">
                {{item.label}}
              </li>
            </ul>
          </el-popover>
          <i class="pui-icon-fenlei" @click.stop v-popover:popover1></i>
        </template>
      </el-table-column>
      <!-- 列表内容 -->
      <el-table-column v-for='item in formData' :prop="item.prop" :label="item.label" :key='item.prop' :sortable='item.sortable||false' :formatter='item.formatter' show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <pagenation class='pagenation' style="margin:30px 0;"  @page='pageChange' :totalRecord='pageData.totalRecord' :currentPage='pageData.pageNow' :size='pageData.pageSize'></pagenation>
  </div>

</template>
<script>
import pagenation from "./pagination/pagination";
import date from "paas-web-utils/common/date";
import mixin from "../mixin/mixin";
import { taskService, moduleService } from "paas-web-utils/services";
export default {
  mixins: [mixin],
  components: {
    pagenation
  },
  props: {
    search: {
      type: Object
    }
    // name: String
  },
  data() {
    return {
      loading: {
        table: false,
        enable: false,
        disable: false,
      },
      order: null,
      sidx: null,
      multipleSelection: [],
      pageData: {
        totalRecord: 0,
        pageNow: 1,
        pageSize: 10
      },
      moduleMap: {},
      operation: [
        {
          label: "修改",
          type: "UPDATE"
        },
        {
          label: "删除",
          type: "DELETE"
        }
      ],
      formData: [
        {
          prop: "name",
          label: "任务名称",
          sortable: "custom"
        },
        {
          prop: "moduleId",
          label: "所属模块",
          sortable: "custom",
          formatter: (row, column, cellValue) => {
            return this.moduleMap[cellValue] || cellValue;
          }
        },
        {
          prop: "status",
          label: "状态",
          sortable: "custom",
          formatter: (row, column, cellValue) => {
            let t = {
              ENABLE: "启用",
              DISABLE: "禁用"
            };
            return t[cellValue];
          }
        },
        {
          prop: "tiggerType",
          label: "触发类型",
          sortable: "custom",
          formatter: (row, column, cellValue) => {
            let t = {
              ADD: "新增数据",
              UPDATE: "更新数据",
              DELETE: "删除数据",
              CRON: "指定时间"
            };
            return t[cellValue] || cellValue;
          }
        },
        {
          prop: "createTime",
          label: "创建时间",
          sortable: "custom",
          formatter: (row, column, cellValue) => {
            let t = this.formatDate(cellValue)
            return cellValue === "" ? "" : t;
          }
        },
        {
          prop: "description",
          label: "描述",
          sortable: "custom"
        }
      ],
      formModel: []
      // {
      //   name: "",
      //   moduleId: "11",
      //   status: "",
      //   triggerTime: "",
      //   createdTime: "",
      //   description: ""
      // }
    };
  },
  watch: {
    search() {
      // console.log('watch search')
      this.findAllInPage({
        pageNow: 1
      });
    },
    orderData() {
      this.findAllInPage({
        pageNow: 1
      });
    }
  },
  computed: {
    chooseRowNum() {
      return this.multipleSelection.length;
    },
    orderData() {
      return {
        order: this.order,
        sidx: this.sidx
      };
    }
  },
  methods: {
    getRowKey(row) {
      return row.id;
    },
    // 时间处理，补全0
    formatDate(unix) {
      let format = (string) => {
        let n = Number(string)
        if(n < 10) {
          return `0${n}`
        }
        return String(n)
      }
      let t = date.format(unix);
      let d = t.split(' ')[0]
      let time = t.split(' ')[1]
      let year = d.split('-')[0]
      let month = format(d.split('-')[1])
      let day = format(d.split('-')[2])
      let hour = format(time.split(':')[0])
      let min = format(time.split(':')[1])
      let second = format(time.split(':')[2])
      let r = `${year}-${month}-${day} ${hour}:${min}:${second}`
      return r
    },
    changeStatus(status) {
      if (this.multipleSelection.length === 0) {
        return;
      }
      let message = status === "ENABLE" ? "启用" : "禁用";
      let sta = status === "ENABLE" ? 'enable' : 'disable'
      this.ableMessage(message, () => {
        let taskIds = this.multipleSelection.map(item => {
          return item.id;
        });
        this.loading[sta] = true
        return taskService
          .changeStatusByTaskIds({
            taskIds,
            status,
          })
          .then(data => {
            this.formModel.forEach(f => {
              if (this.multipleSelection.indexOf(f) >= 0) {
                f.status = status;
              }
            });
            this.$refs.table.clearSelection();
            this.loading[sta] = false
          })
          .catch(() => {
            this.loading[sta] = false
          })
      });
    },
    clickToInsertPage() {
      this.$router.push({
        name: "insertTask"
      });
    },
    handleSelectionChange(val) {
      // console.log("multipleSelection before", this.multipleSelection);
      this.multipleSelection = val;
      // console.log("multipleSelection after", this.multipleSelection);
    },
    handleSortChange({ column, prop, order }) {
      if (order === "ascending") {
        this.order = "asc";
      } else if (order === "descending") {
        this.order = "desc";
      } else {
        this.order = order;
      }
      this.sidx = prop;
      // console.log("handleSortChange", column, prop, order);
    },
    handleButtonClick(type, index) {
      // console.log("opration", type, index);
      if (type === "UPDATE") {
        this.updateItem(index);
      } else if (type === "DELETE") {
        this.deleteItem(index);
      }
    },
    deleteItem(index) {
      this.deleteMessage(() => {
        let taskId = this.formModel[index].id;
        //TODO:调删除一条的接口
        taskService
          .delete({
            taskId
          })
          .then(data => {
            this.formModel.splice(index, 1);
          });
      });
    },
    updateItem(index) {
      let taskId = this.formModel[index].id;
      this.$router.push({
        name: "insertTask",
        query: {
          taskId
        }
      });
    },
    pageChange(data) {
      let type = data.type;
      let pageSize = data.pageSize;
      let pageNow;
      if (type === "page") {
        pageNow = data.pageNow;
      } else if (type === "size") {
        pageNow = 1;
      }
      this.findAllInPage({
        pageSize,
        pageNow
      });
    },
    findAllInPage({
      pageNow = this.pageData.pageNow <= 0 ? 1 : this.pageData.pageNow,
      pageSize = this.pageData.pageSize <= 0 ? 1 : this.pageData.pageSize,
      order = this.orderData.order,
      sidx = this.orderData.sidx
    }) {
      this.loading.table = true;
      return taskService
        .findAllInPage({
          moduleId: this.search.moduleId,
          name: this.search.name,
          status: this.search.status,
          pageNow,
          pageSize,
          order,
          sidx
        })
        .then(data => {
          this.loading.table = false;
          this.pageData.pageNow = data.currentPage;
          this.pageData.pageSize = data.pageSize;
          this.pageData.totalRecord = data.totalRecord;
          this.formModel = data.record;
        });
    }
  },
  mounted() {
    moduleService
      .findModules({})
      .then(data => {
        let map = {};
        data.forEach(d => {
          map[d.id] = d.moduleName;
        });
        this.moduleMap = map;
      })
      .then(() => {
        return this.findAllInPage({});
      });
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/mixins/mixins";
@import "~theme/mixins/utils";
@import "~theme/common/var";
@import "~theme/icon";

.pui-list-grid__oper {
  display: inline-block;
  line-height: 34px;
  padding: 0 15px !important;
  color: $--color-primary !important;
  padding: 0 20px;
  font-size: $--font-size-base;
  &:hover {
    background-color: $--color-primary;
    color: $--color-white !important;
  }
}
.choose-item {
  height: 30px;
  line-height: 30px;
  margin: 5px 0;
  .el-icon-warning {
    color: #26b7ae;
  }
}
.table {
  margin-top: 15px;
}
.pui-list-grid__oper-in-row-item {
  padding: 5px 10px;
  margin: 0 -12px;
  line-height: 24px;
  box-sizing: border-box;
  &:hover {
    // background-color: $--color-primary;
    background-color: #e5f9f7;
    cursor: pointer;
    // color: $--color-white;
  }
  .pui-icon-fenlei {
    cursor: pointer;
    color: #c0cada;
    position: relative;
  }
  // .pagenation {
  //   margin: 30px 0;
  // }
}

//表格样式
.tablelist /deep/ {
  .el-table__header thead th {
    background: #fff;
    height: 50px;
  }
  .el-table th.is-leaf,
  .el-table td {
    border-bottom: none;
  }
  .el-table tr {
    // box-shadow: inset 0px -1px 0px 0px #E5EBF4, inset 0px 1px 0px 0px #E5E3F4;
    box-shadow: none;
  }
  .el-table__header {
    border-top: 1px solid #e5ebf4;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid #e5ebf4;
  }
  .el-table__header thead th .cell {
    color: #909399;
    font-weight: bold;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #f7f7f7;
  }
}

//表格中的操作样式
.pui-icon-fenlei {
  cursor: pointer;
  color: #c0cada;
  // position: relative;
}
</style>
