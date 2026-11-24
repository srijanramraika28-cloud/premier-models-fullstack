// Premier Models - Admin Portal Controller
const Admin = {
  activeTab: 'bookings',

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Tab switching
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Add Model Form Submission
    const addModelForm = document.getElementById('admin-add-model-form');
    if (addModelForm) {
      addModelForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleCreateModel();
      });
    }

    // Add Blog Form Submission
    const addBlogForm = document.getElementById('admin-add-blog-form');
    if (addBlogForm) {
      addBlogForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleCreateBlog();
      });
    }
  },

  switchTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    document.querySelectorAll('.admin-tab-pane').forEach(pane => {
      pane.style.display = pane.id === `tab-${tabName}` ? 'block' : 'none';
    });

    if (tabName === 'bookings') this.loadBookings();
    if (tabName === 'models') this.loadModels();
    if (tabName === 'blogs') this.loadBlogs();
  },

  async openModal() {
    const user = API.getCurrentUser();
    if (!user || user.role !== 'admin') {
      showToast('Admin access required. Please login with admin credentials.', 'error');
      App.openAuthModal('login');
      return;
    }

    const modal = document.getElementById('admin-modal');
    if (modal) {
      modal.style.display = 'flex';
      this.switchTab(this.activeTab);
    }
  },

  closeModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) modal.style.display = 'none';
  },

  // 1. Bookings Management
  async loadBookings() {
    const container = document.getElementById('admin-bookings-table-body');
    if (!container) return;
    container.innerHTML = '<tr><td colspan="6" class="loading-cell">Loading inquiries...</td></tr>';

    try {
      const data = await API.getBookings();
      if (!data.success || !data.bookings.length) {
        container.innerHTML = '<tr><td colspan="6" class="empty-cell">No casting inquiries found.</td></tr>';
        return;
      }

      container.innerHTML = data.bookings.map(b => `
        <tr>
          <td><strong>${escapeHtml(b.clientName)}</strong><br><small>${escapeHtml(b.clientEmail)}</small></td>
          <td>${escapeHtml(b.company || 'Private Client')}</td>
          <td><span class="model-tag">${escapeHtml(b.modelName || 'General')}</span></td>
          <td>${escapeHtml(b.projectType)}<br><small>${escapeHtml(b.location)}</small></td>
          <td>
            <select class="status-select status-${b.status.toLowerCase()}" onchange="Admin.updateBookingStatus('${b._id}', this.value)">
              <option value="Pending" ${b.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Declined" ${b.status === 'Declined' ? 'selected' : ''}>Declined</option>
              <option value="Completed" ${b.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
          </td>
          <td>
            <button class="btn-action-delete" onclick="Admin.deleteBooking('${b._id}')" title="Delete Inquiry">
              <i class="ri-delete-bin-line"></i>
            </button>
          </td>
        </tr>
      `).join('');
    } catch (err) {
      container.innerHTML = '<tr><td colspan="6" class="error-cell">Failed to load bookings.</td></tr>';
    }
  },

  async updateBookingStatus(id, newStatus) {
    try {
      const res = await API.updateBookingStatus(id, newStatus);
      if (res.success) {
        showToast(`Status updated to ${newStatus}`, 'success');
        this.loadBookings();
      } else {
        showToast(res.message || 'Update failed', 'error');
      }
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  },

  async deleteBooking(id) {
    if (!confirm('Are you sure you want to delete this booking inquiry?')) return;
    try {
      const res = await API.deleteBooking(id);
      if (res.success) {
        showToast('Inquiry deleted', 'info');
        this.loadBookings();
      } else {
        showToast(res.message || 'Delete failed', 'error');
      }
    } catch (err) {
      showToast('Error deleting inquiry', 'error');
    }
  },

  // 2. Models Management
  async loadModels() {
    const list = document.getElementById('admin-models-list');
    if (!list) return;
    list.innerHTML = '<div class="loading-state">Loading model directory...</div>';

    try {
      const data = await API.getModels({ gender: 'all' });
      if (!data.success || !data.models.length) {
        list.innerHTML = '<div class="empty-state">No models found in database.</div>';
        return;
      }

      list.innerHTML = data.models.map(m => `
        <div class="admin-item-card">
          <img src="${escapeHtml(m.image)}" alt="${escapeHtml(m.name)}" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'">
          <div class="admin-item-info">
            <h4>${escapeHtml(m.name)} <span class="badge-${m.gender}">${m.gender}</span></h4>
            <p>${escapeHtml(m.category)} | ${escapeHtml(m.height)}</p>
          </div>
          <button class="btn-action-delete" onclick="Admin.deleteModel('${m._id}', '${escapeHtml(m.name)}')" title="Delete Model">
            <i class="ri-delete-bin-line"></i> Delete
          </button>
        </div>
      `).join('');
    } catch (err) {
      list.innerHTML = '<div class="error-state">Error loading models.</div>';
    }
  },

  async handleCreateModel() {
    const form = document.getElementById('admin-add-model-form');
    const formData = new FormData(form);
    const modelData = {
      name: formData.get('name'),
      gender: formData.get('gender'),
      category: formData.get('category'),
      image: formData.get('image'),
      height: formData.get('height'),
      bio: formData.get('bio'),
      featured: formData.get('featured') === 'on'
    };

    try {
      const res = await API.createModel(modelData);
      if (res.success) {
        showToast(`Model ${res.model.name} added successfully!`, 'success');
        form.reset();
        this.loadModels();
        App.loadModels(); // Refresh public gallery
      } else {
        showToast(res.message || 'Failed to add model', 'error');
      }
    } catch (err) {
      showToast('Network error adding model', 'error');
    }
  },

  async deleteModel(id, name) {
    if (!confirm(`Are you sure you want to remove model "${name}"?`)) return;
    try {
      const res = await API.deleteModel(id);
      if (res.success) {
        showToast(`Model ${name} deleted`, 'info');
        this.loadModels();
        App.loadModels();
      } else {
        showToast(res.message || 'Delete failed', 'error');
      }
    } catch (err) {
      showToast('Error deleting model', 'error');
    }
  },

  // 3. Blogs Management
  async loadBlogs() {
    const list = document.getElementById('admin-blogs-list');
    if (!list) return;
    list.innerHTML = '<div class="loading-state">Loading editorial articles...</div>';

    try {
      const data = await API.getBlogs();
      if (!data.success || !data.blogs.length) {
        list.innerHTML = '<div class="empty-state">No blog articles found.</div>';
        return;
      }

      list.innerHTML = data.blogs.map(b => `
        <div class="admin-item-card">
          <img src="${escapeHtml(b.image)}" alt="${escapeHtml(b.title)}" onerror="this.src='https://images.unsplash.com/photo-1583424003998-e0533a6b240b?w=300'">
          <div class="admin-item-info">
            <h4>${escapeHtml(b.title)}</h4>
            <p>${escapeHtml(b.category)} • ${escapeHtml(b.date)} • By ${escapeHtml(b.author)}</p>
          </div>
          <button class="btn-action-delete" onclick="Admin.deleteBlog('${b._id}')" title="Delete Article">
            <i class="ri-delete-bin-line"></i> Delete
          </button>
        </div>
      `).join('');
    } catch (err) {
      list.innerHTML = '<div class="error-state">Error loading blogs.</div>';
    }
  },

  async handleCreateBlog() {
    const form = document.getElementById('admin-add-blog-form');
    const formData = new FormData(form);
    const blogData = {
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      category: formData.get('category'),
      author: formData.get('author'),
      image: formData.get('image'),
      content: formData.get('content')
    };

    try {
      const res = await API.createBlog(blogData);
      if (res.success) {
        showToast('Editorial article published!', 'success');
        form.reset();
        this.loadBlogs();
        App.loadBlogs();
      } else {
        showToast(res.message || 'Failed to publish article', 'error');
      }
    } catch (err) {
      showToast('Network error publishing article', 'error');
    }
  },

  async deleteBlog(id) {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await API.deleteBlog(id);
      if (res.success) {
        showToast('Article deleted', 'info');
        this.loadBlogs();
        App.loadBlogs();
      } else {
        showToast(res.message || 'Delete failed', 'error');
      }
    } catch (err) {
      showToast('Error deleting article', 'error');
    }
  }
};
