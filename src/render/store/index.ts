import { createStore } from 'vuex'
import modules from './modules/index.js'

export default createStore({
  ...modules
})
