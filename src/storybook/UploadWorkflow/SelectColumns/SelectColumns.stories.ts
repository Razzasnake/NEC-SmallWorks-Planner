import SelectColumns from './SelectColumns.vue'

export default {
  component: SelectColumns,
  title: 'Upload Workflow|SelectColumns'
}

const _SelectColumns = () => ({
  components: { SelectColumns },
  template: `
    <SelectColumns 
    ></SelectColumns>`,
  props: {
  },
  methods: {
  }
})

export { _SelectColumns }