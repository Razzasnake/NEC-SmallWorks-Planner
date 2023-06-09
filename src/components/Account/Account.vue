<template>
  <div v-if="user">
    <div class="section">
      <div class="feature">
        <v-img
          :src="imageUrl"
          class="image"
        />
        <div class="user-info">
          <h4 class="text-h4">
            {{ name }}
          </h4>
          <div class="text-subtitle-1">
            {{ email }}
          </div>
          <div class="text-subtitle-2">
            {{ numberFiles }} / {{ availableFiles }} files
          </div>
        </div>
        <v-divider class="margin-top-large margin-bottom-large" />
        <h4 class="text-h4 align-center margin-bottom-large">
          Pricing
        </h4>
        <div class="align-center margin-bottom-large">
          <v-btn
            :disabled="!manageBillingUrl"
            @click="openBilling"
          >
            Manage billing
          </v-btn>
        </div>
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
	name: "Account",
	components: {
	Tiers
	},
	})
	export default class Account extends Vue {
	/**
	* The logged in user
	*/
	@Prop({ default: null })
	private user!: gapi.auth2.GoogleUser | null;
	/**
	* The number of files uploaded by this user
	*/
	@Prop({ default: 1 })
	private numberFiles!: number;
	/**
	* The user accounts tier
	*/
	@Prop({ default: 1 })
	private tier!: number;
	/**
	* Manage Billing Url
	*/
	@Prop({ default: null })
	private manageBillingUrl!: string;

	private get availableFiles() {
	return "Unlimited";
	}

	private get name() {
	if (this.user) {
	return this.user.getBasicProfile().getName();
	}
	return null;
	}

	private get email() {
	if (this.user) {
	return this.user.getBasicProfile().getEmail();
	}
	return null;
	}

	private get imageUrl() {
	if (this.user) {
	return this.user.getBasicProfile().getImageUrl();
	}
	return null;
	}

	private openBilling() {
	window.open(this.manageBillingUrl, "_self");
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
