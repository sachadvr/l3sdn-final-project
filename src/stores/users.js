import { defineStore } from 'pinia';
import axios from 'axios';

// Import du fichier JSON des utilisateurs
import usersData from '../../backend/user.json';

// Données factices pour les entretiens
const interviewsData = [
  { userId: 3, date: '2024-04-20', type: 'Performance Review' },
  { userId: 4, date: '2024-04-22', type: '1-on-1' },
  { userId: 5, date: '2024-04-25', type: 'Career Development' }
];

export const useUserStore = defineStore('users', {
  state: () => ({
    users: usersData,
    userByManager: [],
    interviews: interviewsData,
  }),
  getters: {
    // Getter pour récupérer tous les entretiens d'un utilisateur
    getUserInterviews: (state) => {
      return (userId) => state.interviews.filter(interview => interview.userId === userId);
    },
    // Getter pour récupérer la liste des managés d'un manager donné
    getManagedUsers: (state) => {
      return (managerId) => state.users.filter(user => user.manager_id === managerId);
    },
    // Getter pour récupérer le prochain entretien personnel de l'utilisateur
    getNextPersonalInterview: (state) => {
      // On trie les entretiens par date
      const sortedInterviews = state.interviews.sort((a, b) => new Date(a.date) - new Date(b.date));
      // On retourne le premier entretien personnel à venir
      return sortedInterviews.find(interview => interview.type === '1-on-1');
    },
  },
  actions: {
    // Actions pour interagir avec les données
    async getUser(id) {
      try {
        const response = await axios.get(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        return false;
      }
    },
    async getUsers() {
      try {
        const response = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.users = response.data;
        return true;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      }
    },
    async getUserByManager(managerId) {
      try {
        if (!localStorage.getItem('token')) {
          return false;
        }
        const response = await axios.get(`/api/users?manager_id=${managerId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (response.status !== 200) {
          return false;
        }
        this.userByManager = response.data;

        return true;
      } catch (error) {
        console.error('Token verification failed:', error);
        return false;
      }
    },
    async update(id, data) {
      try {
        const response = await axios.patch(`/api/users/${id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
      } catch (error) {
        console.error('Failed to update user:', error);
        return false;
      }
    },
    // Vous pouvez ajouter d'autres actions si nécessaire
  }
});
