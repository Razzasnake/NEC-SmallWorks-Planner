import axios from 'axios'

export default {
  subscribe(email: string) {
    const url = '***REMOVED***'
    const data = JSON.stringify({
      text: email
    })
    return axios.post(url, data, {
      withCredentials: false,
      transformRequest: [(data, headers) => {
        delete headers.post["Content-Type"]
        return data
      }]
    })
  }
}