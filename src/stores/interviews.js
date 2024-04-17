import { defineStore } from 'pinia'
import axios from 'axios'
import { getCurrentInstance } from 'vue'

export const useInterviewsStore = defineStore('interviews', {
  state: () => ({
    interviews: [],
    managerInterviews: [],
    isLoading: false,
    error: null
  }),
  actions: {
    notifyUser(message, type) {
      const instance = getCurrentInstance()
      if (instance && instance.appContext.config.globalProperties.$notify) {
        instance.appContext.config.globalProperties.$notify(message, type)
      }
    },
    async fetchInterviews(userid) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.get(`/api/interviews/${userid}`, {
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
    async getInterviewByManager(managerId) {
      this.isLoading = true
      this.error = null
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
    async fetchManagerInterviews(managerID) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.get(`/api/interviews?manager_id=${managerID}`, {
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
      this.error = null
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
    async postInterview(data, managerID) {
      this.isLoading = true
      this.error = null
      try {
        data.manager_id = managerID
        const response = await axios.post('/api/interviews', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        this.isLoading = false
        return response.data
      } catch (error) {
        this.notifyUser('negative', 'Impossible d\'ajouter un entretien. Un des arguments est manquant.')
        this.error = error.message
        this.isLoading = false
        return false
      }
    },
    async deleteInterview(interviewID) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.delete(`/api/interviews/${interviewID}`, {
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
