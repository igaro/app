// use native alert box if available
if (env && env.navigator && env.navigator.notification && env.navigator.notification.alert)
    env.alert = env.navigator.notification.alert;

