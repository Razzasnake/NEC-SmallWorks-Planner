<template>
  <div>
    <b-button slot="trigger" class="is-primary" @click="modalVisible = true">Sign up</b-button>
    <b-modal :active.sync="modalVisible" has-modal-card trap-focus>
      <div class="sign-up card">
        <div class="title">Coming Soon</div>
        <div class="subtitle">User accounts are currently in development.</div>
        <div class="coming-soon">
          <b>Other features in development:</b>
          <div v-for="(s, index) in comingSoon" :key="index">
            <div>&bull; {{ s }}</div>
          </div>
        </div>
        <div
          class="mailing-list"
        >Subscribe to our mailing list and receive emails when new features are available.</div>
        <b-field label="Email">
          <b-input
            type="email"
            v-model="email"
            expanded
            placeholder="Enter email address"
            id="email-input"
          ></b-input>
        </b-field>
        <b-button class="is-primary" expanded @click="submitEmail" :disabled="!isValid">Subscribe</b-button>
      </div>
    </b-modal>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import mailingListApi from "@/api/mailingList";

/**
 * Sign In/Sign Out button for okta
 */
@Component({
  components: {}
})
export default class SignUp extends Vue {
  private email: string = "";
  private modalVisible: boolean = false;
  private comingSoon = [
    "User accounts",
    "Shareable public links to your datasets",
    "Geocoding services for files missing latitudes and longitudes",
    "Additional examples"
  ];

  private get isValid() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmail = re.test(this.email.toLowerCase());
    return isEmail;
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
        this.email = "";
        this.modalVisible = false;
      });
  }

  private beforeDestroy() {
    this.modalVisible = false;
  }
}
</script>
<style lang='scss' scoped>
.sign-up {
  padding: 1rem;
  max-width: 550px;
  .coming-soon {
    margin: 1rem;
  }
  .mailing-list {
    margin-bottom: 1rem;
  }
}
</style>