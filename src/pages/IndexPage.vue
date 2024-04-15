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
      </q-card-actions>
    </q-card>
    <q-page-container class="dashboard-grid">
      <q-card>
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
      <q-card>
        <q-card-section>
          <q-card-title>
            Prochain entretien
          </q-card-title>
        </q-card-section>
        <q-card-section>
          <q-card-subtitle>
            {{ nextInterview.date }} - {{ nextInterview.type }}
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
            {{ nextPersonalInterview.date }} - {{ nextPersonalInterview.type }}
          </q-card-subtitle>
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section>
          <q-card-title>
            Liste des managés
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

const user = ref(null);
const numberOfManagees = ref(0);
const nextInterview = ref('');
const myManager = ref('');
const nextPersonalInterview = ref('');
const userAvatar = ref('https://cdn.quasar.dev/logo/svg/quasar-logo.svg');
const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
  user.value = await authStore.getCurrentUser();
  // Fetching data for managees, interviews, etc.
  numberOfManagees.value = await userStore.getManagedUsers(user.value.id).length;
  nextInterview.value = await userStore.getNextInterview(user.value.id);
  myManager.value = await userStore.getUserById(user.value.manager_id);
  nextPersonalInterview.value = await userStore.getNextPersonalInterview(user.value.id);
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
</style>
