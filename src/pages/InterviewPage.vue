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
        <q-tab name="interview" label="Travail effectué cette année" />
        <q-tab name="obj" label="Objectifs" />
        <q-tab name="obj-next" label="Objectifs de l'année prochaine" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab">
        <q-tab-panel name="interview">
          <div class="text-h6">Le récap de mes interviews</div>

        </q-tab-panel>

        <q-tab-panel name="obj">
          <div class="text-h6">Mes objectifs de cette année</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="obj-next">
          <div class="text-h6">Objectifs de l'année prochaine</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('interview')
</script>

