export default {
  getCustomerTier(email: string) {
    const url = `${process.env.VUE_APP_LAMBDA_BASE_URL}/getCustomerTier`;
    return fetch(url, {
      method: "POST",
      body: JSON.stringify({ email })
    }).then(async response => {
      return parseInt(await response.text());
    }).catch(() => {
      return 0;
    });
  },
  getPastedUrl(pastedUrl: string) {
    const url = `${process.env.VUE_APP_LAMBDA_BASE_URL}/getPastedUrl`;
    return fetch(url, {
      method: "POST",
      body: JSON.stringify({ url: pastedUrl })
    }).then(async response => {
      return await response.text();
    }).catch(() => {
      return "";
    });
  },
  getCustomerPortal(email: string, return_url: string) {
    const url = `${process.env.VUE_APP_LAMBDA_BASE_URL}/getCustomerPortal`;
    return fetch(url, {
      method: "POST",
      body: JSON.stringify({ email, return_url })
    }).then(async response => {
      return await response.text();
    }).catch(() => {
      return null;
    });
  }
}