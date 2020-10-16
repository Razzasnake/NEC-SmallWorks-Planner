export default () => {
  return {
    getBasicProfile: () => {
      return {
        getImageUrl: () => {
          return require("@/assets/examples/glacier.jpg")
        },
        getName: () => {
          return "Tim Gamble"
        },
        getEmail: () => {
          return "tjgambs@gmail.com"
        }
      }
    }
  }
}