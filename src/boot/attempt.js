import {boot} from 'quasar/wrappers'
import {useAuthStore} from "stores/authStore";
import {LocalStorage} from "quasar";
import {api} from "boot/axios";
import {useRouter} from "vue-router";

const router = useRouter()
export default boot(async ({router, store}) => {
  const {attempt} = useAuthStore()
  const token = LocalStorage.getItem('token')
  api.defaults.headers.common.Authorization = `Bearer ${token}`
  await attempt(token).then(() => {
    router.push('/app')
  }).catch( () => {
    router.push('/auth')
  })
})
