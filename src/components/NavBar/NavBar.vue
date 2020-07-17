<template>
  <v-app-bar dense color="primary" app>
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
import { Component, Vue } from "vue-property-decorator";

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