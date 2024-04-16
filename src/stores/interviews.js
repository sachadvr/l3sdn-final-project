import { defineStore } from 'pinia'
import axios from 'axios'

export const useInterviewsStore = defineStore('interviews', {
  state: () => ({
    interviews: [],
    manager_interviews: []
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
    },
    async getInterviewByManager(managerId) {
      try {
        const response = await axios.get(`/api/interviews?manager_id=${managerId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.manager_interviews = response.data
        return true
      } catch (error) {
        console.error('Failed to fetch interviews:', error)
        return false
      }
    }
  }
})
