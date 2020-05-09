<template>
  <b-modal :active="modalVisible" :on-cancel="close" has-modal-card trap-focus>
    <form class="sign-in card" id="sign-in-form" action="#">
      <div v-if="error" class="help is-danger error">Invalid username or password</div>
      <b-field label="Email">
        <b-input type="email" v-model="form.username" expanded></b-input>
      </b-field>
      <b-field label="Password">
        <b-input type="password" v-model="form.password" password-reveal expanded></b-input>
      </b-field>
      <b-button class="is-primary" expanded @click="loginUser">Sign In</b-button>
    </form>
  </b-modal>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import state, { login, updateSignInModalVisible } from "@/store/userStore";

/**
 * Sign In/Sign Out button for okta
 */
@Component({
  components: {}
})
export default class SignInSignOut extends Vue {
  private form = { username: "", password: "" };
  private error: Error | null = null;

  private get modalVisible(): boolean {
    return state.signInModalVisible;
  }

  @Watch("modalVisible")
  private async modalVisibleChanged() {
    await this.$nextTick();
    const el = document.getElementById("sign-in-form");
    if (el) {
      if (this.modalVisible) {
        el.addEventListener("keyup", this.onEnter);
      } else {
        el.removeEventListener("keyup", this.onEnter);
      }
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
        this.close();
      })
      .catch((error: Error) => {
        this.error = error;
      });
  }

  private close() {
    this.error = null;
    updateSignInModalVisible(false);
  }

  private beforeDestroy() {
    this.close();
  }
}
</script>
<style lang='scss' scoped>
.sign-in {
  padding: 1rem;
  .error {
    text-align: center;
    padding-bottom: 1rem;
    font-weight: bold;
  }
}
</style>