export default {
  login(name: string, email: string) {
    const url = "***REMOVED***";
    return fetch(url, {
      method: "POST",
      body: JSON.stringify({
        text: `${name} ${email}`
      })
    });
  }
} 