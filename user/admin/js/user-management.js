let allUsers = [];

// Fetch users from your existing database
async function fetchUsers(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`http://localhost:5000/api/users?${params}`);
    
    if (!response.ok) throw new Error('Failed to fetch users');
    
    const users = await response.json();
    allUsers = users;
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

async function loadUserModules() {
  document.querySelector("#folder-body").innerHTML = `
    <div class="folder-content-card">
      <div class="user-management-container">
        <div class="filter-search">
          <h2>Filter & Search</h2>
          <div class="filters-row">
            <div class="search-box">
              <label>Search User</label>
              <div class="input-icon">
                <input type="text" id="search-user" placeholder="Type user name..." />
                <button class="search-btn">
                  <img src="../../../assets/images/search-icon.png" alt="Search" />
                </button>
              </div>
            </div>

            <div class="select-group">
              <label>Role</label>
              <select id="filter-role">
                <option value="">All Roles</option>
                <option>Admin</option>
                <option>OSAS Officer</option>
                <option>Student Org</option>
              </select>
            </div>

            <div class="select-group">
              <label>Status</label>
              <select id="filter-status">
                <option value="">All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </select>
            </div>

            <button class="generate-btn">
              <img src="../../../assets/images/submissions-icon.png" alt="Generate Report" />
              Generate Reports
            </button>
          </div>
        </div>

        <div class="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Date Registered</th>
                <th>Last Login</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="users-table-body">
              <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                  <div style="display: inline-block;">
                    <div style="border: 4px solid #f3f3f3; border-top: 4px solid #073066; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>
                    <p style="margin-top: 1rem; color: #666;">Loading users from database...</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Load users from database
  const users = await fetchUsers();
  renderTable(users);
  
  // Setup filters
  setupFilters();
}

function renderTable(data) {
  const tbody = document.getElementById("users-table-body");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
          No users found.
        </td>
      </tr>
    `;
    return;
  }

  data.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.status}</td>
      <td>${user.dateRegistered}</td>
      <td>${user.lastLogin}</td>
      <td><button class="review-btn">Review</button></td>
    `;
    tbody.appendChild(row);
  });
}

function setupFilters() {
  const searchInput = document.getElementById("search-user");
  const roleFilter = document.getElementById("filter-role");
  const statusFilter = document.getElementById("filter-status");

  const filterTable = async () => {
    const search = searchInput.value.toLowerCase();
    const role = roleFilter.value;
    const status = statusFilter.value;

    const filteredUsers = await fetchUsers({ search, role, status });
    renderTable(filteredUsers);
  };

  [searchInput, roleFilter, statusFilter].forEach(el => {
    el.addEventListener("input", filterTable);
    el.addEventListener("change", filterTable);
  });
}

async function initUserManagement() {
  await loadUserModules();
}

initUserManagement();