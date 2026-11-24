// Premier Models - Main Application Controller

// Utility: HTML Escaping
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

const App = {
  filter: {
    letter: 'ALL',
    gender: 'all',
    search: ''
  },
  selectedModel: null,

  async init() {
    this.bindEvents();
    this.updateUserUI();
    await this.loadModels();
    await this.loadBlogs();
    Admin.init();
  },

  bindEvents() {
    // Alphabet Filter Clicks
    const alphaContainer = document.getElementById('alpha');
    if (alphaContainer) {
      alphaContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'H4' || target.tagName === 'H5') {
          const letter = target.textContent.trim().toUpperCase();
          this.setAlphabetFilter(letter);
        }
      });
    }

    // Nav Gender Filter
    const womenMenNav = document.getElementById('nav-women-men');
    if (womenMenNav) {
      womenMenNav.addEventListener('click', () => {
        if (this.filter.gender === 'all') {
          this.setGenderFilter('female', 'Women');
        } else if (this.filter.gender === 'female') {
          this.setGenderFilter('male', 'Men');
        } else {
          this.setGenderFilter('all', 'Women / Men');
        }
      });
    }

    // Nav Models Click -> Scroll to dynamic gallery
    const navModels = document.getElementById('nav-models');
    if (navModels) {
      navModels.addEventListener('click', () => {
        document.getElementById('dynamic-roster-section').scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Search Toggle & Input
    const searchIcon = document.getElementById('nav-search-icon');
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('global-search-input');

    if (searchIcon && searchModal) {
      searchIcon.addEventListener('click', () => {
        searchModal.style.display = 'flex';
        searchInput.focus();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filter.search = e.target.value.trim();
        this.loadModels();
      });
    }

    // Close Modals on Overlay Click or Close Button
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    });

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) modal.style.display = 'none';
      });
    });

    // Auth Form Handlers
    const authForm = document.getElementById('auth-form');
    if (authForm) {
      authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleAuthSubmit();
      });
    }

    // Booking / Casting Inquiry Form Handler
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleBookingSubmit();
      });
    }
  },

  // Alphabet Filter
  setAlphabetFilter(letter) {
    this.filter.letter = letter;

    // Highlight selected letter
    document.querySelectorAll('#alpha h4, #alpha h5').forEach(el => {
      const elText = el.textContent.trim().toUpperCase();
      if (elText === letter) {
        el.classList.add('alpha-active');
      } else {
        el.classList.remove('alpha-active');
      }
    });

    this.loadModels();

    // Scroll to roster section
    const rosterSection = document.getElementById('dynamic-roster-section');
    if (rosterSection) {
      rosterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  setGenderFilter(gender, label) {
    this.filter.gender = gender;
    const navText = document.getElementById('nav-women-men');
    if (navText) navText.textContent = label;
    showToast(`Filtering by: ${label}`, 'info');
    this.loadModels();
  },

  // Load Models from REST API
  async loadModels() {
    const container = document.getElementById('model-cards-container');
    const countDisplay = document.getElementById('model-count-display');
    if (!container) return;

    container.innerHTML = `
      <div class="loader-box">
        <div class="spinner"></div>
        <p>Loading Premier Model Roster from Database...</p>
      </div>
    `;

    try {
      const data = await API.getModels(this.filter);
      if (!data.success || !data.models.length) {
        container.innerHTML = `
          <div class="empty-roster-msg">
            <h3>No models found for letter "${this.filter.letter}".</h3>
            <p>Try clicking "ALL" or reset filters.</p>
            <button class="btn-editorial" onclick="App.setAlphabetFilter('ALL')">View All Models</button>
          </div>
        `;
        if (countDisplay) countDisplay.textContent = '0 Models Found';
        return;
      }

      if (countDisplay) {
        countDisplay.textContent = `Showing ${data.models.length} Models • Filter: ${this.filter.letter} • ${this.filter.gender.toUpperCase()}`;
      }

      container.innerHTML = data.models.map(m => `
        <div class="model-editorial-card" onclick="App.openModelDetail('${m._id}')">
          <div class="card-img-wrapper">
            <img src="${escapeHtml(m.image)}" alt="${escapeHtml(m.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600'">
            <div class="card-badge-letter">${escapeHtml(m.letter)}</div>
            <div class="card-hover-overlay">
              <span>EXPLORE PORTFOLIO</span>
              <i class="ri-arrow-right-up-line"></i>
            </div>
          </div>
          <div class="card-meta">
            <div class="card-name-row">
              <h3>${escapeHtml(m.name)}</h3>
              <span class="card-gender-tag">${m.gender === 'female' ? 'W' : 'M'}</span>
            </div>
            <p class="card-category">${escapeHtml(m.category)}</p>
            <p class="card-height">${escapeHtml(m.height)}</p>
          </div>
        </div>
      `).join('');
    } catch (err) {
      container.innerHTML = `
        <div class="empty-roster-msg">
          <h3>Failed to connect to backend REST API</h3>
          <p>${err.message}</p>
        </div>
      `;
    }
  },

  // Open Model Detail & Casting Modal
  async openModelDetail(modelId) {
    const modal = document.getElementById('model-detail-modal');
    if (!modal) return;

    try {
      const data = await API.getModelById(modelId);
      if (!data.success || !data.model) return;

      const m = data.model;
      this.selectedModel = m;

      document.getElementById('modal-model-img').src = m.image;
      document.getElementById('modal-model-name').textContent = m.name;
      document.getElementById('modal-model-category').textContent = `${m.category} • ${m.agency}`;
      document.getElementById('modal-model-height').textContent = m.height;
      document.getElementById('modal-model-bust').textContent = m.bust;
      document.getElementById('modal-model-waist').textContent = m.waist;
      document.getElementById('modal-model-hips').textContent = m.hips;
      document.getElementById('modal-model-eyes').textContent = m.eyes;
      document.getElementById('modal-model-hair').textContent = m.hair;
      document.getElementById('modal-model-bio').textContent = m.bio;

      modal.style.display = 'flex';
    } catch (err) {
      showToast('Error opening model portfolio', 'error');
    }
  },

  // Open Booking Modal for Selected Model
  openBookingForModel() {
    document.getElementById('model-detail-modal').style.display = 'none';
    const bookingModal = document.getElementById('booking-modal');
    const modelInput = document.getElementById('booking-model-name');

    if (this.selectedModel && modelInput) {
      modelInput.value = this.selectedModel.name;
      document.getElementById('booking-model-id').value = this.selectedModel._id;
    }

    // Auto-fill logged in client info if available
    const user = API.getCurrentUser();
    if (user) {
      const nameInput = document.getElementById('booking-client-name');
      const emailInput = document.getElementById('booking-client-email');
      const companyInput = document.getElementById('booking-client-company');
      if (nameInput && !nameInput.value) nameInput.value = user.name;
      if (emailInput && !emailInput.value) emailInput.value = user.email;
      if (companyInput && !companyInput.value) companyInput.value = user.company || '';
    }

    bookingModal.style.display = 'flex';
  },

  // Submit Booking / Casting Request
  async handleBookingSubmit() {
    const form = document.getElementById('booking-form');
    const formData = new FormData(form);

    const bookingData = {
      clientName: formData.get('clientName'),
      clientEmail: formData.get('clientEmail'),
      clientPhone: formData.get('clientPhone'),
      company: formData.get('company'),
      modelId: formData.get('modelId') || null,
      modelName: formData.get('modelName') || 'General Agency Inquiry',
      projectType: formData.get('projectType'),
      projectDate: formData.get('projectDate'),
      location: formData.get('location'),
      budget: formData.get('budget'),
      notes: formData.get('notes')
    };

    try {
      const res = await API.createBooking(bookingData);
      if (res.success) {
        showToast('Casting Inquiry submitted successfully!', 'success');
        form.reset();
        document.getElementById('booking-modal').style.display = 'none';
      } else {
        showToast(res.message || 'Submission failed', 'error');
      }
    } catch (err) {
      showToast('Network error submitting inquiry', 'error');
    }
  },

  // Dynamic Blogs
  async loadBlogs() {
    try {
      const data = await API.getBlogs();
      if (!data.success || !data.blogs.length) return;

      const blogContainer = document.getElementById('dynamic-blog-articles');
      if (!blogContainer) return;

      blogContainer.innerHTML = data.blogs.slice(0, 4).map(b => `
        <div class="dynamic-blog-card">
          <div class="dynamic-blog-header">
            <span class="blog-pill">${escapeHtml(b.category)}</span>
            <span class="blog-date">${escapeHtml(b.date)}</span>
          </div>
          <h3>${escapeHtml(b.title)}</h3>
          <p class="blog-subtitle">${escapeHtml(b.subtitle || '')}</p>
          <div class="blog-img-box">
            <img src="${escapeHtml(b.image)}" alt="${escapeHtml(b.title)}" onerror="this.src='https://images.unsplash.com/photo-1583424003998-e0533a6b240b?w=600'">
          </div>
          <p class="blog-body">${escapeHtml(b.content)}</p>
          <div class="blog-author-row">
            <span>By ${escapeHtml(b.author)}</span>
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.warn('Could not load dynamic blogs', err);
    }
  },

  // User UI State & Authentication
  updateUserUI() {
    const user = API.getCurrentUser();
    const navAuth = document.getElementById('nav-auth-container');
    if (!navAuth) return;

    if (user) {
      navAuth.innerHTML = `
        <div class="nav-user-badge">
          <span class="user-name"><i class="ri-user-smile-line"></i> ${escapeHtml(user.name.split(' ')[0])}</span>
          ${user.role === 'admin' ? '<button class="btn-admin-pill" onclick="Admin.openModal()">ADMIN PORTAL</button>' : ''}
          <button class="btn-logout" onclick="App.handleLogout()" title="Logout"><i class="ri-logout-box-r-line"></i></button>
        </div>
      `;
    } else {
      navAuth.innerHTML = `
        <button class="btn-nav-login" onclick="App.openAuthModal('login')">
          <i class="ri-user-line"></i> SIGN IN
        </button>
      `;
    }
  },

  openAuthModal(mode = 'login') {
    this.authMode = mode;
    const modal = document.getElementById('auth-modal');
    const title = document.getElementById('auth-modal-title');
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleText = document.getElementById('auth-toggle-text');
    const registerFields = document.querySelectorAll('.register-only-field');

    if (mode === 'login') {
      title.textContent = 'ACCOUNT SIGN IN';
      submitBtn.textContent = 'SIGN IN';
      toggleText.innerHTML = `Don't have an account? <a href="#" onclick="App.openAuthModal('register')">Register here</a>`;
      registerFields.forEach(f => f.style.display = 'none');
    } else {
      title.textContent = 'REGISTER NEW ACCOUNT';
      submitBtn.textContent = 'CREATE ACCOUNT';
      toggleText.innerHTML = `Already have an account? <a href="#" onclick="App.openAuthModal('login')">Sign In</a>`;
      registerFields.forEach(f => f.style.display = 'block');
    }

    modal.style.display = 'flex';
  },

  fillDemo(email, pass) {
    document.getElementById('auth-email').value = email;
    document.getElementById('auth-password').value = pass;
    showToast(`Loaded ${email.includes('admin') ? 'Admin' : 'Client'} credentials. Click Sign In!`, 'info');
  },

  async handleAuthSubmit() {
    const form = document.getElementById('auth-form');
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    try {
      let res;
      if (this.authMode === 'login') {
        res = await API.login({ email, password });
      } else {
        const name = document.getElementById('auth-name').value;
        const company = document.getElementById('auth-company').value;
        res = await API.register({ name, email, password, company });
      }

      if (res.success) {
        showToast(`Welcome ${res.user.name}!`, 'success');
        document.getElementById('auth-modal').style.display = 'none';
        form.reset();
        this.updateUserUI();
      } else {
        showToast(res.message || 'Authentication failed', 'error');
      }
    } catch (err) {
      showToast('Authentication network error', 'error');
    }
  },

  handleLogout() {
    API.logout();
    this.updateUserUI();
    showToast('Logged out successfully.', 'info');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
