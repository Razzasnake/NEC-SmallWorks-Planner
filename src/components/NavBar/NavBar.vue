<template>
  <div>
    <div v-if="drawerAllowed">
      <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
        <NavigationDrawer />
      </v-navigation-drawer>
    </div>
    <v-app-bar dense color="primary" app :clipped-left="$vuetify.breakpoint.lgAndUp">
      <v-app-bar-nav-icon v-if="drawerAllowed" @click.stop="toggleDrawer" color="#eeeeee"></v-app-bar-nav-icon>
      <a @click="jumpTo({ name: 'Home' })">
        <v-toolbar-title class="appbar-title">Table &amp; Map</v-toolbar-title>
      </a>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu offset-y v-if="$vuetify.breakpoint.xs">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon color="#eeeeee" v-bind="attrs" v-on="on" aria-label="More Options">
              <v-icon>{{ mdiDotsVertical }}</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="jumpTo({ name: 'Features' })">
              <v-list-item-title>Features</v-list-item-title>
            </v-list-item>
            <v-list-item @click="jumpTo({ name: 'Examples' })">
              <v-list-item-title>Examples</v-list-item-title>
            </v-list-item>
            <Login mobile @jumpTo="jumpTo" />
          </v-list>
        </v-menu>
        <template v-else>
          <v-btn text color="#eeeeee" @click="jumpTo({ name: 'Features' })">Features</v-btn>
          <v-btn text color="#eeeeee" @click="jumpTo({ name: 'Examples' })">Examples</v-btn>
          <Login @jumpTo="jumpTo" />
        </template>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import NavigationDrawer from "./NavigationDrawer.vue";
import { mdiDotsVertical } from "@mdi/js";
import Login from "./Login/Login.vue";
import { signOut } from "@/store/driveStore";

/**
 * Navigation Bar at the top of the website to navigate between sections
 */
@Component({
  components: {
    Login,
    NavigationDrawer,
  },
})
export default class NavBar extends Vue {
  @Prop({ type: Boolean, default: false })
  private drawerAllowed!: boolean;
  private drawer: boolean | null = null;
  private mdiDotsVertical = mdiDotsVertical;

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

  private signOut() {
    signOut();
  }
}
</script>
<style lang="scss" scoped>
.appbar-title {
  color: #eeeeee;
}
</style>