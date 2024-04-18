import { defineStore } from 'pinia'
import axios from 'axios'

export const useInterviewsStore = defineStore('interviews', {
  state: () => ({
    interviews: [],
    managerInterviews: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchInterviews(userId) {
      this.isLoading = true
      try {
        const response = await axios.get(`/api/interviews/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.interviews = response.data
        this.isLoading = false
        return true
      } catch (error) {
        this.error = error.message
        this.isLoading = false
        return false
      }
    },
    async fetchManagerInterviews(managerId) {
      this.isLoading = true
      try {
        const response = await axios.get(`/api/interviews?manager_id=${managerId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.managerInterviews = response.data
        this.isLoading = false
        return true
      } catch (error) {
        this.error = error.message
        this.isLoading = false
        return false
      }
    },
    async patchInterview(interview) {
      this.isLoading = true
      try {
        const response = await axios.patch(`/api/interviews/${interview.id}`, interview, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.isLoading = false
        return response.data
      } catch (error) {
        this.error = error.message
        this.isLoading = false
        return false
      }
    },
    async postInterview(data, managerId) {
      this.isLoading = true
      try {
        data.manager_id = managerId
        const response = await axios.post('/api/interviews', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.isLoading = false
        return response.data
      } catch (error) {
        this.error = error.message
        this.isLoading = false
        return false
      }
    },
    async deleteInterview(interviewId) {
      this.isLoading = true
      try {
        const response = await axios.delete(`/api/interviews/${interviewId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.isLoading = false
        return response.data
      } catch (error) {
        this.error = error.message
        this.isLoading = false
        return false
      }
    }
  }
})
