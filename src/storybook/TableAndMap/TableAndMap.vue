<template>
  <div>
    <Map></Map>
    <Table></Table>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import Map from '@/storybook/Map/Map.vue'
import Table from '@/storybook/Table/Table.vue'

@Component({
  components: {
    Map,
    Table
  }
})
export default class TableAndMap extends Vue {

}
</script>
<style lang='scss' scoped>

</style>
