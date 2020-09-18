<template>
  <div>
    <div v-if="drawerAllowed">
      <v-navigation-drawer
        v-model="drawer"
        :clipped="$vuetify.breakpoint.lgAndUp"
        app
      >
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on"
                  >
                    <a
                      v-if="fileWebViewLink"
                      :href="fileWebViewLink"
                      target="_blank"
                    >{{ fileName }}</a>
                    <span v-else>{{ fileName }}</span>
                  </span>
                </template>
                <span>{{ fileName }}</span>
              </v-tooltip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <NavigationDrawer />
      </v-navigation-drawer>
    </div>
    <v-app-bar
      dense
      color="primary"
      app
      :clipped-left="$vuetify.breakpoint.lgAndUp"
    >
      <v-app-bar-nav-icon
        v-if="drawerAllowed"
        color="#eeeeee"
        @click.stop="toggleDrawer"
      />
      <a @click="jumpTo({ name: 'Home' })">
        <v-toolbar-title class="appbar-title">Table & Map</v-toolbar-title>
      </a>
      <v-spacer />
      <v-toolbar-items>
        <v-btn
          v-if="loggedIn"
          text
          color="#eeeeee"
          @click="jumpTo({ name: 'Uploads' })"
        >
          Uploads
        </v-btn>
        <Login @jumpTo="jumpTo" />
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import NavigationDrawer from "./NavigationDrawer.vue";
import Login from "./Login/Login.vue";
import state from "@/store/exploreStore";
import driveState from "@/store/driveStore";

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
  /**
   * Whether or not to display the drawer
   */
  @Prop({ type: Boolean, default: false })
  private drawerAllowed!: boolean;
  private drawer: boolean | null = null;

  private get loggedIn() {
    return driveState.user !== null;
  }

  private get fileName() {
    if (state.uploadedFile) {
      if (state.uploadedFile.fileName.indexOf(".") > -1) {
        const fileNameArr = state.uploadedFile.fileName.split(".");
        return fileNameArr.slice(0, fileNameArr.length - 2).join(".") + ".csv";
      }
      return state.uploadedFile.fileName;
    }
    return "";
  }

  private get fileWebViewLink() {
    if (state.uploadedFile) {
      const file = driveState.files.find(
        (file) => file.name === state.uploadedFile!.fileName
      );
      if (file) {
        return file.webViewLink;
      }
    }
    return null;
  }

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
     * @type {{ name: string }}
     */
    this.$emit("jumpTo", location);
  }

  private toggleDrawer() {
    this.drawer = !this.drawer;
  }
}
</script>
<style lang="scss" scoped>
.appbar-title {
  color: #eeeeee;
}
a {
  text-decoration: none;
}
</style>