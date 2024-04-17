<template>
  <div>
    Logging out...
  </div>
</template>

<script setup>
import {useAuthStore} from 'src/stores/auth'
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useQuasar} from 'quasar'

const username = ref('')
const password = ref('')
const router = useRouter()

const $q = useQuasar()

onMounted(() => {
  useAuthStore().logout()
  useAuthStore().notifyUser('Logged out')

  router.push('/login')
})
</script>

<style>
</style>
