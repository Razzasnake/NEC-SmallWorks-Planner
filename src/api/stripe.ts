import axios from "axios";

export default {
  getCustomerTier(email: string) {
    const url = "https://tableandmap.com/.netlify/getCustomerTier";
    return axios.post(url, { email }).then((resp) => {
      return parseInt(resp.data.data);
    });
  }
}