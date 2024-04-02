<template>
  <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
    <q-card class="bg-blue text-white" style="width: 300px">
      <q-form @submit="submit">
        <q-card-section>
          <q-input v-model="form.nom" label="Nom" />
          <q-input v-model="form.poste" label="Poste" />
          <q-input v-model="form.manager" label="Manager" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Annuler" flat @click="cancel" />
          <q-btn label="Sauvegarder" color="blue" text @click="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {ref, defineProps, defineEmits, watch} from 'vue'


const props = defineProps({
  editedRow: Object
})

const emits = defineEmits(['update', 'edit'])

const persistent = ref(true)

const form = ref({
  id: props.editedRow.id,
  nom: props.editedRow.nom,
  poste: props.editedRow.poste,
  manager: props.editedRow.manager
})

const cancel = () => {
  persistent.value = false
}

watch(persistent, (val) => {
  if (!val) {
    emits('update', val)
  }
})
const submit = () => {
  emits('edit', form.value)
  persistent.value = false
}
</script>
