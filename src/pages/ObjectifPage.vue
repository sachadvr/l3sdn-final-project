<template>
  <div class="flex">
    <q-page-container v-if="user">
      <div class="text-h6">Le récap de mes objectifs</div>

      <q-card
        v-for="objectif in objectifsPerso"
        :key="objectif.id"
        class="mx-2" :class="{'cursor-pointer': user.roles.some(r => r === 'ROLE_MANAGER' || r === 'ROLE_RH')}"
        @click="openObjectif(objectif)"
      >
        <q-card-section>
          <div
            class="text-h6 w-fit"
            v-bind:class="
              isOutOfDate(objectif.date) ? 'bg-negative' : 'bg-primary'
            "
          >
            Objectif du {{ objectif.date }}
          </div>
          <div class="text-subtitle2">Résumé</div>
          <div>{{ objectif.resume }}</div>
        </q-card-section>
      </q-card>

      <div v-if="objectifsPerso && objectifsPerso.length === 0">Aucun objectif enregistré</div>
    </q-page-container>
    <q-page-container
      v-if="
        user &&
        user.roles.some((r) => r === 'ROLE_MANAGER' || r === 'ROLE_RH')
      "
    >
      <div class="text-h6">Objectif de l'équipe</div>

      <q-card
        v-for="objectif in objectifsManager"
        :key="objectif.id"
        class="mx-2" :class="{'cursor-pointer': user.roles.some(r => r === 'ROLE_MANAGER' || r === 'ROLE_RH')}"
        @click="openObjectif(objectif)"
      >
        <q-card-section>
          <div v-if="userList && userList.find((u) => u.id == objectif.user_id)" class="text-primary center p-5">
            {{ userList.find((u) => u.id == objectif.user_id).name }}
            {{ userList.find((u) => u.id == objectif.user_id).firstname }}
          </div>
          <div v-if="user && user.roles.some(r => r === 'ROLE_RH') && userList && userList.find((u) => u.id == objectif.manager_id)" class="text-primary center p-5">
            Manager :
            {{userList.find((u) => u.id == objectif.manager_id).name }}
            {{userList.find((u) => u.id == objectif.manager_id).firstname}}
          </div>
          <div
            class="text-h6 w-fit"
            v-bind:class="
              isOutOfDate(objectif.date) ? 'bg-negative' : 'bg-primary'
            "
          >
            Objectif du {{ objectif.date }}
          </div>
          <div class="text-subtitle2">Résumé</div>
          <div>{{ objectif.resume }}</div>
        </q-card-section>
      </q-card>
      <div v-if="objectifsManager && objectifsManager.length === 0">Aucun objectif enregistré</div>
      <q-btn
        v-if="
          user &&
          user.roles.some((r) => r === 'ROLE_MANAGER' || r === 'ROLE_RH')
        "
        color="primary"
        label="Ajouter un nouvel objectif"
        class="q-mt-md"
        @click="openPostPopup()"
      />
    </q-page-container>
  </div>
  <PopupManager
    v-if="editShowPopup"
    :editedRow="editedObj"
    :selectedKeys="['id', 'resume', 'date']"
    :delete="true"
    @on-delete="deleteRow"
    @update="updateRows"
    @cancel="() => (editShowPopup = false)"
  />
  <PopupManager
    v-if="postShowPopup"
    :editedRow="postObj"
    :selectedKeys="user.roles.some(r => r === 'ROLE_RH') ? ['resume', 'user_id','manager_id', 'date'] : ['resume', 'user_id','date']"
    @update="postRows"
    @cancel="() => (postShowPopup = false)"
  />
</template>

<script setup>
import {ref} from 'vue'
import {useAuthStore} from 'src/stores/auth'
import {useObjectifsStore} from 'src/stores/objectifs'
import {onMounted} from 'vue'
import {defineProps} from 'vue'
import {useQuasar} from 'quasar'
import {useUserStore} from 'src/stores/users'
import PopupManager from 'components/PopupManager.vue'

const user = ref(null)
const editShowPopup = ref(false)
const postShowPopup = ref(false)

const $q = useQuasar()
const auth_store = useAuthStore()
const user_store = useUserStore()
const objectif_store = useObjectifsStore()


const props = defineProps({
  objectifs: Array,
  objectifManager: Array,
})
const objectifsPerso = ref(props.objectifs)
const objectifsManager = ref(props.objectifManager)

const editedObj = ref(null)
const postObj = ref(null)
const userList = ref([])
onMounted(async () => {
  user.value = await auth_store.getCurrentUser()
  if (user.value.roles.some((r) => r === 'ROLE_RH')) {
    await user_store.getUsers({all: true})
    userList.value = user_store.users

    return
  }
  if (await user_store.getUserByManager(user.value.id)) {
    userList.value = user_store.userByManager
  }
})
const updateRows = async (id, data) => {
  if (objectif_store.patchObjectif(data)) {
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Objectif modifié avec succès',
    })
  }
  editShowPopup.value = false
}

const postRows = async (id, data) => {
  data.user_id = parseInt(data.user_id.id)
  postShowPopup.value = false
  let current_user = data.manager_id ? data.manager_id.id : user.value.id
  if (true === await objectif_store.postObjectif(data, current_user)) {
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Objectif ajouté avec succès',
    })
    return
  }
  $q.notify({
    color: 'negative',
    position: 'bottom',
    message: 'Erreur lors de l\'ajout de l\'objectif',
  })
}

const isOutOfDate = (date) => {
  return new Date(date) < new Date()
}

const openObjectif = (interview) => {
  if (user.value.roles.some((r) => r === 'ROLE_MANAGER' || r === 'ROLE_RH')) {
    editedObj.value = interview
    editShowPopup.value = true
  }
}
const openPostPopup = () => {
  postObj.value = {
    resume: '',
    date: '',
    user_id: '',
    manager_id: ''
  }
  postShowPopup.value = true
}
const deleteRow = async (id) => {
  if (objectif_store.deleteObjectif(id)) {
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Objectif supprimé avec succès',
    })
  }
  editShowPopup.value = false
}
</script>

<style>
.q-card {
  border-radius: 12px;
}

.mx-2 {
  margin-top: 10px;
}

.w-fit {
  width: fit-content;
  color: white;
  padding: 0 1rem;
}

.flex {
  display: flex;
  gap: 2rem;
}

.center {
  text-align: center;
}

.q-page-container {
  flex: 1;
}

.bg-primary,
.bg-negative {
  border-radius: 12px;
}
</style>
