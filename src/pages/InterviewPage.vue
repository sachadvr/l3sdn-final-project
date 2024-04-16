<template>
  <div class="q-pa-md">
    <q-card>
      <q-tabs
        v-model="tab"
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="interview" label="Travail effectué cette année" />
        <q-tab name="obj" label="Objectifs" />
        <q-tab name="obj-next" label="Objectifs de l'année prochaine" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab">
        <q-tab-panel name="interview">
          <div class="text-h6">Le récap de mes interviews</div>
          <q-card v-for="interview in interviews" :key="interview.id">
            <q-card-section>
              <div class="text-h6">Interview du {{ interview.date }}</div>
              <div class="text-subtitle2">Résumé</div>
              <div>{{ interview.resume }}</div>
            </q-card-section>
          </q-card>
          <q-btn
            color="primary"
            label="Ajouter un nouvel entretien"
            class="q-mt-md"
            @click="addInterview"
          />
        </q-tab-panel>
        <q-tab-panel name="obj">
          <div class="text-h6">Mes objectifs de cette année</div>
          <ObjectifPage :objectifs="objectifs" />
        </q-tab-panel>
        <q-tab-panel name="obj-next">
          <div class="text-h6">Objectifs de l'année prochaine</div>
          <ObjectifPage :objectifs="objectifsNextYear" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useInterviewsStore } from 'src/stores/interviews';
import { useObjectifsStore } from 'src/stores/objectifs';
import { onMounted } from 'vue';
import axios from 'axios';
import ObjectifPage from 'pages/ObjectifPage.vue';
const user = ref(null);
const interviews = ref([]);
const objectifs = ref([]);

const objectifsNextYear = ref([]);

const tab = ref('interview');
const auth_store = useAuthStore();
const interviews_store = useInterviewsStore();
const objectif_store = useObjectifsStore();
onMounted(async () => {
  user.value = await auth_store.getCurrentUser();
  if (await interviews_store.fetchInterviews(user.value.id)) {
    interviews.value = interviews_store.interviews;
  }

  if (
    await objectif_store.fetchObjectifs(user.value.id, {
      year: new Date().getFullYear(),
    })
  ) {
    objectifs.value = objectif_store.objectifs;
  }
  if (
    await objectif_store.fetchObjectifs(user.value.id, {
      year: new Date().getFullYear() + 1,
    })
  ) {
    objectifsNextYear.value = objectif_store.objectifs;
  }
});

const addInterview = async () => {
  const date = prompt("Date de l'entretien (format: YYYY-MM-DD):");
  const resume = prompt("Résumé de l'entretien:");
  const created_at = new Date().toISOString();
  if (date && resume) {
    try {
      let managerId = null;
      // Si l'utilisateur est un admin ou un manager, demandez le manager_id
      if (user.value.roles[0] === 'ROLE_ADMIN' || user.value.roles[0] === 'ROLE_MANAGER') {
        managerId = prompt("ID du manager avec qui vous avez l'entretien:");
      } else {
        // Sinon, utilisez automatiquement le manager de l'utilisateur courant
        managerId = user.value.manager_id;
      }
      managerId = parseInt(managerId);
      const response = await axios.post(
        '/api/interviews',
        {
          user_id: user.value.id,
          manager_id: managerId,
          date,
          resume,
          created_at,

        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (response.status === 201) {
        interviews.value = await interviews_store.fetchInterviews(user.value.id);
        console.log('Entretien ajouté avec succès');
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'entretien:", error);
    }
  }
};
</script>

