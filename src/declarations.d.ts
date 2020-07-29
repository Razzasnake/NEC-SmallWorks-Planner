declare module 'split.js';
declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }
 
  export default WebpackWorker;
}
declare module "shpjs";
declare module "storyblok-vue";
declare module "storyblok-js-client";
declare const storyblok: any;