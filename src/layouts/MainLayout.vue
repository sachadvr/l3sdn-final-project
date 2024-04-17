<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-btn-dropdown v-if="user" color="black" :label="route.title" dropdown-icon="menu" >
            <q-list>
              <q-item  v-for="link in filteredLinks" :key="link.title" clickable @click="onItemClick(link)">
                <q-item-section
                  v-if="link.icon"
                  avatar
                >
                  <q-icon :name="link.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ link.title }}</q-item-label>
                  <q-item-label caption>{{ link.caption }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

        <q-toolbar-title v-if="!user">RH Manager</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import routes from 'src/router/routes'
import { onMounted, watch } from 'vue'
import { useAuthStore } from 'stores/auth'

const route = useRoute();
const router = useRouter();
const leftDrawerOpen = ref(false)

let user = ref(null);
onMounted(async () => {
  user.value = await useAuthStore().getCurrentUser()
})

const getRoleFromRoute = (route) => {
  if (!route.meta) return []
  return route.meta.requiresRole
}

const essentialLinks = ref([
  { title: 'Tableau de bord', caption: '', icon: 'home', link: '/'},
  { title: 'Collaborateurs', caption: '', icon: 'people', link: '/manage', },
  { title: 'Mes entretiens', caption: '', icon: 'assignment', link: '/interviews'},
  { title: 'Se déconnecter', caption: '', icon: 'logout', link: '/logout'}
]);

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
  }
);


const onItemClick = (link) => {
  router.push(link.link)
}

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

