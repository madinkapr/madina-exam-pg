import './style.css';

const API_URL = 'http://localhost:3000';

const app = document.querySelector('#app');

// --- Icons ---
const EYE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
const EYE_OFF_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`;

// --- State Management ---
function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function setSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function removeSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// --- API Helpers ---
async function apiCall(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    console.error('API Error:', error);
    return { ok: false, data: { error: 'Tarmoqda xatolik yuz berdi' } };
  }
}

// --- UI Helpers ---
function showNotification(msg, type = 'error') {
  const notif = document.getElementById('notification');
  if (notif) {
    notif.textContent = msg;
    notif.className = `notification ${type}`;
    setTimeout(() => {
      notif.style.display = 'none';
      notif.className = 'notification';
    }, 4000);
  }
}

function toggleLoading(btnId, isLoading) {
  const btn = document.getElementById(btnId);
  const spinner = document.getElementById(`${btnId}-spinner`);
  const text = document.getElementById(`${btnId}-text`);
  if (btn && spinner && text) {
    btn.disabled = isLoading;
    spinner.style.display = isLoading ? 'inline-block' : 'none';
    text.style.display = isLoading ? 'none' : 'inline-block';
  }
}

// --- Render Login ---
function renderLogin() {
  app.innerHTML = `
    <div class="glass-panel">
      <h1>Xush kelibsiz 👋</h1>
      <p class="subtitle">Tizimga kirish uchun ma'lumotlaringizni kiriting</p>
      
      <div id="notification" class="notification"></div>
      
      <form id="login-form">
        <div class="form-group">
          <label>Email manzil</label>
          <input type="email" id="email" placeholder="admin@gmail.com" required />
        </div>
        
        <div class="form-group">
          <label>Parol</label>
          <div class="password-wrapper">
            <input type="password" id="login-password" placeholder="••••••••" required />
            <span class="eye-icon" onclick="togglePassword('login-password', this)">${EYE_ICON}</span>
          </div>
        </div>
        
        <button type="submit" class="btn" id="login-btn">
          <span class="spinner" id="login-btn-spinner"></span>
          <span id="login-btn-text">Kirish</span>
        </button>
      </form>
      
      <button class="btn btn-secondary" id="go-to-signup">Ro'yxatdan o'tish</button>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('login-password').value;

    toggleLoading('login-btn', true);

    const { ok, data } = await apiCall('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    toggleLoading('login-btn', false);

    if (ok) {
      setSession(data.token, data.user);
      renderDashboard();
    } else {
      showNotification(data.error || 'Xatolik yuz berdi');
    }
  });

  document.getElementById('go-to-signup').addEventListener('click', renderSignup);
}

// --- Render Signup ---
function renderSignup() {
  app.innerHTML = `
    <div class="glass-panel">
      <h1>Ro'yxatdan o'tish 🚀</h1>
      <p class="subtitle">Yangi akkaunt yarating</p>
      
      <div id="notification" class="notification"></div>
      
      <form id="signup-form">
        <div class="form-group">
          <label>Email manzil</label>
          <input type="email" id="signup-email" placeholder="user@gmail.com" required />
        </div>
        
        <div class="form-group">
          <label>Parol (kamida 4 ta belgi)</label>
          <div class="password-wrapper">
            <input type="password" id="signup-password" placeholder="••••••••" required />
            <span class="eye-icon" onclick="togglePassword('signup-password', this)">${EYE_ICON}</span>
          </div>
        </div>

        <div class="form-group">
          <label>Parolni tasdiqlang</label>
          <div class="password-wrapper">
            <input type="password" id="signup-confirm-password" placeholder="••••••••" required />
            <span class="eye-icon" onclick="togglePassword('signup-confirm-password', this)">${EYE_ICON}</span>
          </div>
        </div>        
        <div class="checkbox-group">
          <input type="checkbox" id="signup-admin" />
          <label for="signup-admin" style="margin:0;">Admin sifatida ro'yxatdan o'tish</label>
        </div>
        
        <button type="submit" class="btn" id="signup-btn">
          <span class="spinner" id="signup-btn-spinner"></span>
          <span id="signup-btn-text">Ro'yxatdan o'tish</span>
        </button>
      </form>
      
      <button class="btn btn-secondary" id="go-to-login">Ortga qaytish</button>
    </div>
  `;

  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const is_admin = document.getElementById('signup-admin').checked;

    if (password !== confirmPassword) {
      return showNotification('Parollar mos kelmadi!', 'error');
    }

    toggleLoading('signup-btn', true);

    const { ok, data } = await apiCall('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, is_admin })
    });

    toggleLoading('signup-btn', false);

    if (ok) {
      showNotification('Muvaffaqiyatli! Endi tizimga kiring.', 'success');
      setTimeout(renderLogin, 1500);
    } else {
      showNotification(data.error || 'Xatolik yuz berdi');
    }
  });

  document.getElementById('go-to-login').addEventListener('click', renderLogin);
}

