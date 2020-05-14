import ExampleAnalysis from "@/entities/ExampleAnalysis"
// import ExampleData from '@/assets/examples/hospitals/data'

const exampleAnalysisGenerator = (index: number = 0) => {
  return new ExampleAnalysis({
    id: index,
    title: 'Hospitals',
    description: 'This database contains locations of Hospitals for 50 states and Washington D.C. , Puerto Rico and US territories. The dataset only includes hospital facilities and does not include nursing homes. Data for all the states was acquired from respective states departments or their open source websites and then geocoded and converted into a spatial database.',
    preview: require('@/assets/examples/hospitals/preview.jpg'),
    url: "https://hifld-geoplatform.opendata.arcgis.com/datasets/hospitals",
    createdOn: new Date(),
    config: {
      data: () => import(/* webpackChunkName: "hospitals" */ '@/assets/examples/hospitals/data'),
      columnSelections: {
        lat: 15,
        lng: 16
      },
      firstRowHeader: true
    }
  })
}

const exampleAnalysesGenerator = (num: number = 10) => {
  const data: ExampleAnalysis[] = []
  for (let i = 0; i < num; i++) {
    data.push(exampleAnalysisGenerator(i))
  }
  return data
}

export { exampleAnalysisGenerator, exampleAnalysesGenerator }