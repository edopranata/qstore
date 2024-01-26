import VueNumber from '@coders-tm/vue-number-format'
import QNumber from 'components/Input/QNumber.vue'

export default ({app}) => {
  // we globally register our component in the app
  app.use(VueNumber)
  app.component('QNumber', QNumber)
}
