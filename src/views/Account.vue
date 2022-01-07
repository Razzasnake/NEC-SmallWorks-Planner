<template>
  <div class="full-height">
    <AccountComponent
      v-if="loggedIn"
      :user="user"
      :tier="tier"
      :number-files="numberFiles"
      :manage-billing-url="manageBillingUrl"
    />
    <SigninToContinue v-else-if="loggedIn === false" />
  </div>
</template>
<script lang='ts'>
import { Component, Watch } from "vue-property-decorator";
import AccountComponent from "@/components//Account/Account.vue";
import _View from "./_View";
import driveState from "@/store/driveStore";
import SigninToContinue from "@/components/Shared/SigninToContinue/SigninToContinue.vue";
import lambdaApi from "@/api/lambda";

/**
 * Account page with billing
 */
@Component({
  name: "ViewsAccount",
  components: {
    AccountComponent,
    SigninToContinue
  },
})
export default class Account extends _View {
  private get loggedIn() {
    return driveState.loggedIn;
  }

  private get user() {
    return driveState.user;
  }

  private get tier() {
    return driveState.tier;
  }

  private get numberFiles() {
    return driveState.files.filter(r => r.name!.endsWith(".csv")).length;
  }

  private manageBillingUrl: string | null = null;

  protected activated() {
    super.activated({
      title: "Table & Map - Account",
      content: "",
    });
    this.updateManageBillingUrl();
  }

  @Watch("user")
  private updateManageBillingUrl() {
    if (this.user) {
      lambdaApi.getCustomerPortal(this.user.getBasicProfile().getEmail(), `${process.env.VUE_APP_BASE_URL}/account`).then((url) => {
        this.manageBillingUrl = url;
      })
    }
  }
}
</script>