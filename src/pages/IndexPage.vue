<template>
  <q-page class="mx-300">
    <q-avatar>
      <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
    </q-avatar>
    <q-badge color="primary" :label="user?.roles" />
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
    <q-page-container class="flex flex-center gap-32">
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
    </q-page-container>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth'
import { onMounted, ref, watch } from 'vue'

const store = useAuthStore();
const user = ref(null);

onMounted(async () => {
  user.value = await store.getCurrentUser();
});

</script>

<style>
.gap-32{
  gap: 32px;
}
</style>
