<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-btn-dropdown v-if="user" color="black" :label="route.title" dropdown-icon="menu">
          <q-list>
            <q-item v-for="link in filteredLinks" :key="link.title" clickable @click="onItemClick(link)">
              <q-item-section
                v-if="link.icon"
                avatar
              >
                <q-icon :name="link.icon"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ link.title }}</q-item-label>
                <q-item-label caption>{{ link.caption }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn
          icon="refresh"
          class="q-mr-sm ml-5"
          flat round dense
          @click="router.go()"
        />

        <q-checkbox
          v-if="user"
          v-model="darkmode"
          checked-icon="light_mode"
          unchecked-icon="dark_mode"
          dark
          color="red"
          class="ml-5"
        />
        <q-toolbar-title v-if="!user">RH Manager</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import routes from 'src/router/routes'
import {onMounted, watch} from 'vue'
import {useAuthStore} from 'stores/auth'
import {useQuasar} from 'quasar'
import {useUserStore} from 'stores/users'

const $q = useQuasar()
const authStore = useAuthStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const user = ref(null)
const darkmode = ref(false)

onMounted(async () => {
  user.value = authStore.user
  if (!user.value) {
    return
  }

  await userStore.getUser(user.value.id)

  if (userStore.currentuser) {
    darkmode.value = userStore.currentuser.darkmode ?? false
  }
})

watch(() => route.fullPath, async () => {
  if (route.fullPath === '/logout') {
    return
  }
  setTimeout(async () => {
    user.value = authStore.user
    if (!user.value) {
      return
    }
    await userStore.getUser(user.value.id)

    if (userStore.currentuser) {
      darkmode.value = userStore.currentuser.darkmode ?? false
    }
  }, 50)

})

watch(darkmode, (newValue) => {
  $q.dark.set(newValue)

  if (user.value) {
    userStore.updateUser(user.value.id, {darkmode: newValue})
  }
})

const onItemClick = (link) => {
  router.push(link.link)
}

const essentialLinks = ref([
  { title: 'Tableau de bord', caption: '', icon: 'home', link: '/' },
  { title: 'Collaborateurs', caption: '', icon: 'people', link: '/manage' },
  { title: 'Mes entretiens', caption: '', icon: 'assignment', link: '/interviews' },
  { title : 'Mon profil', caption: '', icon: 'account_circle', link: '/profile' },
  { title: 'Se déconnecter', caption: '', icon: 'logout', link: '/logout' }
])

const filteredLinks = computed(() => {
  return essentialLinks.value.filter(link => {
    const matchingRoute = routes.find(r => r.path === link.link)
    const rolesRequired = matchingRoute?.meta?.requiresRole || []
    return rolesRequired.length === 0 || rolesRequired.some(role => user.value?.roles.includes(role))
  })
})
</script>

<style>
.ml-5 {
  margin-left: 5px
}
</style>
