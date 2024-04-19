import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  getters: {
    getToken(state) {
      return localStorage.getItem('token')
    },
    hasRole(state) {
      return (role) => state.user && state.user.roles.includes(role)
    },
    isLoggedIn(state) {
      return !!state.user
    }
  },
  actions: {
    async login(username, password) {
      try {
        const response = await axios.post('/api/login', { username, password })
        const { user, token } = response.data
        this.user = {
          id: user.id,
          username: user.username,
          roles: [user.role]
        }
        localStorage.setItem('token', token)
        return { success: true }
      } catch (error) {
        return { success: false, message: 'Identifiant ou mot de passe incorrect' }
      }
    },
    logout() {
      this.user = null
      localStorage.removeItem('token')
      return { success: true, message: 'Vous avez été déconnecté.' }
    },
    async verifyToken() {
      try {
        const token = this.getToken
        if (!token) {
          return { success: false, message: 'No token found. Please log in.' }
        }
        const response = await axios.post('/api/login/verify', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.status === 200) {
          const { id, username, role } = response.data
          this.user = {
            id,
            username,
            roles: [role]
          }
          return { success: true }
        } else {
          this.logout()
          return { success: false, message: 'Session expired or invalid. Please log in again.' }
        }
      } catch (error) {
        this.logout()
        return { success: false, message: 'Token verification failed due to network or server error. Please try again later.' }
      }
    },
    async getCurrentUser() {
      if (!this.user) {
        const verifyResult = await this.verifyToken()
        return verifyResult.success ? this.user : null
      }
      return this.user
    },
  },
})
