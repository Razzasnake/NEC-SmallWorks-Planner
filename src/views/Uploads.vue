<template>
  <div>{{ user }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { getUser } from "@/store/userStore";
import User from "@/entities/User";

@Component({
  components: {}
})
export default class Uploads extends Vue {
  private user: User | null = null;
  private async created() {
    this.user = await getUser();
  }
}
</script>
<style lang="scss" scoped>
</style>
