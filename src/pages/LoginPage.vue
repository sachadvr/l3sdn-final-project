<template>
  <div>
    <q-page class="mx-300">

      <q-form @submit="login">
        <q-input v-model="username" label="Nom d'utilisateur" />
        <q-input v-model="password" label="Mot de passe" type="password" />
        <q-btn type="submit" label="Se connecter" color="primary" />
      </q-form>
    </q-page>
  </div>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth'
import {onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
const username = ref('')
const password = ref('')
const router = useRouter()

const $q = useQuasar()
const login = async () => {
  let loggedIn = await useAuthStore().login(username.value, password.value)
  if (loggedIn) {
    $q.notify({
      message: 'Connecté en tant que ' + username.value,
      icon: 'check',
      color: 'positive',
      position: 'bottom'
    })
    router.push('/')
  }else {
    $q.notify({
      message: 'Mot de passe ou nom d\'utilisateur incorrect',
      icon: 'report_problem',
      color: 'negative',
      position: 'bottom'
    })
  }
}
</script>

<style>
</style>
