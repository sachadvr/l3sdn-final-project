<template>
  <div class="q-pa-md">
    <ManagerList/>

    <q-btn
      color="primary"
      label="Ajouter un nouvel utilisateur"
      class="q-mt-md"
      @click="newUser()"
    />
    <PopupManager
      v-if="postShowPopup"
      :editedRow="editedUser"
      :selectedKeys="['name', 'firstname', 'username', 'password', 'role', 'manager_id', 'job', 'salary', 'phone', 'address']"
      @update="createRow"
      @cancel="() => postShowPopup = false"
    />
  </div>
</template>

<script setup>
import ManagerList from 'src/components/ManagerView.vue'
import PopupManager from 'components/PopupManager.vue'
import {ref} from 'vue'
import {useAuthStore} from 'src/stores/auth'
import {useUserStore} from 'stores/users'
import {onMounted} from 'vue'
import {useQuasar} from 'quasar'

const $q = useQuasar()
const auth_store = useAuthStore()
const user_store = useUserStore()


const user = ref(null)
const postShowPopup = ref(false)
const editedUser = ref(null)

onMounted(async () => {
  user.value = await auth_store.getCurrentUser()
})

const newUser = () => {
  editedUser.value = {
    name: '',
    firstname: '',
    username: '',
    password: '',
    role: '',
    manager_id: '',
    job: '',
    salary: '',
  }
  postShowPopup.value = true
}
const createRow = async (id, data) => {
  postShowPopup.value = false

  if (data && data.manager_id) {
    data.manager_id = parseInt(data.manager_id.id)
  }
  let success = await user_store.createuser(data)
  if (false === success) {
    $q.notify({
      type: 'negative',
      position: 'bottom',
      message: user_store.error ? user_store.error : 'Erreur lors de la création de l\'utilisateur.',
    })

    return
  }
   $q.notify({
      type: 'positive',
      position: 'bottom',
      message: 'Utilisateur ajouté avec succès',
    })
    }


</script>
<style>
.ml-5 {
  margin-left: 5px
}
</style>
