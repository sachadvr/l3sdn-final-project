<template>
  <q-page-container>
    <q-page class="q-pa-md">
      <q-card>
        <q-card-section>
          Mon profil
        </q-card-section>
        <q-card-section>
          <q-form
            class="q-gutter-md"
            @submit="submit"
          >
            <div class="flex">

              <q-input
                v-model="user.firstname"
                label="Prénom"
                outlined
              />
              <q-input
                v-model="user.name"
                label="Nom"
                outlined
              />
            </div>
            <q-input
              v-model="user.job"
              label="Nom du poste"
              outlined
            />
            <q-input
              v-model="user.address"
              label="Votre adresse"
              outlined
            />
            <q-input
              v-model="user.phone"
              label="Votre numéro de téléphone"
              outlined
            />
            <q-input
              v-model="user.password"
              label="Votre mot de passe"
              outlined
            />

            <q-btn
              type="submit"
              label="Enregistrer"
              color="primary"
              class="q-mt-md"
            />
            <q-btn
              label="Enregistrer et retourner à l'accueil"
              color="secondary"
              class="q-mt-md"
              @click="submitplus"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from 'src/stores/auth'
import {useUserStore} from 'src/stores/users'
import {useQuasar} from 'quasar'

const router = useRouter()
const $q = useQuasar()
const user = ref({
  firstname: '',
  name: '',
  job: '',
  address: '',
  phone: '',
  password: '',
})
const authStore = useAuthStore()
const userStore = useUserStore()

onMounted(async () => {
  user.value = await authStore.getCurrentUser()
  await userStore.getUser(user.value.id)
  user.value = userStore.currentuser
})

const submit = async () => {
  await userStore.update(user.value.id, user.value).then(() => {
    $q.notify({
      message: 'Profile mis à jour',
      color: 'positive',
      position: 'bottom',
      timeout: 1000,
    })
  })
}
const submitplus = async () => {
  submit().then(() => {
    setTimeout(() => {
      router.push('/')
    }, 1000)
  })
}
</script>

<style scoped>
.p-5 {
  padding: 5rem;
}

.q-card {
  border-radius: 12px;
}

.flex {
  display: flex;
  gap: 1rem;
}
.q-page-container {
  padding-top: 0!important;
}
</style>
