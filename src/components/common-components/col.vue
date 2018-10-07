<template>
  <div :class='{half: !isFull, full: isFull}' style='{"min-width": "370px"}'>
    <slot></slot>
    <!-- <div v-if='isHalf || isFull' class='clear'></div> -->
  </div>
</template>
<script>
export default {
  props: {
    isFull: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    // isHalf() {
    //   return !this.isFull
    // },
    // isFull() {
    //   return this.isFull
    // },
    // isinline() {
    //   return this.status === 'inline'
    // }
  }
}
</script>
<style lang="scss" scoped>
  .half {
    float: left;
    width: 50%;
  }
  .full {
    float: left;
    width: 100%;
    min-width: 100%;
  }
  .inline{
    display: inline-block;
    vertical-align: middle;
    text-align: center;        

  }
  // .clear {
  //   clear: both;
  // }
</style>

