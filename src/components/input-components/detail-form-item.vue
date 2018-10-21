<template>
  <span v-html='column.showValue'></span>
</template>

<script>
export default {
  props: {
    model: {
      required: true
    },
    column: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  watch: {
    model(val) {
      this.column.triggerChange(val)
    }
  },
  created() {
  }
}
</script>

