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
  }
}