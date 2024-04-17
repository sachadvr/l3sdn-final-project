import { defineStore } from 'pinia'
import axios from 'axios'

export const useObjectifsStore = defineStore('objectifs', {
  state: () => ({
    objectifs: []
  }),
  actions: {
    async fetchObjectifs(userid, filters = {}) {
      try {

        const response = await axios.get(`/api/objectives/${userid}?${new URLSearchParams(filters)}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.objectifs = response.data
        return true
      } catch (error) {
        console.error('Failed to fetch objectifs:', error)
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
        console.error('Failed to fetch objectif:', error)
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
        console.error('Failed to patch objectif:', error)
        return false
      }
    }
  }
})
