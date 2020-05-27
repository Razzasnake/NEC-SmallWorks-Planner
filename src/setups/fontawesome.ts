import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEye, faUpload, faChevronDown, faChevronUp)

Vue.component('font-awesome-icon', FontAwesomeIcon)