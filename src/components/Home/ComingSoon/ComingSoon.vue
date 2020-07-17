<template>
  <InfoSection :title="title" :description="description" :cards="cards">
    <template slot="extra">
      <div class="field">
        <label class="label">
          Subscribe to our mailing list and become a beta tester.
          <input
            class="input"
            type="email"
            placeholder="Enter email address"
            id="email-input"
            v-model="email"
          />
        </label>
      </div>
      <button
        class="button is-primary is-fullwidth"
        @click="submitEmail"
        :disabled="!isValid"
      >Subscribe</button>
      <v-snackbar v-model="snackbar" color="success" top rounded="pill">
        <div class="align-center">Subscribed!</div>
      </v-snackbar>
    </template>
  </InfoSection>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import mailingListApi from "@/api/mailingList";
import InfoSection from "../InfoSection/InfoSection.vue";

/**
 * Display the features that are coming soon and try to entice people to become a beta tester.
 */
@Component({
  components: {
    InfoSection
  }
})
export default class ComingSoon extends Vue {
  private title: string = "Coming Soon";
  private description: string =
    "Table & Map is in beta and new features are being released every week.";
  private cards = [
    {
      title: "User Accounts",
      description:
        "Upload your datasets once and see them in the tool each time you log in."
    },
    {
      title: "Public Links",
      description: "Share your dataset with friends and coworkers."
    },
    {
      title: "Embeddable",
      description: "Embed our tool on your website for your users to enjoy."
    }
  ];
  private email: string = "";
  private snackbar: boolean = false;

  private get isValid() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.email.toLowerCase());
  }

  private async mounted() {
    const el = document.getElementById("email-input");
    if (el) {
      el.addEventListener("keyup", this.onEnter);
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
        this.snackbar = true;
      })
      .finally(() => {
        this.close();
      });
  }

  private close() {
    this.email = "";
    const el = document.getElementById("email-input");
    if (el) {
      el.removeEventListener("keyup", this.onEnter);
    }
  }

  private beforeDestroy() {
    this.close();
  }
}
</script>
<style lang='scss' scoped>
</style>