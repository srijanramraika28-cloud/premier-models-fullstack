// Premier Models - REST API Client Helper
const API_BASE = '/api';

const API = {
  // Authentication State
  getToken() {
    return localStorage.getItem('premier_token');
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('premier_token', token);
    } else {
      localStorage.removeItem('premier_token');
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('premier_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem('premier_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('premier_user');
    }
  },

  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  },

  // Auth Endpoints
  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (data.success && data.token) {
      this.setToken(data.token);
      this.setCurrentUser(data.user);
    }
    return data;
  },

  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (data.success && data.token) {
      this.setToken(data.token);
      this.setCurrentUser(data.user);
    }
    return data;
  },

  async getMe() {
    if (!this.getToken()) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        this.setCurrentUser(data.user);
        return data.user;
      } else {
        this.logout();
        return null;
      }
    } catch (err) {
      return null;
    }
  },

  logout() {
    this.setToken(null);
    this.setCurrentUser(null);
  },

  // Models Endpoints
  async getModels(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE}/models${query ? `?${query}` : ''}`;
    const res = await fetch(url);
    return await res.json();
  },

  async getModelById(id) {
    const res = await fetch(`${API_BASE}/models/${id}`);
    return await res.json();
  },

  async createModel(modelData) {
    const res = await fetch(`${API_BASE}/models`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(modelData)
    });
    return await res.json();
  },

  async updateModel(id, modelData) {
    const res = await fetch(`${API_BASE}/models/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(modelData)
    });
    return await res.json();
  },

  async deleteModel(id) {
    const res = await fetch(`${API_BASE}/models/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return await res.json();
  },

  // Blogs Endpoints
  async getBlogs() {
    const res = await fetch(`${API_BASE}/blogs`);
    return await res.json();
  },

  async createBlog(blogData) {
    const res = await fetch(`${API_BASE}/blogs`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(blogData)
    });
    return await res.json();
  },

  async deleteBlog(id) {
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return await res.json();
  },

  // Bookings Endpoints
  async createBooking(bookingData) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    return await res.json();
  },

  async getBookings() {
    const res = await fetch(`${API_BASE}/bookings`, {
      headers: this.getAuthHeaders()
    });
    return await res.json();
  },

  async updateBookingStatus(id, status) {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return await res.json();
  },

  async deleteBooking(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return await res.json();
  }
};
