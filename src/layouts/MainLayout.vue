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

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const user_store = useUserStore()

const darkmode = ref(false)
let user = ref(null)
onMounted(async () => {
  user.value = await useAuthStore().getCurrentUser()
  if (user.value && user.value.darkmode) {
    darkmode.value = user.value.darkmode
    return
  }
  if (user.value && await user_store.getUser(user.value.id)) {
    darkmode.value = user_store.currentuser.darkmode
  }

})

const getRoleFromRoute = (route) => {
  if (!route.meta) return []
  return route.meta.requiresRole
}

const essentialLinks = ref([
  {title: 'Tableau de bord', caption: '', icon: 'home', link: '/'},
  {title: 'Collaborateurs', caption: '', icon: 'people', link: '/manage',},
  {title: 'Mes entretiens', caption: '', icon: 'assignment', link: '/interviews'},
  {title: 'Se déconnecter', caption: '', icon: 'logout', link: '/logout'}
])

const filteredLinks = computed(() => {
  return essentialLinks.value.filter(link => {
    const route = routes.find(r => r.path === link.link)
    const role = getRoleFromRoute(route)
    return user.value.roles.some(r => role.includes(r) || role.length === 0)
  })
})

watch(
  () => route.fullPath,
  async () => {
    user.value = await useAuthStore().getCurrentUser()
    if (user.value && user.value.darkmode) {
      darkmode.value = user.value.darkmode
      return
    }
    if (user.value && await user_store.getUser(user.value.id)) {
      darkmode.value = user_store.currentuser.darkmode
    }

  }
)

watch(
  () => darkmode.value,
  () => {
    $q.dark.set(darkmode.value)

    useUserStore().updateUser(user.value.id, {darkmode: darkmode.value})
  }
)

const onItemClick = (link) => {
  router.push(link.link)
}

const toggleDarkMode = () => {
  $q.dark.toggle()
}
</script>

<style>
.ml-5 {
  margin-left: 5px;
}
</style>
