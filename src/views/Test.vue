<template>
  <div>{{ user }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class HomeView extends Vue {
  private user = null;
  private async created() {
    this.user = await this.$auth.getUser();
  }
}
</script>
<style lang="scss" scoped>
</style>
