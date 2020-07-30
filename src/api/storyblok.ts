import StoryI from "@/entities/storyblok/Story";
import axios from 'axios';

const instance = axios.create();
instance.interceptors.request.use((config) => {
  config.url = "https://api.storyblok.com/v1/" + config.url;
  config.params["token"] = process.env.VUE_APP_STORYBLOK_TOKEN;
  config.params["cv"] = new Date().getTime()
  return config;
});

export default {
  getStory: async (slug: string, version: string): Promise<StoryI> => {
    return instance
      .get("cdn/stories/" + slug, {
        params: {
          version: version
        },
      })
      .then((response) => {
        return response.data.story;
      })
      .catch((error) => {
        return null;
      });
  }
}