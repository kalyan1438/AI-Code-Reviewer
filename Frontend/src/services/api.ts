const API_BASE_URL = 'https://ai-code-reviewer-backend-brd5.onrender.com/api';
const REQUEST_TIMEOUT = 30000; // 30s for long AI responses
const MAX_RETRIES = 3;

class ApiService {
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } catch (err) {
      throw new Error(err.name === 'AbortError' ? 'Request timed out' : err.message);
    } finally {
      clearTimeout(timeout);
    }
  }

  async makeRequest(endpoint, options = {}, retries = 0) {
    try {
      const res = await this.fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { success: false, message: 'Invalid JSON response' };
      }

      if (!res.ok) {
        // Handle auth
        if (res.status === 401) {
          this.logout();
          return { success: false, message: 'Unauthorized. Please login again.' };
        }
        throw new Error(data.message || `Request failed with status ${res.status}`);
      }

      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : typeof error === 'string' ? error : 'Network error';

      // Retry with exponential backoff
      if (retries < MAX_RETRIES) {
        console.warn(`Request failed, retrying ${retries + 1}/${MAX_RETRIES}... (${message})`);
        await new Promise(r => setTimeout(r, 2000 * (retries + 1)));
        return this.makeRequest(endpoint, options, retries + 1);
      }

      // Return structured error JSON
      return {
        success: false,
        message,
        analysis: "Code review failed. Please try again later.",
        runtime_issues: [],
        bugs: [],
        security_issues: [],
        performance_suggestions: [],
        readability_suggestions: [],
        fixed_code: "",
        rating: 5,
      };
    }
  }

  // ===== AUTH =====
  async login(email, password) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response;
  }

  async register(fullName, email, password) {
    const response = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response;
  }

  async getProfile() {
    return this.makeRequest('/auth/profile');
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // ===== CODE METHODS =====
  async submitCode(data) {
    return this.makeRequest('/code/submit', { method: 'POST', body: JSON.stringify(data) });
  }

  async getAnalysis(submissionId) {
    return this.makeRequest(`/code/analysis/${submissionId}`);
  }

  async getSubmissionHistory(params = {}) {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {})
    ).toString();
    return this.makeRequest(`/code/history?${queryString}`);
  }

  async getSubmission(submissionId) {
    return this.makeRequest(`/code/submission/${submissionId}`);
  }

  async deleteSubmission(submissionId) {
    return this.makeRequest(`/code/submission/${submissionId}`, { method: 'DELETE' });
  }

  async getDashboard() {
    return this.makeRequest('/user/dashboard');
  }
}

export default new ApiService();
