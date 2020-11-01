<template>
  <div class="full-height">
    <AccountComponent
      v-if="loggedIn"
      :user="user"
      :tier="tier"
      :number-files="numberFiles"
    />
    <SigninToContinue v-else-if="loggedIn === false" />
  </div>
</template>
<script lang='ts'>
import { Component } from "vue-property-decorator";
import AccountComponent from "@/components//Account/Account.vue";
import _View from "./_View";
import driveState from "@/store/driveStore";
import SigninToContinue from "@/components/Shared/SigninToContinue/SigninToContinue.vue";

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

  protected activated() {
    super.activated({
      title: "Table & Map - Account",
      content: "",
    });
  }
}
</script>