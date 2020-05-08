<template>
  <div>
    <b-button v-if="authenticated" @click="logoutUser">Logout</b-button>
    <template v-else>
      <b-dropdown class="is-right">
        <b-button slot="trigger" class="is-primary">Sign in</b-button>
        <form class="sign-in" id="sign-in-form">
          <div v-if="error" class="help is-danger error">Invalid username or password</div>
          <b-field label="Email">
            <b-input type="email" v-model="form.username" expanded></b-input>
          </b-field>
          <b-field label="Password">
            <b-input type="password" v-model="form.password" password-reveal expanded></b-input>
          </b-field>
          <b-button class="is-primary" expanded @click="loginUser">Login</b-button>
        </form>
      </b-dropdown>
    </template>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import state, { login, logout } from "@/store/userStore";

/**
 * Sign In/Sign Out button for okta
 */
@Component({
  components: {}
})
export default class SignInSignOut extends Vue {
  private form = { username: "", password: "" };
  private error: Error | null = null;

  private get authenticated(): boolean {
    return state.isAuthenticated;
  }

  private mounted() {
    const el = document.getElementById("sign-in-form");
    if (el) {
      el.addEventListener("keyup", this.onEnter);
    }
  }

  private onEnter(event: KeyboardEvent) {
    event.preventDefault();
    if (event.keyCode === 13) {
      this.loginUser();
    }
  }

  private loginUser() {
    login(this.form)
      .then(() => {
        this.error = null;
      })
      .catch((error: Error) => {
        this.error = error;
      });
  }

  private async logoutUser() {
    await logout();
  }

  private beforeDestroy() {
    const el = document.getElementById("sign-in-form");
    if (el) {
      el.removeEventListener("keyup", this.onEnter);
    }
  }
}
</script>
<style lang='scss' scoped>
.sign-in {
  padding: 0.375rem 1rem;
  min-width: 300px;
  .error {
    text-align: center;
    padding-bottom: 0.375rem;
    font-weight: bold;
  }
}
</style>