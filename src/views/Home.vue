<template>
  <div class="home">
    <TableAndMap />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TableAndMap from '@/components/TableAndMap.vue'

@Component({
  components: {
    TableAndMap
  }
})
export default class Home extends Vue {
}
</script>
