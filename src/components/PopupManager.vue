<template>
  <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
    <q-card class="bg-light text-primary width-fit" style="width: 300px">
      <q-form @submit="submit">
        <q-card-section>
          <div v-for="(key, value) in Object.keys(form).filter((i,v) => i !== 'id')" :key="value">
            <q-select
              v-if="key === 'user_id'"
              v-model="form[key]"
              :label="translations[key]"

              :options="list_of_users"
              option-label="name"
              option-value="id"
            />
            <q-select
              v-else-if="key === 'manager_id'"
              v-model="form[key]"
              :label="translations[key]"
              :options="list_of_managers"
              option-label="name"
              option-value="id"
            />
            <q-select
              v-else-if="key === 'role'"
              v-model="form[key]"
              :label="translations[key]"
              :options="['ROLE_USER', 'ROLE_MANAGER', 'ROLE_RH']"
            />
            <q-date
              v-else-if="key === 'date'"
              v-model="form[key]"
              :label="translations[key]"
              minimal
            />
            <q-rating
              v-else-if="key === 'rating'"
              v-model="form[key]"
              size="2em"
              class="mt-1"
              :max="5"
              color="primary"
            />
            <q-input
              v-else
              v-model="form[key]"
              :label="translations[key]"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Annuler" color="secondary" flat @click="cancel"/>
          <q-btn v-if="deleteMode" label="Supprimer" color="negative" flat @click="deleteItem"/>
          <q-btn label="Sauvegarder" color="primary" text @click="submit"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {ref, defineProps, defineEmits, watch} from 'vue'
import {onMounted} from 'vue'
import {useUserStore} from 'src/stores/users'
import {useAuthStore} from 'stores/auth'

const user_store = useUserStore()
const auth_store = useAuthStore()

const props = defineProps({
  editedRow: Object,
  selectedKeys: Array,
  delete: {
    type: Boolean,
    default: false
  }
})


const emits = defineEmits(['update', 'onDelete'])

const persistent = ref(true)

const form = ref({})

const list_of_users = ref([])
const list_of_managers = ref([])
const user = ref({})
const deleteMode = ref(false)

const translations = {
  user_id: 'Utilisateur',
  manager_id: 'Manager',
  role: 'Rôle',
  date: 'Date',
  resume: 'Résumé/Description',
  rating: 'Note',
  name: 'Nom',
  firstname: 'Prénom',
  job: 'Emploi',
  salary: 'Salaire',
  phone: 'Téléphone',
  address: 'Adresse',
  username: 'Nom d\'utilisateur',
  password: 'Mot de passe',
}

const cancel = () => {
  persistent.value = false
  emits('cancel')
}
onMounted(async () => {
  props.selectedKeys.forEach(key => {
    form.value[key] = props.editedRow[key]
  })
  user.value = await auth_store.getCurrentUser()
  if (await user_store.getUserByManager(user.value.id)) {
    list_of_users.value = user_store.userByManager
  }

  deleteMode.value = props.delete

  list_of_managers.value = await user_store.getManagers()

})

const submit = () => {
  emits('update', form.value.id, form.value)
  persistent.value = false
}
const deleteItem = () => {
  emits('onDelete', form.value.id)
  persistent.value = false
}
</script>


<style>
.mt-1 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.q-date {
  width: 100%;
  color: black;
}

.body--dark .q-date {
  color: white;
}

.width-fit {
  width: 1200px !important;
}
</style>
