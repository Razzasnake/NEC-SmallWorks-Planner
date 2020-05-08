import { exampleAnalysesGenerator } from '@/generator/ExampleAnalysisGenerator'
import ExampleAnalysis from "@/entities/ExampleAnalysis";

export default {
  getAllExamples(): Promise<ExampleAnalysis[]> {
    return new Promise((resolve, _) => {
      resolve(exampleAnalysesGenerator(10))
    })
  }
}