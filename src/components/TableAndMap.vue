<template>
  <TableAndMap></TableAndMap>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TableAndMap from '@/storybook/TableAndMap/TableAndMap.vue'

@Component({
  components: {
    TableAndMap
  }
})
export default class TableAndMapComponent extends Vue {
}
</script>
<style scoped lang="scss">

</style>
