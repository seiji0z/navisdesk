const activities = [
  { 
    _id: "6716001a9b8c4001abcd1004",
    user_id: "6716001a9b8c1001abcd0002",
    userName: "Anjelo Esperanzate",
    role: "OSAS Officer",
    action: "Reviewed Green Core Clean-Up Drive",
    timestamp: "2025-10-01T00:00:00Z"
  },
  { 
    _id: "6716001a9b8c4001abcd1005",
    user_id: "6716001a9b8c2001abcd0001",
    userName: "Integrated Confederacy",
    role: "Student Org",
    action: "Submitted ICON Leadership Training 2025",
    timestamp: "2025-09-10T00:00:00Z"
  },
  { 
    _id: "6716001a9b8c4001abcd1006",
    user_id: "6716001a9b8c2001abcd0001",
    userName: "Integrated Confederacy",
    role: "Student Org",
    action: "Submitted ICON Environmental Summit",
    timestamp: "2025-09-20T00:00:00Z"
  },
  { 
    _id: "6716001a9b8c4001abcd1007",
    user_id: "6716001a9b8c2001abcd0001",
    userName: "Integrated Confederacy",
    role: "Student Org",
    action: "Uploaded supporting documents for Leadership Training",
    timestamp: "2025-09-15T00:00:00Z"
  },
  { 
    _id: "6716001a9b8c4001abcd1008",
    user_id: "6716001a9b8c2001abcd0002",
    userName: "Green Core Society",
    role: "Student Org",
    action: "Submitted Green Core Clean-Up Drive",
    timestamp: "2025-09-28T00:00:00Z"
  },
  { 
    _id: "6716001a9b8c4001abcd1009",
    user_id: "6716001a9b8c2001abcd0003",
    userName: "Junior Financial Executives of the Philippines",
    role: "Student Org",
    action: "Submitted JFINEX Financial Literacy Seminar",
    timestamp: "2025-09-25T00:00:00Z"
  }
];

function loadActivityModules() {
  document.querySelector("#folder-body").innerHTML = `
    <div class="folder-content-card">
      <div class="activity-log-container">
        <!-- Filter & Search -->
        <div class="filter-search">
          <h2>Filter & Search</h2>
          <div class="filters-row">
            <div class="search-box">
              <label>Search Activity</label>
              <div class="input-icon">
                <input type="text" id="search-activity" placeholder="Type user name or action..." />
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
            <button class="generate-btn">
              <img src="../../../assets/images/submissions-icon.png" alt="Generate Report" />
              Generate Reports
            </button>
          </div>
        </div>
        <!-- Activities Table -->
        <div class="activities-table">
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Role</th>
                <th>Action</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody id="activities-table-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  renderTable(activities);
  
  // Filters
  const searchInput = document.getElementById("search-activity");
  const roleFilter = document.getElementById("filter-role");
  
  [searchInput, roleFilter].forEach(el => {
    el.addEventListener("input", filterTable);
    el.addEventListener("change", filterTable);
  });
}

// Render Table
function renderTable(data) {
  const tbody = document.getElementById("activities-table-body");
  tbody.innerHTML = "";
  
  // Sort by timestamp (newest first)
  const sortedData = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  sortedData.forEach(activity => {
    const row = document.createElement("tr");
    const formattedDate = new Date(activity.timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    row.innerHTML = `
      <td>${activity.userName}</td>
      <td>${activity.role}</td>
      <td>${activity.action}</td>
      <td>${formattedDate}</td>
    `;
    tbody.appendChild(row);
  });
}

// Filter Function
function filterTable() {
  const search = document.getElementById("search-activity").value.toLowerCase();
  const role = document.getElementById("filter-role").value;
  
  const filtered = activities.filter(activity => {
    const matchSearch = activity.userName.toLowerCase().includes(search) ||
                       activity.role.toLowerCase().includes(search) ||
                       activity.action.toLowerCase().includes(search);
    
    const matchRole = role === "" || activity.role === role;
    
    return matchSearch && matchRole;
  });
  
  renderTable(filtered);
}

function initActivityLog() {
  loadActivityModules();
}

initActivityLog();