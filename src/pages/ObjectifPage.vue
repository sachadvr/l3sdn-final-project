<template>
          <q-card v-for="objectif in objectifs" :key="objectif.id">
            <q-card-section>
              <div class="text-h6">Objectif du {{ objectif.date }}</div>
              <div class="text-subtitle2">Decription</div>
              <div>{{ objectif.resume }}</div>
            </q-card-section>
          </q-card>
          <q-btn color="primary" label="Ajouter un nouvel objectif" class="q-mt-md" @click="addObjectif"/>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useObjectifsStore } from 'src/stores/objectifs'
import { onMounted } from 'vue'
import { defineProps } from 'vue'

const user = ref(null)
const tab = ref('objectif')
const auth_store = useAuthStore();
const objectif_store = useObjectifsStore();

const props = defineProps({
  objectifs: Array
})
const objectifs = ref(props.objectifs)

const addObjectif = async () => {
  const date = prompt('Date de l\'objectif (format: YYYY-MM-DD) :');
  const resume = prompt('Description de l\'objectif :');

  if (date && resume) {
    console.log('toto');
  }
};
</script>
