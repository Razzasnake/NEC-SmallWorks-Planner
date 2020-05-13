<template>
  <div>
    <b-navbar fixed-top transparent>
      <template slot="brand">
        <b-navbar-item>
          <a @click="jumpTo({ name: 'Home' })">Table &amp; Map</a>
        </b-navbar-item>
      </template>
      <template slot="start">
        <FileOption v-if="inAnalysis" @updateSettings="updateSettings"></FileOption>
        <ViewOption
          v-if="inAnalysis"
          :viewOptions="viewOptions"
          @updateViewOptions="updateViewOptions"
        ></ViewOption>
      </template>
      <template slot="end">
        <b-navbar-item>
          <a v-if="authenticated" @click="jumpTo({ name: 'Uploads' })">Uploads</a>
          <a v-else @click="jumpTo({ name: 'Examples' })">Examples</a>
        </b-navbar-item>
        <b-navbar-item>
          <div class="buttons">
            <!-- <div class="margin-right-8">
              <b-button v-if="authenticated" @click="logoutUser">Logout</b-button>
              <b-button v-else @click="signIn">Sign in</b-button>
            </div> -->
            <b-button v-if="!authenticated" @click="signUp">Coming soon</b-button>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import FileOption from "@/components/NavBar/Options/FileOption/FileOption.vue";
import ViewOption from "@/components/NavBar/Options/ViewOption/ViewOption.vue";
import state, {
  logout,
  updateSignInModalVisible,
  updateSignUpModalVisible
} from "@/store/userStore";

/**
 * Navigation Bar at the top of the website to navigate between sections
 */
@Component({
  components: {
    FileOption,
    ViewOption
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

  private jumpTo(location: { name: string }) {
    /**
     * User wants to jump to a different location
     *
     * @type {{location: {name: string}}}
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
    /**
     * Notify the parent to modify what is in view
     *
     * @type {string[]}
     */
    this.$emit("updateViewOptions", viewOptions);
  }

  private signIn() {
    updateSignInModalVisible(true);
  }

  private async logoutUser() {
    await logout();
  }

  private signUp() {
    updateSignUpModalVisible(true);
  }
}
</script>
<style lang='scss' scoped>
.navbar {
  background-color: #fafafa;
  .margin-right-8 {
    margin-right: 8px;
  }
}
</style>