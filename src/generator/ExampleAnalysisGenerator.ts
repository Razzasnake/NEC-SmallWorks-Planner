import ExampleAnalysis from "@/entities/ExampleAnalysis"

const exampleAnalysisGenerator = () => {
  return new ExampleAnalysis({
    id: 0,
    title: 'Hospitals',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    img: require('@/assets/examples/hospitals-preview.svg'),
    createdOn: new Date()
  })
}

const exampleAnalysesGenerator = (num: number = 10) => {
  const data: ExampleAnalysis[] = []
  for (let i = 0; i < num; i++) {
    data.push(exampleAnalysisGenerator())
  }
  return data
}

export { exampleAnalysisGenerator, exampleAnalysesGenerator }