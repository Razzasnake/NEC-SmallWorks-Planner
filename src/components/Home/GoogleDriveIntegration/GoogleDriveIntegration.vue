<template>
  <div class="google-drive-integration">
    <template v-if="$vuetify.breakpoint.xs">
      <v-img :src="require('@/assets/google_drive_logo.png')"></v-img>
      <div class="text-h6 margin-medium" v-for="(s, index) in steps" :key="index">
        <div class="google-drive-circle margin-right-small">{{ index + 1 }}</div>
        {{ s }}
      </div>
    </template>
    <template v-else>
      <v-row>
        <v-col>
          <div class="text-h6 margin-medium" v-for="(s, index) in steps" :key="index">
            <div class="google-drive-circle margin-right-small">{{ index + 1 }}</div>
            {{ s }}
          </div>
        </v-col>
        <v-col cols="5" style="margin: auto;">
          <v-img :src="require('@/assets/google_drive_logo.png')"></v-img>
        </v-col>
      </v-row>
    </template>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

/**
 * Explain the google drive integration
 */
@Component({
  components: {},
})
export default class GoogleDriveIntegration extends Vue {
  private steps = [
    "Sign in with your Google account",
    "Upload your files",
    "Apply filters, draw shapes and upload shapefiles",
    "Everything is saved to your Google Drive",
    "View and revist your uploads under Uploads",
  ];
}
</script>
<style lang='scss' scoped>
.google-drive-circle {
  border: 2px solid;
  width: calc(2rem + 4px);
  border-radius: 50%;
  text-align: center;
  display: inline-block;
}
@media (max-width: 1215px) {
  .google-drive-integration {
    width: 100%;
  }
}
</style>