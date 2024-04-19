<template>
  <div class="q-pa-md">
    <q-card>
      <q-tabs
        v-model="tab"
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="interview" label="Travail effectué cette année"/>
        <q-tab name="obj" label="Objectifs"/>
        <q-tab name="obj-next" label="Objectifs de l'année prochaine"/>
      </q-tabs>
      <q-separator/>
      <q-tab-panels v-model="tab">
        <q-tab-panel name="interview">
          <div class="flex">
            <q-page-container>
              <div class="text-h6">Le récap de mes interviews</div>

              <q-card
                v-for="interview in interviewsPerso"
                :key="interview.id"
                class="mx-2" :class="{'cursor-pointer': user.roles.some(r => r === 'ROLE_MANAGER' || r === 'ROLE_RH')}"
                @click="openInterview(interview)"
              >
                <q-card-section>
                  <div
                    class="text-h6 w-fit"
                    v-bind:class="
                      isOutOfDate(interview.date) ? 'bg-negative' : 'bg-primary'
                    "
                  >
                    Interview du {{ interview.date }}
                  </div>
                  <div class="text-subtitle2">Résumé</div>
                  <div>{{ interview.resume }}</div>
                  <q-rating
                    v-model="interview.rating"
                    size="2em"
                    :max="5"
                    disable
                    color="primary"
                  />
                </q-card-section>
              </q-card>
              <div v-if="interviewsPerso && interviewsPerso.length === 0">Aucun entretien enregistré</div>
            </q-page-container>
            <q-page-container
              v-if="
                user &&
                user.roles.some(
                  (r) => r === 'ROLE_MANAGER' || r === 'ROLE_RH'
                )
              "
            >
              <div class="text-h6">Interview de l'équipe</div>

              <q-card
                v-for="interview in interviewsManager"
                :key="interview.id"
                class="mx-2 cursor-pointer"
                @click="openInterview(interview)"
              >
                <q-card-section>
                  <div v-if="userList && userList.find((u) => u.id === interview.user_id)" class="text-primary center p-5" >
                    {{
                      userList.find((u) => u.id === interview.user_id).firstname
                    }}
                    {{ userList.find((u) => u.id === interview.user_id).name }}
                  </div>
                  <div v-if="user && user.roles.some(r => r === 'ROLE_RH') && userList && userList.find((u) => u.id == interview.manager_id)" class="text-primary center p-5">
                    Manager :
                    {{userList.find((u) => u.id == interview.manager_id).name }}
                    {{userList.find((u) => u.id == interview.manager_id).firstname}}
                  </div>
                  <div
                    class="text-h6 w-fit"
                    v-bind:class="
                      isOutOfDate(interview.date) ? 'bg-negative' : 'bg-primary'
                    "
                  >
                    Interview du {{ interview.date }}
                  </div>
                  <div class="text-subtitle2">Résumé</div>
                  <div>{{ interview.resume }}</div>
                  <q-rating
                    v-model="interview.rating"
                    size="2em"
                    :max="5"
                    disable
                    color="primary"
                  />
                </q-card-section>
              </q-card>
              <div v-if="interviewsManager && interviewsManager.length === 0">Aucun entretien enregistré</div>

              <q-btn
                v-if="
                  user &&
                  user.roles.some(
                    (r) => r === 'ROLE_MANAGER' || r === 'ROLE_RH'
                  )
                "
                color="primary"
                label="Ajouter un nouvel entretien"
                class="q-mt-md"
                @click="openPostPopup()"
              />
            </q-page-container>
          </div>
        </q-tab-panel>
        <q-tab-panel name="obj">
          <div class="text-h6">Mes objectifs de cette année</div>
          <ObjectifPage :objectifs="objectifs" :objectifManager="objectifsManager"/>
        </q-tab-panel>
        <q-tab-panel name="obj-next">
          <div class="text-h6">Objectifs de l'année prochaine</div>
          <ObjectifPage :objectifs="objectifsNextYear" :objectifManager="objectifsNextYearManager"/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <PopupManager
      v-if="editShowPopup"
      :editedRow="editedObj"
      :selectedKeys="['id', 'resume', 'date', 'rating']"
      :delete="true"
      @on-delete="deleteRow"
      @update="updateRows"
      @cancel="() => (editShowPopup = false)"
    />
    <PopupManager
      v-if="postShowPopup"
      :editedRow="postObj"
      :selectedKeys="['resume', 'date', 'user_id', 'rating']"
      @update="postRows"
      @cancel="() => (postShowPopup = false)"
    />
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useAuthStore} from 'src/stores/auth'
import {useInterviewsStore} from 'src/stores/interviews'
import {useObjectifsStore} from 'src/stores/objectifs'
import {useUserStore} from 'src/stores/users'
import {onMounted} from 'vue'
import {useQuasar} from 'quasar'
import {watch} from 'vue'
import {useRouter} from 'vue-router'

