export default () => {
  return {
    getBasicProfile: () => {
      return {
        getImageUrl: () => {
          return require("@/assets/examples/glacier.jpg")
        },
        getName: () => {
          return "James Joseph"
        },
        getEmail: () => {
          return "jjoseph@gmail.com"
        }
      }
    }
  }
}