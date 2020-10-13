<template>
  <div class="login">
    <div
      v-show="loggedOut"
      id="google-signin-button"
      class="margin-left-medium"
    />
    <v-menu
      v-if="!loggedOut"
      offset-y
    >
      <template #activator="{ on }">
        <v-btn
          x-small
          fab
          color="#eeeeee"
          class="margin-left-medium"
          v-on="on"
        >
          <div class="first-letter">
            {{ userFirstLetter }}
          </div>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item :to="$router ? '/account' : ''">
          <v-list-item-icon>
            <v-icon>{{ mdiAccount }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="signOut">
          <v-list-item-icon>
            <v-icon>{{ mdiLogout }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Sign out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import state, { signIn, signOut } from "@/store/driveStore";
import { mdiLogout, mdiAccount } from "@mdi/js";

/**
 * Login/Logout of Google
 */
@Component({
  components: {},
})
export default class Login extends Vue {
  private mdiLogout = mdiLogout;
  private mdiAccount = mdiAccount;

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
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.onload = () => {
      signIn("google-signin-button");
    };
    document.getElementsByTagName("head")[0].appendChild(script);
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
  #google-signin-button {
    width: 100px;
  }
}
</style>