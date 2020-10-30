import Breadcrumbs from './Breadcrumbs.vue'

export default {
  component: Breadcrumbs,
  title: 'Uploads/Breadcrumbs'
}

const _Breadcrumbs = () => ({
  components: { Breadcrumbs },
  template: '<Breadcrumbs :folder-id="folderId" />',
  props: {
    folderId: {
      default: null
    }
  }
})

export { _Breadcrumbs }