const users = [
  { name: "Kristelle Tenorio", email: "2240841@slu.edu.ph", role: "Admin", status: "Active", dateRegistered: "01-10-2025", lastLogin: "10-10-2025" },
  { name: "Anjelo Esperanzate", email: "admin@slu.edu.ph", role: "OSAS Officer", status: "Active", dateRegistered: "02-15-2025", lastLogin: "10-11-2025" },
  { name: "Green Core Society", email: "gcssamcis@slu.edu.ph", role: "Student Org", status: "Active", dateRegistered: "03-05-2025", lastLogin: "10-12-2025" },
  { name: "Integrated Confederacy", email: "iconsamcis@slu.edu.ph", role: "Student Org", status: "Active", dateRegistered: "04-10-2025", lastLogin: "10-13-2025" },
  { name: "Junior Financial Executives of the Philippines", email: "jrfinexsamcis@slu.edu.ph", role: "Student Org", status: "Active", dateRegistered: "05-12-2025", lastLogin: "10-14-2025" },
  { name: "Junior Philippine Institute of Accountants", email: "jpiasamcis@slu.edu.ph", role: "Student Org", status: "Active", dateRegistered: "06-18-2025", lastLogin: "10-15-2025" },
  { name: "Louisians Imbibed with Genuine Hospitality Transformation", email: "lightsamcis@slu.edu.ph", role: "Student Org", status: "Active", dateRegistered: "07-20-2025", lastLogin: "10-16-2025" },
  { name: "Marketing Mixers", email: "mmsamcis@slu.edu.ph", role: "Student Org", status: "Active", dateRegistered: "08-25-2025", lastLogin: "10-17-2025" },
  { name: "Rated Production Guild", email: "rpgsamcis@slu.edu.ph", role: "Student Org", status: "Active", dateRegistered: "09-05-2025", lastLogin: "10-18-2025" },
  { name: "SAMCIS Assembly", email: "samcisssc@slu.edu.ph", role: "Student Org", status: "Active", dateRegistered: "10-10-2025", lastLogin: "10-19-2025" },
  { name: "SCHEMA (Publication)", email: "schemasamcis@slu.edu.ph", role: "Student Org", status: "Active", dateRegistered: "10-11-2025", lastLogin: "10-20-2025" },
  { name: "Society of Integrated Commercians for Academic Progress", email: "sicapsamcis@slu.edu.ph", role: "Student Org", status: "Active", dateRegistered: "10-12-2025", lastLogin: "10-21-2025" },
  { name: "Young Entrepreneurs Society", email: "yessamcis@slu.edu.ph", role: "Student Org", status: "Active", dateRegistered: "10-13-2025", lastLogin: "10-22-2025" }
];

function loadUserModules() {
  document.querySelector("#folder-body").innerHTML = `
    <div class="folder-content-card">
      <div class="user-management-container">

        <!-- Filter & Search -->
        <div class="filter-search">
          <h2>Filter & Search</h2>
          <div class="filters-row">
            <div class="search-box">
              <label>Search User</label>
              <div class="input-icon">
                <input type="text" id="search-user" placeholder="Type user name..." />
                <button class="search-btn">
                  <img src="../../assets/images/search-icon.png" alt="Search" />
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
              <img src="../../assets/images/submissions-icon.png" alt="Generate Report" />
              Generate Reports
            </button>
          </div>
        </div>

        <!-- Users Table -->
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
            <tbody id="users-table-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  renderTable(users);

  // Filters
  const searchInput = document.getElementById("search-user");
  const roleFilter = document.getElementById("filter-role");
  const statusFilter = document.getElementById("filter-status");

  [searchInput, roleFilter, statusFilter].forEach(el => {
    el.addEventListener("input", filterTable);
    el.addEventListener("change", filterTable);
  });
}

// Render Table
function renderTable(data) {
  const tbody = document.getElementById("users-table-body");
  tbody.innerHTML = "";

  data.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.status}</td>
      <td>${user.dateRegistered}</td>
      <td>${user.lastLogin}</td>
      <td><button class="review-btn"><img src="../../assets/images/submissions-icon.png" alt="" class="btn-icon">Review</button></td>
    `;
    tbody.appendChild(row);
  });
}

// Filter Function
function filterTable() {
  const search = document.getElementById("search-user").value.toLowerCase();
  const role = document.getElementById("filter-role").value;
  const status = document.getElementById("filter-status").value;

  const filtered = users.filter(user => {
    const matchSearch =
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search) ||
      user.status.toLowerCase().includes(search) ||
      user.dateRegistered.toLowerCase().includes(search) ||
      user.lastLogin.toLowerCase().includes(search);

    const matchRole = role === "" || user.role === role;
    const matchStatus = status === "" || user.status === status;

    return matchSearch && matchRole && matchStatus;
  });

  renderTable(filtered);
}

function initUserManagement() {
  loadUserModules();
}

initUserManagement();
