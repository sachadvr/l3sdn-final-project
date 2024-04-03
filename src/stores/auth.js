import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  getters: {
    getToken() {
      return localStorage.getItem('token')
    },
    hasRole(role) {
      return this.user && this.user.roles.includes(role)
    },
    isLoggedIn() {
      return !!this.user
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

        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },
    logout() {
      this.user = null
      localStorage.removeItem('token')
    },
    async verifyToken() {
      try {
        if (!localStorage.getItem('token')) {
          return false
        }
        const response = await axios.post('/api/verifyToken', {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })

        if (response.status !== 200) {
          this.logout()
          return false
        }
        const { id, username, role } = response.data
        this.user = {
          id: id,
          username: username,
          roles: [role]
        }
        return true
      } catch (error) {
        console.error('Token verification failed:', error)
        this.logout()
        return false
      }
    },
    async getCurrentUser() {
      if (!this.user) {
        await this.verifyToken()
      }
      return this.user
    },
  },
})
