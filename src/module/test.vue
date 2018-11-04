<template>
  <div>
    <my-form v-if='!loading' :view='view' />
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
import View from "~rules/view";
import viewData from './view-data'
import formModelData from './form-model-data'

export default {
  components: {
    // MySelect,
    MyRadio,
    // MyCheckbox,
    // MyWeekPicker,
    // DateAdapt,
    // InputAdapt,
    MyForm
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
    }, 1000);
  }
};
</script>

