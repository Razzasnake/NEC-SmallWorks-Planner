<template>
  <div class="modal is-active" v-if="modalVisible">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Sign In</p>
        <button class="delete" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <div v-if="error" class="help is-danger error">Invalid username or password</div>
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" type="email" v-model="form.username" />
          </div>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input class="input" type="password" v-model="form.passowrd" />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-fullwidth is-primary" @click="loginUser">Sign In</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
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
.error {
  text-align: center;
  font-weight: bold;
}
</style>