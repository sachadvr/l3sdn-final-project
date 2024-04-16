<template>
    <q-page class="p-5 flex items-center">

      <q-form class="form" @submit="login">
        <h2 class="text-h6">Se connecter</h2>
        <q-input v-model="username" label="Nom d'utilisateur" />
        <q-input v-model="password" label="Mot de passe" type="password" />
        <q-btn type="submit" label="Se connecter" color="primary" />
      </q-form>
    </q-page>
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

<style scoped>
.p-5 {
  padding: 5rem;
  background: url('../assets/bg.png') no-repeat center center;
  background-size: cover;
}
.flex {
  display: flex;
  justify-content: center;
}
.items-center {
  align-items: center;
}
.form {
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  border-radius: 5px;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
