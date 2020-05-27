<template>
  <div class="modal is-active" v-if="modalVisible">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Coming Soon</p>
        <button class="delete" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <div class="margin-medium">
          <b>Features in development:</b>
          <div v-for="(s, index) in comingSoon" :key="index">
            <div>&bull; {{ s }}</div>
          </div>
        </div>
        <div
          class="margin-bottom-medium"
        >Subscribe to our mailing list and receive emails when new features are available.</div>
        <div class="field">
          <label class="label">Email</label>
          <input
            class="input"
            type="email"
            placeholder="Enter email address"
            id="email-input"
            v-model="email"
          />
        </div>
        <button
          class="button is-primary is-fullwidth"
          @click="submitEmail"
          :disabled="!isValid"
        >Subscribe</button>
      </section>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import mailingListApi from "@/api/mailingList";
import state, { updateSignUpModalVisible } from "@/store/userStore";

/**
 * Sign In/Sign Out button for okta
 */
@Component({
  components: {}
})
export default class SignUp extends Vue {
  private email: string = "";
  private comingSoon = [
    "User accounts",
    "Shareable public links to your datasets",
    "Geocoding services for files missing latitudes and longitudes",
    "Additional examples"
  ];

  private get isValid() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.email.toLowerCase());
  }

  private get modalVisible(): boolean {
    return state.signUpModalVisible;
  }

  @Watch("modalVisible")
  private async modalVisibleChanged() {
    await this.$nextTick();
    const el = document.getElementById("email-input");
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
    if (event.keyCode === 13 && this.isValid) {
      this.submitEmail();
    }
  }

  private async submitEmail() {
    mailingListApi
      .subscribe(this.email)
      .then(() => {
        this.$buefy.toast.open({
          message: "Subscribed!",
          type: "is-success"
        });
      })
      .finally(() => {
        this.close();
      });
  }

  private close() {
    this.email = "";
    updateSignUpModalVisible(false);
  }

  private beforeDestroy() {
    this.close();
  }
}
</script>
<style lang='scss' scoped>
</style>