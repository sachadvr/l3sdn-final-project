import { defineStore } from 'pinia'
import axios from 'axios'

export const useInterviewsStore = defineStore('interviews', {
  state: () => ({
    interviews: []
  }),
  actions: {
    async fetchInterviews(userid) {
      try {
        const response = await axios.get(`/api/interviews/${userid}`)
        this.interviews = response.data
      } catch (error) {
        console.error('Failed to fetch interviews:', error)
      }
    }
  }
})
