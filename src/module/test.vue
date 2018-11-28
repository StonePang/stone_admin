<template>
  <div>
    <!-- <my-form v-if='!loading' :view='view' /> -->
    <!-- <batch-form v-if='!loading' :view='view' /> -->
    <el-button @click="validateAll">validateAll</el-button>
    <form-adapt v-if='!loading' :view='view' ref='form'/>
  </div>
</template>

<script>
// import dateUtil from "~utils/date";
// import MySelect from "~input/select";
import MyRadio from "~input/radio";
// import MyCheckbox from "~input/checkbox";
// import MyWeekPicker from "~input/week-picker";
// // import DateAdapt from "~input/date-adaptive";
// import DateAdapt from "~input/date-adapt";
// import InputAdapt from "~input/input-adapt";
import MyForm from "~form/form";
import BatchForm from "~form/batch-form";
import FormAdapt from "~form/form-adapt";
import View from "~rules/view";
import BatchView from "~rules/batch-view";
import viewData from '~admin/column/view-data'
// import viewData from './view-data'
import columnDataMap from './column-data-map'
// import formModelData from './form-model-data'
import formModelData from '~admin/column/form-model'
import viewRuleData from './viewRule-data-map'

export default {
  components: {
    // MySelect,
    MyRadio,
    // MyCheckbox,
    // MyWeekPicker,
    // DateAdapt,
    // InputAdapt,
    MyForm,
    BatchForm,
    FormAdapt,
  },
  data() {
    return {
      view: null,
      loading: true,
      viewData: viewData,
      formModelData: formModelData,
    };
  },
  computed: {
  },
  watch: {
    view() {
      console.warn(`view: watch change`)
    }
  },
  methods: {
    validateAll() {
      return this.$refs.form.validateAll()
    }
  },
  mounted() {
    setTimeout(() => {
      let view = new View(this.viewData, this.formModelData)
      this.view = view
      this.loading = false


      // this.view.addEventListener('created', view => {
      //   console.log('hahaha created', view)
      //   // view.triggerEvent('disabledView', true)
      // })
      // this.view.addEventListener('update', view => {
      //   console.log('hahaha update', view)
      // })
      // this.view.columns.forEach(column => {
      //   column.addEventListener('update', column => {
      //     console.log('column update', column)
      //   })
      //   column.addEventListener('created', column => {
      //     console.log('column created', column)
      //   })
      // })

    // let viewData = {
    //   id: 11,
    //   isShow: true,
    //   formType: 'batchForm',
    //   // formType: 'mainForm',
    //   title: '批量表',
    //   code: 'batchForm',
    //   columnData: [
    //     columnDataMap.input,
    //     columnDataMap.select,
    //     columnDataMap.checkbox,
    //     columnDataMap.datetime,
    //   ],
    //   viewRuleData: [
    //     viewRuleData['1'],
    //     viewRuleData['2'],
    //   ],
    //   subView: [
    //     viewData
    //   ]
    // }
    // // let formModelDatas = undefined
    // let formModelDatas = {
    //   input: null,
    //   select: null,
    //   checkbox: null,
    //   datetime: null
    // }
    // let batchView = new BatchView(viewData, formModelDatas)
    // // let batchView = new View(viewData, formModelDatas)
    // console.log('/////////////////', batchView)
    // this.view = batchView
    // this.loading = false

    }, 1000);
  }
};
</script>

