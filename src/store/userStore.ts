import Vue from 'vue'
import OktaAuth from "@okta/okta-auth-js";
import User from "@/entities/User";

interface UserStoreI {
  user: User | null,
  isAuthenticated: boolean
};

const state: UserStoreI = Vue.observable({
  user: null,
  isAuthenticated: false
});

const getUser = async () => {
  if (state.user) {
    return state.user;
  }
  const user = await Vue.prototype.$auth.getUser();
  state.user = new User(user);
  return state.user;
}

const login = (form: { username: string, password: string }) => {
  const authClient = new OktaAuth({
    issuer: process.env.VUE_APP_OKTA_ISSUER,
    clientId: process.env.VUE_APP_OKTA_CLIENT_ID,
    redirectUri: process.env.VUE_APP_BASE_URL + "/implicit/callback",
    scopes: ["openid", "profile", "email"],
    pkce: true
  });
  return authClient
    .signIn(form)
    .then((res: { sessionToken: string }) => {
      authClient.token.getWithRedirect({
        sessionToken: res.sessionToken,
        responseType: "id_token"
      });
    });
}

const logout = async () => {
  await Vue.prototype.$auth.logout();
  state.user = null;
  state.isAuthenticated = false;
};

const refreshAuthenticated = async () => {
  state.isAuthenticated = await Vue.prototype.$auth.isAuthenticated();
};

export default state;
export { getUser, login, logout, refreshAuthenticated };