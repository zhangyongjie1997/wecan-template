<template lang="pug">
  #container.container Hello {{bundler}}!
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      bundler: 'Parcel'
    }
  }
})
</script>

<style lang="less" scoped>
.container {
  color: green;
}
</style>