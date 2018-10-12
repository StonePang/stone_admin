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
    };
  },
  computed: {
  },
  watch: {
  },
  methods: {
  },
  mounted() {
    setTimeout(() => {
      let view = new View(this.viewData)
      this.view = view
      this.loading = false
      console.log(this.view)
    }, 1000);
  }
};
</script>

