import axios from "axios"
import Geocode from "@/entities/Geocode"
import { geocodeGenerator } from "@/generator/GeocodeGenerator"

export default {
  geocode(address: string) {
    const url = "https://api.geocod.io/v1.5/geocode"
    return axios.get(url, {
      params: {
        q: address,
        api_key: process.env.VUE_APP_GEOCODE_KEY
      }
    }).then(response => {
      return new Geocode(response.data)
    })
  },
  fakeGeocode(_: string) {
    return new Promise((resolve, _) => {
      resolve(geocodeGenerator())
    })
  }
}