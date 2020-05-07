<template>
  <div>
    <div slot="trigger">
      <b-button v-if="authenticated" @click="logout">Logout</b-button>
      <b-button v-else @click="login">Login</b-button>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

/**
 * Sign In/Sign Out button for okta
 */
@Component({
  components: {}
})
export default class SignInSignOut extends Vue {
  private authenticated: boolean = false;

  @Watch("$route")
  private async isAuthenticated() {
    this.authenticated = await this.$auth.isAuthenticated();
  }

  private created() {
    this.isAuthenticated();
  }

  private async logout() {
    await this.$auth.logout();
    await this.isAuthenticated();
    this.$router.push({ path: "/" });
  }

  private login() {
    this.$auth.loginRedirect();
  }
}
</script>
<style lang='scss' scoped>
</style>