<template>
  <b-navbar fixed-top transparent class="is-light">
    <template slot="brand">
      <b-navbar-item>
        <a @click="jumpTo({ name: 'Home' })">Table &amp; Map</a>
      </b-navbar-item>
    </template>
    <template slot="end">
      <b-navbar-item>
        <a v-if="authenticated" @click="jumpTo({ name: 'Uploads' })">Uploads</a>
        <a v-else @click="jumpTo({ name: 'Examples' })">Examples</a>
      </b-navbar-item>
      <b-navbar-item>
        <b-button v-if="!authenticated" @click="signUp">Coming soon</b-button>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import state, { updateSignUpModalVisible } from "@/store/userStore";

/**
 * Navigation Bar at the top of the website to navigate between sections
 */
@Component({
  components: {}
})
export default class NavBar extends Vue {
  private get authenticated(): boolean {
    return state.isAuthenticated;
  }

  private jumpTo(location: { name: string }) {
    /**
     * User wants to jump to a different location
     *
     * @type {{location: {name: string}}}
     */
    this.$emit("jumpTo", location);
  }

  private signUp() {
    updateSignUpModalVisible(true);
  }
}
</script>
<style lang='scss' scoped>
</style>