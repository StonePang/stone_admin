<template>
  <div>
    <p>test page</p>
    <my-select v-model='model' :placeholder="placeholder" :options='options' :multiple='multiple'></my-select>
  </div>
</template>

<script>
import MySelect from '~input/select'
export default {
  components: {
    MySelect,
  },
  data() {
    return {
      model: null,
      placeholder: 'select',
      multiple: true,
      options: [{
        value: 'value_1',
        label: 'label_1',
      },{
        value: 'value_2',
        label: 'label_2',
      },{
        value: 'value_3',
        label: 'label_3',
      }]
    }
  },
  watch: {
    model(val) {
      console.log('watch model', val)
    }
  }
}
</script>

