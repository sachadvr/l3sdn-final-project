<template>
  <div class="q-pa-md">
<!--    add search -->
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
      <EditForm v-if="show" :editedRow="editedRow" @update="(val) => show = val" @edit="(data) => {
        const index = rows.findIndex((r) => r.id === data.id);
        rows[index] = data;

      }"/>
  </div>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth'
import { onMounted, ref } from 'vue'
import EditForm from 'components/PopupManager.vue'

const store = useAuthStore();
const user = ref(null);
const rows = ref([
  {
    id: 1,
    nom: 'Sacha Duvivier',
    poste: 'Développeur',
    age: 22,
    surname: 'Sacha',
    manager: 'Geoffrey Pecro',
    employee: true
  },
  {
    id: 2,
    nom: 'Geoffrey Pecro',
    poste: 'Manager',
    age: 30,
    surname: 'Geoff',
    manager: 'Charles De Potter',
    employee: true
    }
]);

const filter = ref('');
const show = ref(false);
const editedRow = ref({});

onMounted(async () => {
  user.value = await store.getCurrentUser();
});

const editRow = (row) => {
  editedRow.value = { ...row };
  console.log('Editing row:', editedRow.value);
  show.value = true;
};
const onRowClick = (evt, row) => {
  const currentRow = rows.value.find((r) => r.nom === row.nom);
  editRow(currentRow);
};
</script>
