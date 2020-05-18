import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUpload, faChevronDown, faChevronUp)

Vue.component('font-awesome-icon', FontAwesomeIcon)