const $q = useQuasar()
const router = useRouter()
import ObjectifPage from 'pages/ObjectifPage.vue'
import PopupManager from 'components/PopupManager.vue'

const user = ref(null)
const interviewsPerso = ref([])
const interviewsManager = ref([])
const objectifs = ref([])
const objectifsManager = ref([])
const objectifsNextYear = ref([])
const objectifsNextYearManager = ref([])

const editShowPopup = ref(false)
const editedObj = ref(null)

const postShowPopup = ref(false)
const postObj = ref(null)

const updateRows = async (id, data) => {
  editShowPopup.value = false

  if (await interviews_store.patchInterview(data)) {
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Entretien mis à jour avec succès',
    })
  }
}

const deleteRow = async (id) => {
  editShowPopup.value = false

  if (await interviews_store.deleteInterview(id)) {
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Entretien supprimé avec succès',
    })
  }
}
const postRows = async (id, data) => {
  postShowPopup.value = false

  if (data && data.user_id) {
    data.user_id = parseInt(data.user_id.id)
  }
  if (data && await interviews_store.postInterview(data, user.value.id)) {
    $q.notify({
      color: 'positive',
      position: 'bottom',
      message: 'Entretien ajouté avec succès',
    })
  }else{
    $q.notify({
      color: 'negative',
      position: 'bottom',
      message: 'Erreur lors de l\'ajout de l\'entretien',
    })
  }
}

const tab = ref('interview')
const auth_store = useAuthStore()
const interviews_store = useInterviewsStore()
const objectif_store = useObjectifsStore()
const user_store = useUserStore()
let userList = []

onMounted(async () => {
  user.value = await auth_store.getCurrentUser()
  if (await interviews_store.fetchInterviews(user.value.id)) {
    interviewsPerso.value = interviews_store.interviews.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
  }
})

onMounted(async () => {
  user.value = await auth_store.getCurrentUser()

  if (await interviews_store.fetchManagerInterviews(user.value.id)) {
    interviewsManager.value = interviews_store.managerInterviews.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
  }

})

onMounted(async () => {
  user.value = await auth_store.getCurrentUser()

  if (
    await objectif_store.fetchObjectifs(user.value.id, {
      year: new Date().getFullYear(),
    })
  ) {
    objectifs.value = objectif_store.objectifs
  }

})
onMounted(async () => {
  user.value = await auth_store.getCurrentUser()

  if (
    await objectif_store.fetchObjectifs(user.value.id, {
      year: new Date().getFullYear() + 1,
    })
  ) {
    objectifsNextYear.value = objectif_store.objectifs
  }
})

onMounted(async () => {
  user.value = await auth_store.getCurrentUser()
  objectifsManager.value = await objectif_store.fetchObjectifsByManager(
    user.value.id,
    new Date().getFullYear()
  )
})

onMounted(async () => {
  user.value = await auth_store.getCurrentUser()
  objectifsNextYearManager.value = await objectif_store.fetchObjectifsByManager(
    user.value.id,
    new Date().getFullYear() + 1
  )
})

onMounted(async () => {
  if (await user_store.getUsers({all: true})) {
    userList = user_store.users
  }
})

const isOutOfDate = (date) => {
  return new Date(date) < new Date()
}

const openInterview = (interview) => {
  if (
    user.value.roles.some(
      (r) => r === 'ROLE_MANAGER' || r === 'ROLE_RH'
    )
  ) {
    editedObj.value = interview
    editShowPopup.value = true
  }
}
const openPostPopup = () => {
  postObj.value = {
    resume: '',
    rating: 0,
    date: '',
    user_id: '',
  }
  postShowPopup.value = true
}

watch(
  () => tab.value,
  async () => {
    router.push({query: {tab: tab.value}})
  }
)
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
