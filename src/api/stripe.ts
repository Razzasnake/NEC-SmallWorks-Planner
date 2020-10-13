import axios from "axios";

export default {
  getCustomerTier(email: string) {
    const url = "https://api.stripe.com/v1/customers";
    return axios.get(url, {
      headers: {
        Authorization: "Bearer ***REMOVED***"
      }
    }).then((resp) => {
      if (resp.data.data.find((u: { email: string }) => u.email === email)) {
        return 1;
      }
      return 0;
    });
  }
}