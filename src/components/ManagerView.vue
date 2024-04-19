<template>
  <div class="bg-light p-5">
  <q-input
    v-model="filter"
    filled
    placeholder="Rechercher un utilisateur"
    dense
    icon="search"
    clearable
  >
    <template v-slot:before>
      <q-icon name="search"/>
    </template>
  </q-input>
  </div>
  <q-table
    :rows="rows.map((r) => ({id: r.id, name: r.name, firstname: r.firstname }))"
    row-key="nom"
    :visible-columns="['name', 'firstname']"
    :columns="[
      {name: 'name', label: 'Nom', align: 'left', field: 'name'},
      {name: 'firstname', label: 'Prénom', align: 'left', field: 'firstname'},
    ]"
    flat bordered
    :filter="filter"
    @row-click="onRowClick"
  >
  </q-table>
  <EditForm v-if="show"
            :editedRow="editedRow" :delete="true"
            :selected-keys="['id','name','firstname','job', 'salary', 'phone', 'address']" @update="updateRows"
            @cancel="() => show = false"
            @on-delete="deleteRow"

  />
</template>

<script setup>
import {useAuthStore} from 'src/stores/auth'
import {onMounted, ref} from 'vue'
import EditForm from 'components/PopupManager.vue'
import {useQuasar} from 'quasar'
import {useUserStore} from 'src/stores/users'
import PopupManager from 'components/PopupManager.vue'

const auth_store = useAuthStore()
const user_store = useUserStore()

const user = ref(null)
const rows = ref([])
const filter = ref('')
const show = ref(false)
const editedRow = ref({})
const $q = useQuasar()

async function fetchRows() {
  await user_store.getUserByManager(user.value.id)
  rows.value = user_store.userByManager
}

onMounted(async () => {
  user.value = await auth_store.getCurrentUser()
  await fetchRows()
})

const editRow = (row) => {
  editedRow.value = {...row}
  show.value = true
}

const updateRows = async (id, data) => {
  if (user_store.update(id, data)) {
    $q.notify({
      type: 'positive',
      position: 'bottom',
      message: 'Utilisateur mis à jour avec succès',
    })

  }
  setTimeout(async () => {
    await fetchRows()
  }, 1000)
  show.value = false
}
const onRowClick = (evt, row) => {
  const currentRow = rows.value.find((r) => r.id === row.id)
  editRow(currentRow)
}

const deleteRow = async (id) => {
  if (user_store.deleteUser(id)) {
    setTimeout(async () => {
      $q.notify({
        type: 'positive',
        position: 'bottom',
        message: 'Utilisateur supprimé avec succès',
      })
      await fetchRows()
    }, 1000)
  }
  show.value = false
}

</script>

<style>
.p-5 {
  padding: 5px;
}
</style>
