<template>
  <div class="q-pa-md">
    <q-input
      v-model="filter"
      filled
      placeholder="Search"
      dense
      icon="search"
      clearable
    >
      <template v-slot:before>
        <q-icon name="search" />
      </template>
    </q-input>
    <q-table
      :rows="rows"
      row-key="nom"
      flat bordered
      :filter="filter"
      @row-click="onRowClick"
    >
    </q-table>
      <EditForm v-if="show" :editedRow="editedRow" @update="(val) => {
        show = val;

        fetchRows();
      }" @edit="(data) => {
        const index = rows.findIndex((r) => r.id === data.id);
        rows[index] = data;

      }"/>
  </div>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth'
import { onMounted, ref } from 'vue'
import EditForm from 'components/PopupManager.vue'
import { useUserStore } from 'src/stores/users'
const auth_store = useAuthStore();
const user_store = useUserStore();

const user = ref(null);
const rows = ref([]);
const filter = ref('');
const show = ref(false);
const editedRow = ref({});


async function fetchRows() {
  await user_store.getUserByManager(user.value.id);
  rows.value = user_store.userByManager;
}

onMounted(async () => {
  user.value = await auth_store.getCurrentUser();
  await fetchRows();
});

const editRow = (row) => {
  editedRow.value = { ...row };
  show.value = true;
};

const onRowClick = (evt, row) => {
  const currentRow = rows.value.find((r) => r.id === row.id);
  editRow(currentRow);
};
</script>
