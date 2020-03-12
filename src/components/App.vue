<template>
  <div class="app-component">
    <UploadWorkflow></UploadWorkflow>
    <TableAndMap></TableAndMap>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import UploadWorkflow from '@/storybook/UploadWorkflow/UploadWorkflow.vue'
import TableAndMap from '@/storybook/Views/TableAndMap/TableAndMap.vue'

@Component({
  components: {
    UploadWorkflow,
    TableAndMap
  }
})
export default class AppComponent extends Vue {
}
</script>
<style lang="scss" scoped>

</style>
