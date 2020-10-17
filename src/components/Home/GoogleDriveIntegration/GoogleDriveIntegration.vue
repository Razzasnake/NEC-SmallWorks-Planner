<template>
  <div>
    <template v-if="$vuetify.breakpoint.xs">
      <v-img :src="require('@/assets/google_drive_logo.png')" />
      <h6
        v-for="(s, index) in steps"
        :key="index"
        class="text-h6 margin-medium"
      >
        <div class="google-drive-circle margin-right-small">
          {{ index + 1 }}
        </div>
        {{ s }}
      </h6>
    </template>
    <template v-else>
      <v-row>
        <v-col>
          <h6
            v-for="(s, index) in steps"
            :key="index"
            class="text-h6 margin-medium"
          >
            <div class="google-drive-circle margin-right-small">
              {{ index + 1 }}
            </div>
            {{ s }}
          </h6>
        </v-col>
        <v-col
          cols="5"
          class="auto-margin"
        >
          <v-img :src="require('@/assets/google_drive_logo.png')" />
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
    "Share with co-workers or revist at a later time",
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
.auto-margin {
  margin: auto;
}
</style>