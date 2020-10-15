import axios from "axios";

export default {
  getCustomerTier(email: string) {
    const url = `${process.env.VUE_APP_LAMBDA_BASE_URL}/getCustomerTier`;
    return axios.post(url, { email }).then((resp) => {
      return parseInt(resp.data);
    }).catch(() => {
      return 0;
    });
  }
}