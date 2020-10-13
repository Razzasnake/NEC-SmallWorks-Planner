<template>
  <div>
    <div class="content section">
      <div class="feature">
        <v-img
          :src="imageUrl"
          class="image"
        />
        <div class="user-info">
          <div class="text-h4">
            {{ name }}
          </div>
          <div class="text-subtitle-1">
            {{ email }}
          </div>
        </div>
        <v-divider class="margin-top-large margin-bottom-large" />
        <h4 class="text-h4 align-center margin-bottom-large">
          Pricing
        </h4>
        <Tiers />
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import Tiers from "@/components/Pricing/Tiers/Tiers.vue";

/**
 * Account page with billing
 */
@Component({
  components: {
    Tiers
  },
})
export default class Account extends Vue {
  /**
   * The logged in user
   */
  @Prop()
  private user!: gapi.auth2.GoogleUser;

  private get name() {
    return this.user.getBasicProfile().getName();
  }

  private get email() {
    return this.user.getBasicProfile().getEmail();
  }

  private get imageUrl() {
    return this.user.getBasicProfile().getImageUrl();
  }
}
</script>
<style lang='scss' scoped>
.feature {
  max-width: 1215px;
  margin: auto;
  .image {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    display: inline-block;
  }
  .user-info {
    margin-left: 24px;
    display: inline-block;
  }
}
</style>