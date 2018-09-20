<template>
  <div>
    <p>test page</p>
    <!-- <my-select v-model='model' :placeholder="placeholder" :options='options' :multiple='multiple'></my-select>
    <my-radio v-model='model' :options='options'></my-radio> -->
    <my-checkbox v-model='model' :options='options'></my-checkbox>
  </div>
</template>

<script>
import MySelect from '~input/select'
import MyRadio from '~input/radio'
import MyCheckbox from '~input/checkbox'
export default {
  components: {
    MySelect,
    MyRadio,
    MyCheckbox
  },
  data() {
    return {
      model: [1,2, 'value_1'],
      placeholder: 'select',
      multiple: false,
      options: [{
        value: 'value_1',
        label: 'label_1',
      },{
        value: '',
        label: 'label_2',
      },{
        value: 'value_3',
        label: 'label_3',
        disabled: true,
      }]
    }
  },
  watch: {
    model(val) {
      console.log('watch model', val)
    }
  },
  mounted() {
    // setTimeout(() => {
    //   this.model = [2,5]
    // }, 2000)
  }
}
</script>

