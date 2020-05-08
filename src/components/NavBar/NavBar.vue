<template>
  <b-navbar shadow fixed-top>
    <template slot="brand">
      <div class="navbar-item">
        <a @click="jumpTo({ name: 'Home' })" class="logo">
          <div>Table &amp; Map</div>
        </a>
      </div>
    </template>
    <template slot="start">
      <div class="navbar-item" v-if="inAnalysis">
        <FileOption @updateSettings="updateSettings"></FileOption>
      </div>
      <div class="navbar-item" v-if="inAnalysis">
        <ViewOption :viewOptions="viewOptions" @updateViewOptions="updateViewOptions"></ViewOption>
      </div>
    </template>
    <template slot="end">
      <div class="navbar-item">
        <a v-if="authenticated" @click="jumpTo({ name: 'Uploads' })">Uploads</a>
        <a v-else @click="jumpTo({ name: 'Examples' })">Examples</a>
      </div>
      <div class="navbar-item">
        <SignInSignOut />
      </div>
    </template>
  </b-navbar>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import FileOption from "@/components/NavBar/Options/FileOption/FileOption.vue";
import ViewOption from "@/components/NavBar/Options/ViewOption/ViewOption.vue";
import SignInSignOut from "@/components/NavBar/Options/SignInSignOut/SignInSignOut.vue";
import { RawLocation } from "vue-router";
import state from "@/store/userStore";

/**
 * Navigation Bar at the top of the website to navigate between sections
 */
@Component({
  components: {
    FileOption,
    ViewOption,
    SignInSignOut
  }
})
export default class NavBar extends Vue {
  /**
   * Whether or not the user is in an anlysis or not
   */
  @Prop({ default: true })
  private inAnalysis!: boolean;
  /**
   * The current view settings
   */
  @Prop({ default: () => ["table", "map"] })
  private viewOptions!: string[];

  private get authenticated(): boolean {
    return state.isAuthenticated;
  }

  private jumpTo(location: RawLocation) {
    /**
     * User wants to jump to a different location
     */
    this.$emit("jumpTo", location);
  }

  private updateSettings() {
    /**
     * Update the setttings of this file
     */
    this.$emit("updateSettings");
  }

  private updateViewOptions(viewOptions: string[]) {
    this.viewOptions = viewOptions;
    /**
     * Notify the parent to modify what is in view
     *
     * @type {string[]}
     */
    this.$emit("updateViewOptions", viewOptions);
  }
}
</script>
<style lang='scss' scoped>
.logo {
  display: flex;
  align-items: center;
  img {
    margin-right: 10px;
  }
}
</style>