<template>
  <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
    <q-card class="bg-blue text-white" style="width: 300px">
      <q-form @submit="submit">
        <q-card-section>
          <q-input v-model="form.resume" label="Description" />
          <q-input v-model="form.date" label="Date" />
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
import {onMounted} from 'vue'
import { useObjectifsStore } from 'src/stores/objectifs'
const objectif_store = useObjectifsStore()

const props = defineProps({
  editedRow: Object
})


const emits = defineEmits(['update', 'edit'])

const persistent = ref(true)

const form = ref({
  id: null,
  resume: null,
  date: null,
})

const cancel = () => {
  persistent.value = false
  emits('update', false)
}
onMounted(async () => {
  await objectif_store.fetchObjectif(props.editedRow.id)
  form.value = {
    id: props.editedRow.id,
    resume: props.editedRow.resume,
    date: props.editedRow.date,
  }
});

const submit = async () => {
  if (await objectif_store.patchObjectif(form.value)) {
    emits('update', form.value.id, form.value)
    persistent.value = false
  }
}
</script>
