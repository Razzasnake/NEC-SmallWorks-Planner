<template>
  <AccountComponent
    v-if="user"
    :user="user"
  />
</template>
<script lang='ts'>
import { Component } from "vue-property-decorator";
import AccountComponent from "@/components//Account/Account.vue";
import _View from "./_View";
import driveState from "@/store/driveStore";

/**
 * Account page with billing
 */
@Component({
  components: {
    AccountComponent,
  },
})
export default class Account extends _View {
  private get user() {
    return driveState.user;
  }
  protected activated() {
    super.activated({
      title: "Table & Map - Account",
      content: "",
    });
  }
}
</script>