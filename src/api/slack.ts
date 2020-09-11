import axios from 'axios'

export default {
  login(name: string, email: string) {
    const url = '***REMOVED***'
    const data = JSON.stringify({
      text: `${name} ${email}`
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