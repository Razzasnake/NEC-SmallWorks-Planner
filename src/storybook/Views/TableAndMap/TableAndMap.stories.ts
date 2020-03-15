import TableAndMap from './TableAndMap.vue'
import { uploadedFileGenerator } from '@/generator/UploadedFileGenerator'

export default {
  component: TableAndMap,
  title: 'Views|TableAndMap'
}

const _TableAndMap = () => ({
  components: { TableAndMap },
  template:
    `<TableAndMap
      style="height: 100vh;"
      :uploadedFile="uploadedFile"
    ></TableAndMap>`,
  props: {
    uploadedFile: {
      default: uploadedFileGenerator()
    }
  }
})

export { _TableAndMap }
