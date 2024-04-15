<template>
  <div class="q-pa-md">
    <q-card>
      <q-tabs
        v-model="tab"
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify">
        <q-tab name="interview" label="Travail effectué cette année" />
        <q-tab name="obj" label="Objectifs" />
        <q-tab name="obj-next" label="Objectifs de l'année prochaine" />
      </q-tabs>

      <q-separator/>

      <q-tab-panels v-model="tab">
        <q-tab-panel name="interview">
          <div class="text-h6">Le récap de mes interviews</div>
        </q-tab-panel>

        <q-tab-panel name="obj">
          <div class="text-h6">Mes objectifs de cette année</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.

          <q-card v-for="objectif in objectifs" :key="objectif.id">
            <q-card-section>
              <div class="text-h6">Objectif du {{ objectif.date }}</div>
              <div class="text-subtitle2">Decription</div>
              <div>{{ objectif.resume }}</div>
            </q-card-section>
          </q-card>
          <q-btn color="primary" label="Ajouter un nouvel objectif" class="q-mt-md" @click="addObjectif"/>
        </q-tab-panel>

        <q-tab-panel name="obj-next">
          <div class="text-h6">Objectifs de l'année prochaine</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useObjectifsStore } from 'src/stores/objectifs'
import { onMounted } from 'vue'

const user = ref(null)
const objectifs = ref([])
const tab = ref('objectif')
const auth_store = useAuthStore();
const objectif_store = useObjectifsStore();

onMounted(async () => {
  user.value = await auth_store.getCurrentUser();
  if (await objectif_store.fetchObjectifs(user.value.id)) {
    objectifs.value = objectif_store.objectifs
  }

});

const addObjectif = async () => {
  const date = prompt('Date de l\'objectif (format: YYYY-MM-DD) :');
  const resume = prompt('Description de l\'objectif :');

  if (date && resume) {
    const response = await axios.post('/api/objectifs', {
      user_id: user.value.id,
      date,
      resume,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    if (response.status === 201) {
      await objectifs_store.fetchObjectifs(user.value.id);
      objectifs.value = objectif_store.objectifs;

      const objectifToAdd = {
        id: response.data.objectif_id,
        user_id: user.value.id,
        date,
        resume,
      };
      await axios.post('/api/objectifs/add-to-json', objectifToAdd);

      console.log('Objectif ajouté avec succès');
    } else {
      console.error('Erreur lors de l\'ajout de l\'objectif');
    }
  }
};
</script>
