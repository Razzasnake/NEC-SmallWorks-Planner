export default {
  login(name: string, email: string) {
    const url = process.env.VUE_APP_SLACK_WEBHOOK;
    return fetch(url, {
      method: "POST",
      body: JSON.stringify({
        text: `${name} ${email}`
      })
    });
  }
} 