import FeatureI from "@/entities/storyblok/Feature";

const featureGenerator = (): FeatureI => {
  return {
    _uid: "65fdc3c6-64e2-42f8-be61-589baf8e861e",
    title: "Filter With Shapes",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: {
            level: 2
          },
          content: [
            {
              text: "Drawing shapes:",
              type: "text"
            }
          ]
        },
        {
          type: "paragraph"
        },
        {
          type: "paragraph",
          content: [
            {
              text: "After uploading a locational dataset, select from the drawing options in the top left of the map. Select the circle to draw a circle starting from the center. Select the polygon to draw a more complex shape. Select the rectangle to draw a simple shape.",
              type: "text"
            }
          ]
        },
        {
          type: "paragraph",
          content: [
            {
              text: "Draw as many shapes as you want and we do the math to determine which point falls within each polygon.",
              type: "text"
            }
          ]
        },
        {
          type: "paragraph",
          content: [
            {
              text: "See the table update in real time as shapes are added to the map.",
              type: "text"
            }
          ]
        },
        {
          type: "heading",
          attrs: {
            level: 2
          },
          content: [
            {
              text: "Deleting shapes:",
              type: "text"
            }
          ]
        },
        {
          type: "paragraph"
        },
        {
          type: "paragraph",
          content: [
            {
              text: "To delete a shape, click the shape on the map then click the red trash icon that will appear as the right-most option in the top left drawing options. An alternative to this button is to hit the delete or backspace key on your keyboard. Doing so will have the same effect as clicking the red trash icon. ",
              type: "text"
            }
          ]
        },
        {
          type: "paragraph",
          content: [
            {
              text: "This action will be permanent, so make sure you want to delete the shape.",
              type: "text"
            }
          ]
        }
      ]
    },
    preview: {
      filename: require("@/assets/examples/nationalparks.jpg")
    },
    abstract: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              text: "Locational data stored in excel and csv files is more insightful when displayed on a map. Thanks to ",
              type: "text"
            },
            {
              text: "Table \u0026 Map",
              type: "text",
              marks: [
                {
                  type: "bold"
                }
              ]
            },
            {
              text: ", interacting with your data has never been easier. Follow the guide to see your locational data on a map and start interacting with your data like you have always wanted.",
              type: "text"
            }
          ]
        }
      ]
    },
    subtitle: "Easily draw shapes around markers to filter the table and display only the markers you want to see.",
    component: "feature",
    youtubeUrl: {
      url: ""
    }
  }
}

export { featureGenerator }