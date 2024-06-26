import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    currentuser: {},
    userByManager: [],
    error: null,
  }),
  getters: {},
  actions: {
    async getUser(id) {
      try {
        const response = await axios.get(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.currentuser = response.data
        return true
      } catch (error) {
        return false
      }
    }
    ,
    async getUsers(filters = {}) {
      try {

        const response = await axios.get('/api/users?'+new URLSearchParams(filters), {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.users = response.data
        return true
      } catch (error) {
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
        return false
      }
    },
    async update(id, data) {
      try {
        const response = await axios.patch(`/api/users/${id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return response.data
      } catch (error) {
        return false
      }
    },
    async createuser(data) {
      try {
        const response = await axios.post('/api/users', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })

        return response.data
      } catch (error) {
        this.error = error.response.data.message
        return false
      }
    }
    ,
    async getManagers() {
      try {
        const response = await axios.get('/api/users?role=ROLE_MANAGER', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return response.data
      } catch (error) {
        return false
      }
    },
    async deleteUser(id) {
      try {
        const response = await axios.delete(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return response.data
      } catch (error) {
        return false
      }
    },
    async updateUser(id, data) {
      try {
        const response = await axios.patch(`/api/users/${id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return response.data
      } catch (error) {
        return false
      }
    }
  }
})
