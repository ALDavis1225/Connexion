// API utility functions for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User endpoints
  async getUsers() {
    return this.request('/users');
  }

  async getUser(userId) {
    return this.request(`/users/${userId}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: userData,
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: userData,
    });
  }

  // Assessment endpoints
  async getAssessments() {
    return this.request('/assessments');
  }

  async getAssessment(assessmentId) {
    return this.request(`/assessments/${assessmentId}`);
  }

  async getUserAssessments(userId) {
    return this.request(`/users/${userId}/assessments`);
  }

  async submitAssessment(userId, assessmentId, answers) {
    return this.request(`/users/${userId}/assessments/${assessmentId}`, {
      method: 'POST',
      body: { answers },
    });
  }

  async getAssessmentResult(userId, assessmentId) {
    return this.request(`/users/${userId}/assessments/${assessmentId}/results`);
  }

  // Communication endpoints
  async getCommunicationPreferences(userId) {
    return this.request(`/users/${userId}/communication-preferences`);
  }

  async setCommunicationPreferences(userId, preferences) {
    return this.request(`/users/${userId}/communication-preferences`, {
      method: 'POST',
      body: preferences,
    });
  }

  async getCommunicationSuggestions(senderId, recipientIds, context = 'general') {
    return this.request('/communication-suggestions', {
      method: 'POST',
      body: {
        sender_id: senderId,
        recipient_ids: recipientIds,
        context,
      },
    });
  }

  // Project endpoints
  async getProjects(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/projects?${params}`);
  }

  async getProject(projectId) {
    return this.request(`/projects/${projectId}`);
  }

  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: projectData,
    });
  }

  async updateProject(projectId, projectData) {
    return this.request(`/projects/${projectId}`, {
      method: 'PUT',
      body: projectData,
    });
  }

  // Task endpoints
  async getTasks(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/tasks?${params}`);
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: taskData,
    });
  }

  async updateTask(taskId, taskData) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: taskData,
    });
  }

  // Achievement endpoints
  async getUserAchievements(userId) {
    return this.request(`/users/${userId}/achievements`);
  }

  async getLeaderboard(limit = 10) {
    return this.request(`/achievements/leaderboard?limit=${limit}`);
  }

  // Feedback endpoints
  async getFeedbackRequests(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/feedback-requests?${params}`);
  }

  async createFeedbackRequest(requestData) {
    return this.request('/feedback-requests', {
      method: 'POST',
      body: requestData,
    });
  }

  async submitFeedback(feedbackData) {
    return this.request('/feedback', {
      method: 'POST',
      body: feedbackData,
    });
  }

  async getUserFeedbackReceived(userId) {
    return this.request(`/users/${userId}/feedback-received`);
  }

  async getUserFeedbackReport(userId) {
    return this.request(`/users/${userId}/feedback-report`);
  }
}

export const apiClient = new ApiClient();
export default apiClient;

