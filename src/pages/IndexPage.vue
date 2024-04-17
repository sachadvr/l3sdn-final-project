<template>
  <q-page class="mx-300 p-5">
    <q-avatar>
      <img :src="userAvatar" />
    </q-avatar>
    <q-badge color="primary" :label="user?.roles[0]" />
    <q-card>
      <q-card-section>
        <q-card-title>
          Connecté en tant que {{ user?.username }}
        </q-card-title>
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
      <q-card v-if="user && user.roles.some(r => r === 'ROLE_MANAGER' || r === 'ROLE_RH')">
        <q-card-section>
          <q-card-title>
            Liste des managés
            <ManagerView />
          </q-card-title>
        </q-card-section>
        <q-card-section>
          <q-card-subtitle>
            {{ managedUsers }}
          </q-card-subtitle>
        </q-card-section>
      </q-card>
    </q-page-container>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useUserStore } from 'src/stores/users';
import { useObjectifsStore } from 'src/stores/objectifs'
import { useInterviewsStore } from 'src/stores/interviews'
import ManagerView from 'components/ManagerView.vue'

const user = ref(null);
const numberOfManagees = ref(0);
const nextInterview = ref('');
const myManager = ref('');
const nextPersonalInterview = ref('');
const userAvatar = ref('https://cdn.quasar.dev/logo/svg/quasar-logo.svg');
const authStore = useAuthStore();
const userStore = useUserStore();
const objectifStore = useObjectifsStore();
const interviewStore = useInterviewsStore();
const router = useRouter();

onMounted(async () => {
  user.value = await authStore.getCurrentUser();
  if (await userStore.getUserByManager(user.value.id)) {
    numberOfManagees.value = userStore.userByManager.length;
  }

  if (await interviewStore.fetchInterviews(user.value.id)) {
    // if there is any interviews that are > today
    if (interviewStore.interviews.some((i) => new Date(i.date) > new Date())) {
      nextPersonalInterview.value = interviewStore.interviews.find((i) => new Date(i.date) > new Date()).date;
    } else {
      nextPersonalInterview.value = 'Aucun prochain entretien perso prévu';
    }
  }
  if (await interviewStore.getInterviewByManager(user.value.id)) {
    // if there is any interviews that are > today
    if (interviewStore.managerInterviews.some((i) => new Date(i.date) > new Date())) {
      nextInterview.value = new Date(interviewStore.managerInterviews[0].date).toLocaleDateString();
    } else {
      nextInterview.value = 'Aucun entretien prévu';
    }
  }
  if (await userStore.getUsers())  {
  let hasManager = userStore.users.find((u) => u.id === user.value.id)?.manager_id;
  if (!hasManager) {
    myManager.value = 'Aucun manager';
    return;
  }
    myManager.value = userStore.users.find((u) => u.id === hasManager).username;
  }
});
</script>

<style scoped>
.gap-32{
  gap: 32px;
}
.p-5 {
  padding: 5rem;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
}

.q-card {
  border-radius: 12px ;
}
</style>
