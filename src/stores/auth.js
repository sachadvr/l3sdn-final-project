import { defineStore } from 'pinia';
import axios from 'axios';
import { getCurrentInstance } from 'vue';

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
    notifyUser(message, type) {
      const instance = getCurrentInstance();
      if (instance) {
        instance.appContext.config.globalProperties.$notify(message, type);
      }
    },
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
    },
    async verifyToken() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
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
          this.logout();
          this.notifyUser('negative', 'Session expired or invalid. Please log in again.');
          return false;
        } else {
          this.this.notifyUser('negative', 'Unable to verify login. Please try again.');
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
  },
});