// --- Render Dashboard ---
async function renderDashboard() {
  const token = getToken();
  if (!token) return renderLogin();

  app.innerHTML = `
    <div class="glass-panel dashboard-panel">
      <div class="dashboard-header">
        <div class="user-info">
          <div class="avatar" id="user-avatar">?</div>
          <div>
            <h2 id="user-email">Yuklanmoqda...</h2>
            <span class="badge" id="user-role">...</span>
          </div>
        </div>
        <button class="btn btn-danger btn-small" id="logout-btn">Chiqish</button>
      </div>
      
      <div class="search-bar">
        <input type="number" id="search-id" placeholder="Foydalanuvchi ID si bo'yicha qidirish (ixtiyoriy)..." />
        <button class="btn btn-small" id="search-btn" style="width: 120px;">Qidirish</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="users-table-body">
            <tr><td colspan="3" class="empty-state">Yuklanmoqda...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('logout-btn').addEventListener('click', () => {
    removeSession();
    renderLogin();
  });

  const searchBtn = document.getElementById('search-btn');
  searchBtn.addEventListener('click', () => {
    const id = document.getElementById('search-id').value;
    fetchAndRenderUsers(id);
  });

  // Dastlabki yuklash
  await fetchAndRenderUsers();
}

async function fetchAndRenderUsers(searchId = '') {
  const tbody = document.getElementById('users-table-body');
  tbody.innerHTML = '<tr><td colspan="3" class="empty-state">Yuklanmoqda...</td></tr>';

  const token = getToken();
  let url = '/users?token=' + token;
  if (searchId) {
    url += '&user_id=' + searchId;
  }

  const { ok, status, data } = await apiCall(url);

  if (status === 401) {
    removeSession();
    return renderLogin();
  }

  // Update header info from localStorage if available
  const currentUser = getUser();
  if (currentUser) {
    document.getElementById('user-email').textContent = currentUser.email || 'Foydalanuvchi';
    document.getElementById('user-avatar').textContent = (currentUser.email || '?').charAt(0).toUpperCase();

    const roleBadge = document.getElementById('user-role');
    roleBadge.textContent = currentUser.is_admin ? 'Admin' : 'Foydalanuvchi';
    roleBadge.className = currentUser.is_admin ? 'badge admin' : 'badge';
  }

  if (status === 403) {
    tbody.innerHTML = `<tr><td colspan="3" class="empty-state" style="color:#ef4444">Faqat adminlar ro'yxatni ko'ra oladi 🚫</td></tr>`;
    return;
  }

  if (ok && data) {
    // Render table
    if (data.users && data.users.length > 0) {
      tbody.innerHTML = data.users.map(user => `
        <tr>
          <td>#${user.id}</td>
          <td>${user.email || 'Kiritilmagan'}</td>
          <td>
            <span class="badge ${user.is_admin ? 'admin' : ''}">
              ${user.is_admin ? 'Admin' : 'Oddiy'}
            </span>
          </td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="3" class="empty-state">Foydalanuvchilar topilmadi 📭</td></tr>';
    }
  } else {
    tbody.innerHTML = `<tr><td colspan="3" class="empty-state" style="color:#ef4444">${data.error || 'Xatolik yuz berdi'}</td></tr>`;
  }
}

// --- Parolni ko'rish/yashirish funksiyasi ---
window.togglePassword = function(inputId, iconElement) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    iconElement.innerHTML = EYE_OFF_ICON; 
  } else {
    input.type = 'password';
    iconElement.innerHTML = EYE_ICON; 
  }
};


// --- App Initialization ---
function init() {
  if (getToken()) {
    renderDashboard();
  } else {
    renderLogin();
  }
}

init();
