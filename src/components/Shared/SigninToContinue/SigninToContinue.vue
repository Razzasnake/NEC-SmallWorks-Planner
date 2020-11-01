<template>
  <div class="align-center section">
    <h4 class="text-h4">
      You need to <a
        href="javascript:void(0);"
        @click="signIn"
      >sign in</a> to
      continue.
    </h4>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

/**
 * Display when the content needs the user to sign in
 */
@Component({
  name: "SharedSigninToContinue",
  components: {},
})
export default class SigninToContinue extends Vue {
  private signIn() {
    const el = document.getElementById("google-signin-button");
    if (el) {
      const child = el.children[0] as HTMLElement;
      child.click();
    }
  }
}
</script>