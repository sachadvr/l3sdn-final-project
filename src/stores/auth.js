import { defineStore } from 'pinia';
import axios from 'axios';
import { useQuasar } from 'quasar';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  getters: {
    getToken() {
      return localStorage.getItem('token');
    },
    hasRole(role) {
      return this.user && this.user.roles.includes(role);
    },
    isLoggedIn() {
      return !!this.user;
    }
  },
  actions: {
    async login(username, password) {
      try {
        const response = await axios.post('/api/login', { username, password });
        const { user, token } = response.data;
        this.user = {
          id: user.id,
          username: user.username,
          roles: [user.role]
        };
        localStorage.setItem('token', token);
        return true;
      } catch (error) {
        this.notifyUser('negative', 'Login failed. Please check your username and password.');
        return false;
      }
    },
    logout() {
      this.user = null;
      localStorage.removeItem('token');
      this.notifyUser('warning', 'Logged out successfully.');
    },
    async verifyToken() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.notifyUser('warning', 'No token found. Please log in.');
          return false
        }
        const response = await axios.post('/api/login/verify', {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.status === 200) {
          const { id, username, role } = response.data;
          this.user = {
            id,
            username,
            roles: [role]
          };
          return true;
        } else if (response.status === 401 || response.status === 403) {
          // Assume that these statuses mean the token is invalid/expired
          this.logout();
          this.notifyUser('negative', 'Session expired or invalid. Please log in again.');
          return false;
        } else {
          // Handle other statuses without logging out the user
          this.notifyUser('negative', 'Unable to verify login. Please try again.');
          return false;
        }
      } catch (error) {
        this.notifyUser('negative', 'Token verification failed due to network or server error. Please try again later.');
        this.logout()
        return false
      }
    },
    async getCurrentUser() {
      if (!this.user) {
        return await this.verifyToken() ? this.user : null;
      }
      return this.user;
    },
    notifyUser(type, message) {
      const $q = useQuasar();
      $q.notify({
        type: type,
        message: message
      });
    }
  },
});
