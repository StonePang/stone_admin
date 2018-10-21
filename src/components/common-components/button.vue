<template>
  <el-button
    :disabled='operation.disabled'
    :loading='operation.loading'
    :type='operation.displayType'
    :size='operation.size'
    :round='false'
    @click='clickButton'
  >
    {{operation.label}}
  </el-button>
</template>
<script>
export default {
  props: {
    operation: {
      type: Object,
    }
  },
  methods: {
    clickButton() {
      this.$emit('click', this.operation)
    }
  }
}
</script>
