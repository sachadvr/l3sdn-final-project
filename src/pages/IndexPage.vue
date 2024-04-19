<template>
  <q-page class="q-pa-md mx-300 p-5">

    <q-card class="w-fit">
      <q-card-section>

        <q-avatar>
          <img :src="userAvatar"/>
        </q-avatar>
        <q-badge color="primary" :label="user?.roles[0]"/><br/>

        <span class="text-primary">Connecté en tant que <strong>{{ user?.username }}</strong></span>
      </q-card-section>
      <q-card-actions>
        <q-btn
          label="Se déconnecter"
          color="primary"
          @click="$router.push('/logout')"
        />
        <q-btn
          label="Mon profil"
          color="secondary"
          @click="$router.push('/profile')"
        />
      </q-card-actions>
    </q-card>
    <q-page-container class="dashboard-grid">
      <q-card v-if="user && user.roles.some(r => r === 'ROLE_MANAGER' || r === 'ROLE_RH')">
        <q-card-section>
          <q-card-title>
            Nombre de managés
          </q-card-title>
        </q-card-section>
        <q-card-section>
          <q-card-subtitle>
            {{ numberOfManagees }}
          </q-card-subtitle>
        </q-card-section>
      </q-card>
      <q-card v-if="user && user.roles.some(r => r === 'ROLE_MANAGER' || r === 'ROLE_RH')">
        <q-card-section>
          <q-card-title>
            Prochain entretien
          </q-card-title>
        </q-card-section>
        <q-card-section>
          <q-card-subtitle>
            {{ nextInterview }}
          </q-card-subtitle>
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section>
          <q-card-title>
            Mon manager
          </q-card-title>
        </q-card-section>
        <q-card-section>
          <q-card-subtitle>
            {{ myManager }}
          </q-card-subtitle>
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section>
          <q-card-title>
            Mon prochain entretien personnel
          </q-card-title>
        </q-card-section>
        <q-card-section>
          <q-card-subtitle>
            {{ nextPersonalInterview }}
          </q-card-subtitle>
        </q-card-section>
      </q-card>

    </q-page-container>
    <q-card  v-if="user && user.roles.some(r => r === 'ROLE_MANAGER' || r === 'ROLE_RH')" class="mt-20">
      <q-card-section>
        <q-card-title>
          Liste des managés
          <ManagerView/>
        </q-card-title>
      </q-card-section>
      <q-card-section>
        <q-card-subtitle>
          {{ managedUsers }}
        </q-card-subtitle>
      </q-card-section>
    </q-card>

    <q-card v-else class="mt-20">
      <q-card-section>
        <span class="text-h5">
          Bienvenue sur votre espace personnel
        </span>
      </q-card-section>
      <q-card-section>
        <p class="text-larger">
          Dans le cadre de notre projet en VueJS, nous avons développé cette plateforme afin de vous offrir une expérience utilisateur intuitive et complète.
          <br/>
          Nous avons mis en œuvre nos compétences pour concevoir un outil qui vous permet de suivre vos objectifs, vos entretiens et vos informations personnelles en toute simplicité.
          <br/>
          Pour profiter pleinement de toutes les fonctionnalités offertes par notre plateforme, nous vous invitons à vous connecter en tant que manager ou RH. <br/>Cela vous permettra d'accéder à toutes les options disponibles et de tirer le meilleur parti de votre expérience utilisateur.
        </p>

        <p>
          Par Theo, Melene, Lucas et Sacha, étudiants en L3 SDN à l'Université de Lille.
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from 'src/stores/auth'
import {useUserStore} from 'src/stores/users'
import {useObjectifsStore} from 'src/stores/objectifs'
import {useInterviewsStore} from 'src/stores/interviews'
import ManagerView from 'components/ManagerView.vue'

const user = ref(null)
const numberOfManagees = ref(0)
const nextInterview = ref('')
const myManager = ref('')
const nextPersonalInterview = ref('')
const userAvatar = ref('https://cdn.quasar.dev/logo/svg/quasar-logo.svg')
const authStore = useAuthStore()
const userStore = useUserStore()
const objectifStore = useObjectifsStore()
const interviewStore = useInterviewsStore()
const router = useRouter()


// probleme de parallelisme donc on utilise onMounted plusieurs fois
onMounted(async () => {
  user.value = await authStore.getCurrentUser()
  if (await userStore.getUserByManager(user.value.id)) {
    numberOfManagees.value = userStore.userByManager.length
  }

})
onMounted(async () => {
  user.value = await authStore.getCurrentUser()
  if (await interviewStore.fetchInterviews(user.value.id)) {
    if (interviewStore.interviews.some((i) => new Date(i.date) > new Date())) {
      nextPersonalInterview.value = interviewStore.interviews.find((i) => new Date(i.date) > new Date()).date
    } else {
      nextPersonalInterview.value = 'Aucun prochain entretien perso prévu'
    }
  }
})

onMounted(async () => {
  user.value = await authStore.getCurrentUser()
  if (await interviewStore.fetchManagerInterviews(user.value.id)) {
    if (interviewStore.managerInterviews.some((i) => new Date(i.date) > new Date())) {
      nextInterview.value = new Date(interviewStore.managerInterviews[0].date).toLocaleDateString()
    } else {
      nextInterview.value = 'Aucun entretien prévu'
    }
  }
})
onMounted(async () => {
  user.value = await authStore.getCurrentUser()
  if (await userStore.getUsers()) {
    let hasManager = userStore.users.find((u) => u.id === user.value.id)?.manager_id
    if (!hasManager) {
      myManager.value = 'Aucun manager'
      return
    }
    myManager.value = userStore.users.find((u) => u.id === hasManager).username
  }
})
</script>

<style lang="scss" scoped>
$animation-delay: 0.2s;

.gap-32 {
  gap: 32px;
}

.p-5 {
  padding: 5rem;
}

@media screen and (max-width: 768px) {
  .p-5 {
    padding: 2rem;
  }
}

.dashboard-grid {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.q-card {
  border-radius: 12px;
  animation: fadeIn 1s ease-in-out;
  animation-fill-mode: both;
  flex:1;
}

@for $i from 1 through 10 {
  .q-card:nth-of-type(#{$i}) {
    animation-delay: $animation-delay * $i;
  }
}

.w-fit {
  width: fit-content;
  padding: 0 1rem;
  border-radius: 0;
  border: 5px solid black;
  position: relative;
}

.mt-20 {
  margin-top: 40px;
}

.text-larger {
  font-size: 1rem;
}
</style>
