import LogRocket from 'logrocket';

if (process.env.NODE_ENV === "production") {
  LogRocket.init('***REMOVED***');
}