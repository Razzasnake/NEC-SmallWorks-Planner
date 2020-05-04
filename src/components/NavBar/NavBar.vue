<template>
  <nav class="navbar is-fixed-top is-light">
    <div class="navbar-brand">
      <div class="navbar-item">
        <a @click="goHome">Table &amp; Map</a>
      </div>
      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navMenu"
        @click="burgerClicked"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu" id="navMenu">
      <div class="navbar-start">
        <div class="navbar-item" v-if="inAnalysis">
          <FileOption @updateSettings="updateSettings"></FileOption>
        </div>
        <div class="navbar-item" v-if="inAnalysis">
          <ViewOption :viewOptions="viewOptions" @updateViewOptions="updateViewOptions"></ViewOption>
        </div>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <a @click="goExamples">Examples</a>
        </div>
      </div>
    </div>
  </nav>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import FileOption from "@/components/NavBar/Options/FileOption/FileOption.vue";
import ViewOption from "@/components/NavBar/Options/ViewOption/ViewOption.vue";

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

  private burgerClicked(): void {
    const burgers = document.querySelectorAll(".navbar-burger");
    const navmenu = document.querySelectorAll(".navbar-menu");
    burgers.forEach(burger => {
      burger.classList.toggle("is-active");
    });
    navmenu.forEach(nav => {
      nav.classList.toggle("is-active");
    });
  }

  private goHome() {
    /**
     * User wants to go back to the home page
     */
    this.$emit("goHome");
  }

  private goExamples() {
    /**
     * User wants to view the examples section
     */
    this.$emit("goExamples");
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
</style>