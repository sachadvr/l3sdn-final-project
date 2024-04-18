<template>
  <div>
    Logging out...
  </div>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

onMounted(async () => {
  const result = await authStore.logout()
  if (result.success) {
    $q.notify({
      message: result.message,
      color: 'positive',
      position: 'bottom'
    })
  } else {
    $q.notify({
      message: result.message,
      color: 'negative',
      position: 'bottom'
    })
  }
  router.push('/login')
})
</script>

