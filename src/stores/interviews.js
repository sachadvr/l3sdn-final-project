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
          headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
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
          headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
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
    },
    async fetchManagerInterviews(managerID) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(`/api/interviews?manager_id=${managerID}`, {
          headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
        });
        this.managerInterviews = response.data;
        this.isLoading = false;
        return true;
      } catch (error) {
        console.error('Failed to fetch manager interviews:', error);
        this.error = error.message;
        this.isLoading = false;
        return false;
      }
    },
    async patchInterview(interview) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.patch(`/api/interviews/${interview.id}`, interview, {
          headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
        });
        this.isLoading = false;
        return response.data;
      } catch (error) {
        console.error('Failed to patch interview:', error);
        this.error = error.message;
        this.isLoading = false;
        return false;
      }
    },
    async postInterview(data, managerID) {
      this.isLoading = true;
      this.error = null;
      try {
        data.manager_id = managerID;
        const response = await axios.post('/api/interviews', data, {
          headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
        });
        this.isLoading = false;
        return response.data;
      } catch (error) {
        console.error('Failed to post interview:', error);
        this.error = error.message;
        this.isLoading = false;
        return false;
      }
    },
    async deleteInterview(interviewID) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.delete(`/api/interviews/${interviewID}`, {
          headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
        });
        this.isLoading = false;
        return response.data;
      } catch (error) {
        console.error('Failed to delete interview:', error);
        this.error = error.message;
        this.isLoading = false;
        return false;
      }
    }
  }
});
