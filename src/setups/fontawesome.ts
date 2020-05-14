import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUpload, faEye, faEyeSlash)

Vue.component('font-awesome-icon', FontAwesomeIcon)