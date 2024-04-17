<template>
  <div class="flex">
    <q-page-container>
      <div class="text-h6">Le récap de mes objectifs</div>

      <q-card
        v-for="objectif in objectifsPerso"
        :key="objectif.id"
        class="mx-2 cursor-pointer"
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
    </q-page-container>
    <q-page-container
      v-if="
        user &&
        user.roles.some((r) => r === 'ROLE_ADMIN' || r === 'ROLE_MANAGER')
      "
    >
      <div class="text-h6">Objectif de l'équipe</div>

      <q-card
        v-for="objectif in objectifsManager"
        :key="objectif.id"
        class="mx-2 cursor-pointer"
        @click="openObjectif(objectif)"
      >
        <q-card-section>
          <div class="text-black center p-5">
            {{ userList.find((u) => u.id === objectif.user_id).firstname }}
            {{ userList.find((u) => u.id === objectif.user_id).name }}
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
      <q-btn
        v-if="
          user &&
          user.roles.some((r) => r === 'ROLE_ADMIN' || r === 'ROLE_MANAGER')
        "
        color="primary"
        label="Ajouter un nouvel entretien"
        class="q-mt-md"
        @click="openPostPopup()"
      />
    </q-page-container>
  </div>
  <PopupManager
    v-if="editShowPopup"
    :editedRow="editedObj"
    :selectedKeys="['id', 'resume', 'date']"
    @update="updateRows"
  />
  <PopupManager
    v-if="postShowPopup"
    :editedRow="postObj"
    :selectedKeys="['resume', 'date', 'user_id']"
    @update="postRows"
  />
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "src/stores/auth";
import { useObjectifsStore } from "src/stores/objectifs";
import { onMounted } from "vue";
import { defineProps } from "vue";
import ObjectifForm from "components/ObjectifForm.vue";
import EditForm from "components/PopupManager.vue";

const user = ref(null);
const tab = ref("objectif");
const auth_store = useAuthStore();
const objectif_store = useObjectifsStore();
const showPopup = ref(false);
const props = defineProps({
  objectifs: Array,
  objectifsManager: Array,
});
const objectifsPerso = ref(props.objectifs);
const editedObj = ref(null);

const addObjectif = async () => {
  const date = prompt("Date de l'objectif (format: YYYY-MM-DD) :");
  const resume = prompt("Description de l'objectif :");

  if (date && resume) {
    console.log("toto");
  }
};
const editObjectif = async (objectif) => {
  editedObj.value = objectif;
  showPopup.value = true;
};
const updateRows = async (id, data) => {
  if (objectif_store.patchObjectif(data)) {
    setTimeout(async () => {
      await fetchRows();
    }, 1000);
  }
  showPopup.value = false;
};

const isOutOfDate = (date) => {
  return new Date(date) < new Date();
};

const openObjectif = (interview) => {
  editedObj.value = interview;
  editShowPopup.value = true;
};
const openPostPopup = () => {
  postObj.value = {
    resume: "",
    date: "",
    user_id: "",
  };
  postShowPopup.value = true;
};
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
