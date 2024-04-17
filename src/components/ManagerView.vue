<template>
  <q-input
    v-model="filter"
    filled
    placeholder="Search"
    dense
    icon="search"
    clearable
  >
    <template v-slot:before>
      <q-icon name="search"/>
    </template>
  </q-input>
  <q-table
    :rows="rows.map((r) => ({id: r.id, name: r.name, firstname: r.firstname }))"
    row-key="nom"
    flat bordered
    :filter="filter"
    @row-click="onRowClick"
  >
  </q-table>
  <EditForm v-if="show"
            :editedRow="editedRow" :delete="true"

            :selected-keys="['id','name','firstname','job', 'salary']" @update="updateRows"
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
  user_store.update(id, data)
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
