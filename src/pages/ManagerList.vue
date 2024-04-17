<template>
  <div class="q-pa-md">
    <ManagerList />

    <q-btn
      color="primary"
      label="Ajouter un nouvel utilisateur"
      class="q-mt-md"
      @click="newUser()"
    />
    <PopupManager
      v-if="postShowPopup"
      :editedRow="editedUser"
      :selectedKeys="['name', 'firstname', 'username', 'password', 'role', 'manager_id', 'job', 'salary']"
      @update="createRow"
    />
  </div>
</template>

<script setup>
import ManagerList from 'src/components/ManagerView.vue'
import PopupManager from 'components/PopupManager.vue'
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useUserStore } from 'stores/users'
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const auth_store = useAuthStore();
const user_store = useUserStore();


const user = ref(null);
const postShowPopup = ref(false);
const editedUser = ref(null);

onMounted(async () => {
  user.value = await auth_store.getCurrentUser();
});

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
  };
  postShowPopup.value = true;
};
const createRow = async (id, data) => {
  data.manager_id = parseInt(data.manager_id.id)
  if (user_store.createuser(data)) {
    postShowPopup.value = false;
    $q.notify({
      type: 'positive',
      position: 'bottom',
      message: 'Utilisateur ajouté avec succès',
    });
  }
};

</script>
<style>
.ml-5 {
  margin-left: 5px;
}
</style>
