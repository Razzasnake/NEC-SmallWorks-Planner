declare module 'split.js';
declare module 'buefy';
declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }
 
  export default WebpackWorker;
}