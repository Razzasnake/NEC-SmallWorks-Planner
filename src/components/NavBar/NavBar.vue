<template>
  <div>
    <div v-if="drawerAllowed">
      <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
        <NavigationDrawer />
      </v-navigation-drawer>
    </div>
    <v-app-bar dense color="primary" app :clipped-left="$vuetify.breakpoint.lgAndUp">
      <v-app-bar-nav-icon v-if="drawerAllowed" @click.stop="toggleDrawer" color="white"></v-app-bar-nav-icon>
      <a @click="jumpTo({ name: 'Home' })">
        <v-toolbar-title class="white--text">Table &amp; Map</v-toolbar-title>
      </a>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu offset-y v-if="$vuetify.breakpoint.xs">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon color="white" v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="jumpTo({ name: 'Features' })">
              <v-list-item-title>Features</v-list-item-title>
            </v-list-item>
            <v-list-item @click="jumpTo({ name: 'Examples' })">
              <v-list-item-title>Examples</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <template v-else>
          <v-btn text color="white" @click="jumpTo({ name: 'Features' })">Features</v-btn>
          <v-btn text color="white" @click="jumpTo({ name: 'Examples' })">Examples</v-btn>
        </template>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import NavigationDrawer from "./NavigationDrawer.vue";

/**
 * Navigation Bar at the top of the website to navigate between sections
 */
@Component({
  components: {
    NavigationDrawer,
  },
})
export default class NavBar extends Vue {
  @Prop({ type: Boolean, default: false })
  private drawerAllowed!: boolean;
  private drawer: boolean | null = null;

  @Watch("drawerAllowed")
  private drawerAllowedUpdated() {
    if (!this.drawerAllowed) {
      this.drawer = null;
    }
  }

  private jumpTo(location: { name: string }) {
    /**
     * User wants to jump to a different location
     *
     * @type {{location: {name: string}}}
     */
    this.$emit("jumpTo", location);
  }

  private toggleDrawer() {
    this.drawer = !this.drawer;
  }
}
</script>