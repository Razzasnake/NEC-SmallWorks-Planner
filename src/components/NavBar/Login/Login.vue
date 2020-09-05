<template>
  <div class="login">
    <div v-show="loggedOut" id="google-signin-button"></div>
    <v-menu v-if="!loggedOut && !mobile" offset-y>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" x-small fab color="#eeeeee">
          <div class="first-letter">{{ userFirstLetter }}</div>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="signOut">
          <v-list-item-title>Sign out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-list-item v-else-if="mobile && !loggedOut" @click="signOut">
      <v-list-item-title>Sign out</v-list-item-title>
    </v-list-item>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import state, { signIn, signOut } from "@/store/driveStore";

/**
 * Login/Logout of Google
 */
@Component({
  components: {},
})
export default class Login extends Vue {
  @Prop({ type: Boolean, default: false })
  private mobile!: boolean;

  private get loggedOut() {
    return state.user === null;
  }

  private get userFirstLetter() {
    if (state.user) {
      return state.user.getBasicProfile().getName().slice(0, 1);
    }
    return null;
  }

  private mounted() {
    signIn("google-signin-button");
  }

  private signOut() {
    signOut();
  }
}
</script>
<style lang="scss" scoped>
.login {
  position: relative;
  top: 7px;
  .first-letter {
    font-size: 18px;
    color: #37474f;
  }
}
</style>