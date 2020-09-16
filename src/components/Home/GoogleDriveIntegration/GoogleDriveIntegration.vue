<template>
  <div class="google-drive-integration">
    <template v-if="$vuetify.breakpoint.xs">
      <v-img :src="require('@/assets/google_drive_logo.png')"></v-img>
      <div class="text-h6 margin-medium" v-for="(f, index) in features" :key="index">
        <div class="google-drive-circle margin-right-small">{{ index + 1 }}</div>
        {{ f }}
      </div>
    </template>
    <template v-else>
      <v-row>
        <v-col>
          <div class="text-h6 margin-medium" v-for="(f, index) in features" :key="index">
            <div class="google-drive-circle margin-right-small">{{ index + 1 }}</div>
            {{ f }}
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
  private features = [
    "Fully integrated with Google Drive",
    "Visualize your datasets from anywhere on any device.",
    "All uploaded files are saved to your Google Drive automatically.",
    "Your data is secure in Google's servers.",
  ];
}
</script>
<style lang='scss' scoped>
.google-drive-circle {
  border: 2px solid #424242;
  width: calc(2rem + 4px);
  border-radius: 50%;
  text-align: center;
  display: inline-block;
}

.google-drive-integration {
  width: 1215px;
  margin: auto;
  color: #424242;
}
@media (max-width: 1215px) {
  .google-drive-integration {
    width: 100%;
  }
}
</style>