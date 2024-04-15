import { defineStore } from 'pinia'
import axios from 'axios'

export const useInterviewsStore = defineStore('interviews', {
  state: () => ({
    interviews: []
  }),
  actions: {
    async fetchInterviews(userid) {
      try {
        const response = await axios.get(`/api/interviews/${userid}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.interviews = response.data
        return true
      } catch (error) {
        console.error('Failed to fetch interviews:', error)
        return false
      }
    }
  }
})
