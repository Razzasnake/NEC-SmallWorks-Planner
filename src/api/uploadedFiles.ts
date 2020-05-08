import ExampleAnalysis from "@/entities/ExampleAnalysis";

export default {
  getAllUploads(): Promise<ExampleAnalysis[]> {
    return new Promise((resolve, _) => {
      // resolve(exampleAnalysesGenerator(10))
      resolve([])
    })
  }
}