import {boot} from 'quasar/wrappers'
import {useAuthStore} from "stores/authStore";
import {LocalStorage} from "quasar";
import {api} from "boot/axios";

export default boot(async ({router}) => {
  const auth = useAuthStore()
  const token = LocalStorage.getItem('token')
  api.defaults.headers.common.Authorization = `Bearer ${token}`
  await auth.attempt(token).then(() => {
    router.push('/app')
  }).catch( () => {
    router.push('/auth')
  })
})
