<template>
  <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
    <q-card class="bg-white text-white width-fit" style="width: 300px">
      <q-form @submit="submit">
        <q-card-section>
          <div v-for="(key, value) in Object.keys(form).filter((i,v) => i !== 'id')" :key="value">
            <q-select
              v-if="key === 'user_id'"
              v-model="form[key]"
              :label="key"
              :options="list_of_users"
              option-label="name"
              option-value="id"
            />
            <q-select
              v-else-if="key === 'manager_id'"
              v-model="form[key]"
              :label="key"
              :options="list_of_managers"
              option-label="name"
              option-value="id"
            />
            <q-date
              v-else-if="key === 'date'"
              v-model="form[key]"
              :label="key"
              minimal
            />
            <q-rating
              v-else-if="key === 'rating'"
              v-model="form[key]"
              size="2em"
              :max="5"
              color="primary"
            />
            <q-input
              v-else
              v-model="form[key]"
              :label="key"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Annuler" color="secondary" flat @click="cancel" />
          <q-btn label="Sauvegarder" color="primary" text @click="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {ref, defineProps, defineEmits, watch} from 'vue'
import {onMounted} from 'vue'
import { useUserStore } from 'src/stores/users'
import {useAuthStore} from 'stores/auth'
const user_store = useUserStore();
const auth_store = useAuthStore();

const props = defineProps({
  editedRow: Object,
  selectedKeys: Array
})


const emits = defineEmits(['update'])

const persistent = ref(true)

const form = ref({});

const list_of_users = ref([])
const list_of_managers = ref([])
const user = ref({})

const cancel = () => {
  persistent.value = false
  emits('update', false)
}
onMounted(async () => {
  props.selectedKeys.forEach(key => {
    form.value[key] = props.editedRow[key]
  })
  user.value = await auth_store.getCurrentUser()
  if (await user_store.getUserByManager(user.value.id)) {
    list_of_users.value = user_store.userByManager
  }

  list_of_managers.value = await user_store.getManagers()

});

const submit = () => {
  emits('update', form.value.id, form.value)
  persistent.value = false
}
</script>


<style>
.q-date {
  color:black;
  width: 100%;
}
.width-fit {
  width: 1200px!important;
}
</style>
