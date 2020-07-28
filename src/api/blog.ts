import axios from 'axios';

axios.interceptors.request.use((config) => {
  config.url = "https://api.storyblok.com/v1/" + config.url;
  config.params["token"] = process.env.VUE_APP_STORYBLOK_TOKEN;
  config.params["cv"] = new Date().getTime()
  return config;
});

export default {
  getStory: async (slug: string, version: string) => {
    return axios
      .get("cdn/stories/" + slug, {
        params: {
          version: version
        },
      })
      .then((response) => {
        return response.data.story;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  }
}