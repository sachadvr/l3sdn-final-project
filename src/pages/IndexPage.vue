<template>
  <q-page class="mx-300 p-5">
    <q-avatar>
      <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
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
            Dashboard
          </q-card-title>
        </q-card-section>
        <q-card-section>
          <q-card-subtitle>
            Prochainement
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
            Prochainement
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
            Prochainement
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
            Prochainement
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
            Prochainement
          </q-card-subtitle>
        </q-card-section>
      </q-card>
    </q-page-container>
  </q-page>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useAuthStore } from 'src/stores/auth'

const store = useAuthStore();
const user = ref(null);

onMounted(async () => {
  user.value = await store.getCurrentUser();
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
