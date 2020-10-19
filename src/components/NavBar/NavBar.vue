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
                <template #activator="{ on, attrs }">
                  <DoubleClickEditText
                    v-model="fileName"
                    v-bind="attrs"
                    v-on="on"
                  />
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
      <router-link
        v-if="$router"
        to="/"
      >
        <v-toolbar-title class="appbar-title">
          Table & Map
        </v-toolbar-title>
      </router-link>
      <a
        v-else
        href="/"
      >
        <v-toolbar-title class="appbar-title">Table & Map</v-toolbar-title>
      </a>
      <v-spacer />
      <v-menu
        v-if="$vuetify.breakpoint.smAndUp"
        bottom
        offset-y
        open-on-hover
      >
        <template #activator="{ on, attrs }">
          <v-btn
            color="#eeeeee"
            text
            v-bind="attrs"
            v-on="on"
          >
            Learn<v-icon>{{ mdiMenuDown }}</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/features">
            <v-list-item-title>Features</v-list-item-title>
          </v-list-item>
          <v-list-item to="/examples">
            <v-list-item-title>Examples</v-list-item-title>
          </v-list-item>
          <v-list-item to="/pricing">
            <v-list-item-title>Pricing</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-toolbar-items>
        <v-btn
          v-if="loggedIn && $router"
          text
          color="#eeeeee"
          to="/uploads"
        >
          Uploads
        </v-btn>
        <v-btn
          v-else-if="loggedIn"
          text
          color="#eeeeee"
          href="/uploads"
        >
          Uploads
        </v-btn>
        <Login />
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import NavigationDrawer from "./NavigationDrawer.vue";
import Login from "./Login/Login.vue";
import state from "@/store/exploreStore";
import driveState, { renameFile } from "@/store/driveStore";
import { mdiMenuDown, mdiLink } from "@mdi/js";
import DoubleClickEditText from "@/components/Shared/DoubleClickEditText/DoubleClickEditText.vue";

/**
 * Navigation Bar at the top of the website to navigate between sections
 */
@Component({
  components: {
    Login,
    NavigationDrawer,
    DoubleClickEditText,
  },
})
export default class NavBar extends Vue {
  /**
   * Whether or not to display the drawer
   */
  @Prop({ type: Boolean, default: false })
  private drawerAllowed!: boolean;
  private drawer: boolean | null = null;
  private mdiMenuDown = mdiMenuDown;
  private mdiLink = mdiLink;

  private get loggedIn() {
    return driveState.user !== null;
  }

  private get fileName() {
    if (state.uploadedFile) {
      if (state.uploadedFile.fileName.indexOf(".") > -1) {
        return state.uploadedFile.fileName.split(".").slice(0, -2).join(".");
      }
      return state.uploadedFile.fileName;
    }
    return "";
  }

  private set fileName(newValue: string) {
    const rename = state.uploadedFile!.fileName.replace(
      this.fileName,
      newValue
    );
    const file = driveState.files.find(
      (file) => file.name === state.uploadedFile!.fileName
    )!;
    const configFile = driveState.files.find(
      (_) => _.name === `${file.name}.json`
    )!;
    const geojsonFile = driveState.files.find(
      (_) => _.name === `${file.name}.geojson.json`
    );
    const configFileName = configFile.name!.replace(file.name!, rename);
    renameFile(configFile.id!, configFileName);
    if (geojsonFile) {
      const geojsonFileName = geojsonFile.name!.replace(file.name!, rename);
      renameFile(geojsonFile.id!, geojsonFileName);
    }
    const fileName = file.name!.replace(file.name!, rename);
    renameFile(file.id!, fileName);
    if (state.uploadedFile) {
      state.uploadedFile.fileName = newValue;
    }
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
