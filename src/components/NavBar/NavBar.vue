<template>
  <b-navbar fixed-top transparent class="is-primary">
    <template slot="brand">
      <b-navbar-item @click="jumpTo({ name: 'Home' })">
        <span>Table &amp; Map</span>
      </b-navbar-item>
    </template>
    <template slot="end">
      <b-navbar-item @click="jumpTo({ name: 'Features' })">
        <span>Features</span>
      </b-navbar-item>
      <b-navbar-item @click="jumpTo({ name: 'Examples' })">
        <span>Examples</span>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import state from "@/store/userStore";

/**
 * Navigation Bar at the top of the website to navigate between sections
 */
@Component({
  components: {}
})
export default class NavBar extends Vue {
  private jumpTo(location: { name: string }) {
    /**
     * User wants to jump to a different location
     *
     * @type {{location: {name: string}}}
     */
    this.$emit("jumpTo", location);
  }
}
</script>
<style lang='scss' scoped>
.navbar-item {
  font-weight: bold;
}
</style>