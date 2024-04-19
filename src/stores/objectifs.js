import { defineStore } from 'pinia'
import axios from 'axios'
import { getCurrentInstance } from 'vue'

export const useObjectifsStore = defineStore('objectifs', {
  state: () => ({
    objectifs: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    notifyUser(message, type) {
      const instance = getCurrentInstance()
      if (instance && instance.appContext.config.globalProperties.$notify) {
        instance.appContext.config.globalProperties.$notify(message, type)
      }
    },
    async fetchObjectifs(userid, filters = {}) {
      try {

        const response = await axios.get(`/api/objectives/${userid}?${new URLSearchParams(filters)}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.objectifs = response.data
        return true
      } catch (error) {
        return false
      }
    },
    async fetchObjectif(objectifId) {
      try {
        const response = await axios.get(`/api/objectives/${objectifId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return response.data
      } catch (error) {
        return null
      }
    },
    async fetchObjectifsByManager(managerId, year) {
      try {
        const response = await axios.get(`/api/objectives/manager/${managerId}/${year}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return response.data
      } catch (error) {
        return null
      }
    },
    async patchObjectif(objectif) {
      try {
        await axios.patch(`/api/objectives/${objectif.id}`, objectif, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return true
      } catch (error) {
        return false
      }
    },
    async postObjectif(objectif, managerID) {
      try {
        objectif.manager_id = managerID
        await axios.post('/api/objectives', objectif, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return true
      } catch (error) {
        this.error = error.response.data.message
        return false
      }
    },
    async deleteObjectif(objectifId) {
      try {
        await axios.delete(`/api/objectives/${objectifId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        return true
      } catch (error) {
        return false
      }
    }
  }
})
