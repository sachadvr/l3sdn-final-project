<template>
  <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
    <q-card class="bg-blue text-white" style="width: 300px">
      <q-form @submit="submit">
        <q-card-section>
          <q-input v-model="form.name" label="Nom" />
          <q-input v-model="form.firstname" label="Prénom" />
          <q-input v-model="form.job" label="Poste" />
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
import { useUserStore } from 'src/stores/users'
const user_store = useUserStore();

const props = defineProps({
  editedRow: Object
})


const emits = defineEmits(['update', 'edit'])

const persistent = ref(true)

const form = ref({
  id: null,
  name: null,
  firstname: null,
  job: null,
})

const cancel = () => {
  persistent.value = false
  emits('update', false)
}
onMounted(async () => {
  await user_store.getUser(props.editedRow.id)
  const user = user_store.currentuser
  form.value = {
    id: user.id,
    name: user.name,
    firstname: user.firstname,
    job: user.job,
  }

});

const submit = () => {
  user_store.update(form.value.id, form.value).then(() => {
    emits('update', false)
    persistent.value = false
  })
}
</script>
