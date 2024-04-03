import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    userByManager: []
  }),
  getters: {
  },
  actions: {
    async getUsers() {
      try {
        const response = await axios.get('/api/users', {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.users = response.data
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },
    async getUserByManager(managerId) {
      try {
        if (!localStorage.getItem('token')) {
          return false
        }
        const response = await axios.get(`/api/users?manager_id=${managerId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })

        if (response.status !== 200) {
          return false
        }
        this.userByManager = response.data

        return true
      } catch (error) {
        console.error('Token verification failed:', error)
        return false
      }
    }
  }
})
