import { defineStore } from 'pinia';
import axios from 'axios';

export const useInterviewsStore = defineStore('interviews', {
  state: () => ({
    interviews: [],
    managerInterviews: [],
    isLoading: false,
    error: null
  }),
  actions: {
    async fetchInterviews(userid) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(`/api/interviews/${userid}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.interviews = response.data;
        this.isLoading = false;
        return true;
      } catch (error) {
        console.error('Failed to fetch interviews:', error);
        this.error = error.message;
        this.isLoading = false;
        return false;
      }
    },
    async getInterviewByManager(managerId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(`/api/interviews?manager_id=${managerId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.managerInterviews = response.data;
        this.isLoading = false;
        return true;
      } catch (error) {
        console.error('Failed to fetch interviews by manager:', error);
        this.error = error.message;
        this.isLoading = false;
        return false;
      }
    }
  }
});
