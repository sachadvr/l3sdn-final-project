<template>
    <q-page padding>
      <div class="row q-col-gutter-md">
        <!-- Nombre de managés -->
        <div class="col-xs-12 col-md-6">
          <q-card>
            <q-card-section>
              Nombre de managés: {{ nombreDeManages }}
            </q-card-section>
          </q-card>
        </div>
  
        <!-- Mon manager -->
        <!-- Dans ce cas, l'utilisateur est l'admin donc pas de manager -->
        <!-- Nous affichons cette carte pour la structure du tableau de bord -->
        <div class="col-xs-12 col-md-6">
          <q-card>
            <q-card-section>
              Mon manager: {{ managerInfo.name || 'Non assigné' }}
            </q-card-section>
          </q-card>
        </div>
  
        <!-- Prochain entretien -->
        <div class="col-xs-12 col-md-6">
          <q-card>
            <q-card-section>
              Prochain entretien: {{ prochainEntretien }}
            </q-card-section>
          </q-card>
        </div>
  
        <!-- Mon prochain entretien personnel -->
        <div class="col-xs-12 col-md-6">
          <q-card>
            <q-card-section>
              Mon prochain entretien personnel: {{ entretienPersonnel }}
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  // Données simulées pour les entretiens, à remplacer par les données réelles de votre backend
  const prochainEntretien = 'Aucun';
  const entretienPersonnel = 'Aucun';
  
  // Références pour stocker les données de l'API
  const nombreDeManages = ref(0);
  const managerInfo = ref({});
  
  // Simule l'utilisateur connecté comme l'administrateur
  const userId = 1;  // L'ID de l'admin dans user.json
  
  onMounted(async () => {
    try {
      // Récupération de tous les utilisateurs
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: { 'Authorization': `Bearer votre-jwt-ici` }
      });
  
      // Filtrer les utilisateurs pour trouver ceux managés par l'admin
      const manages = response.data.filter(user => user.manager_id === userId);
      nombreDeManages.value = manages.length;
  
      // Trouver les informations du manager de l'utilisateur connecté (dans ce cas, c'est l'admin donc pas de manager)
      const manager = response.data.find(user => user.id === userId);
      if (manager && manager.manager_id) {
        const managerDetails = response.data.find(user => user.id === manager.manager_id);
        managerInfo.value = managerDetails || {};
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données', error);
      // Afficher une notification ou gérer l'erreur comme il se doit
    }
  });
  </script>
  