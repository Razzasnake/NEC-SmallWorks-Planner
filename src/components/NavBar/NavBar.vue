<template>
  <v-app-bar dense color="primary" app>
    <v-app-bar-nav-icon v-if="drawerAllowed" @click.stop="toggleDrawer" color="white"></v-app-bar-nav-icon>
    <a @click="jumpTo({ name: 'Home' })">
      <v-toolbar-title class="white--text">Table &amp; Map</v-toolbar-title>
    </a>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn text color="white" @click="jumpTo({ name: 'Features' })">Features</v-btn>
      <v-btn text color="white" @click="jumpTo({ name: 'Examples' })">Examples</v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";

/**
 * Navigation Bar at the top of the website to navigate between sections
 */
@Component({
  components: {}
})
export default class NavBar extends Vue {
  @Prop({ type: Boolean, default: false})
  private drawerAllowed!: boolean

  private jumpTo(location: { name: string }) {
    /**
     * User wants to jump to a different location
     *
     * @type {{location: {name: string}}}
     */
    this.$emit("jumpTo", location);
  }

  private toggleDrawer() {
    /**
     * Either open or close the drawer
     */
    this.$emit("toggleDrawer");
  }
}
</script>