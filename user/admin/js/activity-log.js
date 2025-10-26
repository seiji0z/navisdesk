// ======== LOAD AND RENDER ACTIVITY LOG ========

async function loadActivityLogData() {
  try {
    // Load all JSON data at once
    const [logsRes, adminRes, orgRes] = await Promise.all([
      fetch("../../../data/user_logs.json"),
      fetch("../../../data/admin_osas.json"),
      fetch("../../../data/student_organizations.json")
    ]);

    if (!logsRes.ok || !adminRes.ok || !orgRes.ok) {
      throw new Error("Failed to load one or more JSON files. Check file paths.");
    }

    const [logsData, adminData, orgData] = await Promise.all([
      logsRes.json(),
      adminRes.json(),
      orgRes.json()
    ]);

    // Create quick lookup maps for efficiency
    const adminMap = new Map(adminData.map(a => [a._id.$oid, a.name]));
    const orgMap = new Map(orgData.map(o => [o._id.$oid, o.name]));

    // Combine all logs with user info
    const activities = logsData.map(log => {
      const userId = log.user_id.$oid;
      const role = log.role || "Unknown";
      const username =
        adminMap.get(userId) ||
        orgMap.get(userId) ||
        "Unknown User";

      return {
        _id: log._id.$oid,
        user_id: userId,
        userName: username,
        role: role,
        action: log.action,
        timestamp: log.timestamp
      };
    });

    renderActivityTable(activities);
    setupActivityFilters(activities);

  } catch (error) {
    console.error(error);
    document.getElementById("activities-table-body").innerHTML = `
      <tr><td colspan="4" style="text-align:center;color:red;">
        Failed to load activity log data. Check JSON paths or structure.
      </td></tr>`;
  }
}

// ======== RENDER ACTIVITY LOG UI ========

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

  // Load the JSON data after the table is ready
  loadActivityLogData();
}

// ======== TABLE RENDER FUNCTION ========

function renderActivityTable(data) {
  const tbody = document.getElementById("activities-table-body");
  tbody.innerHTML = "";

  // Sort by timestamp (newest first)
  const sortedData = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  sortedData.forEach(activity => {
    const row = document.createElement("tr");
    const formattedDate = new Date(activity.timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
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

// ======== FILTERS ========

function setupActivityFilters(activities) {
  const searchInput = document.getElementById("search-activity");
  const roleFilter = document.getElementById("filter-role");

  function filterTable() {
    const search = searchInput.value.toLowerCase();
    const role = roleFilter.value;

    const filtered = activities.filter(a => {
      const matchSearch =
        a.userName.toLowerCase().includes(search) ||
        a.role.toLowerCase().includes(search) ||
        a.action.toLowerCase().includes(search);
      const matchRole = role === "" || a.role === role;
      return matchSearch && matchRole;
    });

    renderActivityTable(filtered);
  }

  [searchInput, roleFilter].forEach(el => {
    el.addEventListener("input", filterTable);
    el.addEventListener("change", filterTable);
  });
}

// ======== INITIALIZATION ========

function initActivityLog() {
  loadActivityModules();
}

document.addEventListener("DOMContentLoaded", initActivityLog);
