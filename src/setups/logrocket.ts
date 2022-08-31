import LogRocket from 'logrocket';

if (process.env.NODE_ENV === "production") {
  LogRocket.init(process.env.VUE_APP_LOG_ROCKET_ID);
}