<template>
  <div>
    <MapYourExcelLocationalData />
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import MapYourExcelLocationalData from "../MapYourExcelLocationalData/MapYourExcelLocationalData.vue";

/**
 * Display all the features that Table & Map has
 */
@Component({
  components: {
    MapYourExcelLocationalData
  }
})
export default class Features extends Vue {}
</script>
<style lang='scss' scoped>
</style>