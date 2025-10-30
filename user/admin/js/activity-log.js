// ======== LOAD AND RENDER ACTIVITY LOG ========
async function loadActivityLogData() {
  try {
    const API_BASE = "http://localhost:5000";
    const [logsRes, adminRes, orgRes] = await Promise.all([
      fetch(`${API_BASE}/api/activity-logs`),
      fetch(`${API_BASE}/api/admins`),
      fetch(`${API_BASE}/api/student-orgs`)
    ]);

    if (!logsRes.ok || !adminRes.ok || !orgRes.ok) {
      throw new Error("API failed");
    }

    const [logsData, adminData, orgData] = await Promise.all([
      logsRes.json(),
      adminRes.json(),
      orgRes.json()
    ]);

    const adminMap = new Map(adminData.map(a => [a._id.toString(), a.name]));
    const orgMap = new Map(orgData.map(o => [o._id.toString(), o.name]));

    const activities = logsData
      .filter(log => log.user_id && log.action && log.timestamp)
      .map(log => {
        const userIdStr = log.user_id.toString();
        const role = log.role || "Unknown";
        const username = adminMap.get(userIdStr) || orgMap.get(userIdStr) || "Unknown User";

        return {
          _id: log._id.toString(),
          user_id: userIdStr,
          userName: username,
          role,
          action: log.action,
          timestamp: log.timestamp
        };
      });

    if (activities.length === 0) {
      document.getElementById("activities-table-body").innerHTML = `
        <tr><td colspan="4" style="text-align:center; color:#888; padding:20px;">
          No activity logs found.
        </td></tr>`;
      return;
    }

    renderActivityTable(activities);
    setupActivityFilters(activities);

  } catch (error) {
    console.error("Activity Log Load Failed:", error);
    document.getElementById("activities-table-body").innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; color:red; padding:20px;">
          Failed to load user data.
        </td>
      </tr>`;
  }
}

// ======== RENDER UI ========
function loadActivityModules() {
  document.querySelector("#folder-body").innerHTML = `
    <div class="folder-content-card">
      <div class="activity-log-container">
        <div class="filter-search">
          <h2>Filter & Search</h2>
          <div class="filters-row">
            <div class="search-box">
              <label>Search Activity</label>
              <div class="input-icon">
                <input type="text" id="search-activity" placeholder="Type user name or action..." />
                <button class="search-btn">
                  <img src="../../../assets/images/review-icon.png" alt="Search" />
                </button>
              </div>
            </div>
            <div class="select-group">
              <label>Role</label>
              <select id="filter-role">
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="OSAS Officer">OSAS Officer</option>
                <option value="Student Org">Student Org</option>
              </select>
            </div>
          </div>
        </div>

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

  loadActivityLogData();
}

// ======== RENDER TABLE ========
function renderActivityTable(data) {
  const tbody = document.getElementById("activities-table-body");
  tbody.innerHTML = "";

  const sorted = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (sorted.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#666;">No activities found.</td></tr>`;
    return;
  }

  sorted.forEach(activity => {
    const row = document.createElement("tr");
    const date = new Date(activity.timestamp).toLocaleString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true
    });

    row.innerHTML = `
      <td>${escapeHtml(activity.userName)}</td>
      <td><span class="role-badge role-${activity.role.toLowerCase().replace(' ', '-')}">
        ${formatRoleDisplay(activity.role)}
      </span></td>
      <td>${escapeHtml(activity.action)}</td>
      <td>${date}</td>
    `;
    tbody.appendChild(row);
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatRoleDisplay(role) {
  return {
    "Organization": "Student Org",
    "OSAS Officer": "OSAS Officer",
    "Admin": "Admin"
  }[role] || role;
}

// ======== FILTERS ========
function setupActivityFilters(activities) {
  const searchInput = document.getElementById("search-activity");
  const roleFilter = document.getElementById("filter-role");

  function filter() {
    const search = searchInput.value.toLowerCase().trim();
    const role = roleFilter.value;

    const filtered = activities.filter(a => {
      const matchSearch = !search || (
        a.userName.toLowerCase().includes(search) ||
        a.action.toLowerCase().includes(search)
      );
      const matchRole = !role || 
        (role === "Student Org" && a.role === "Organization") ||
        a.role === role;
      return matchSearch && matchRole;
    });

    renderActivityTable(filtered);
  }

  searchInput.addEventListener("input", filter);
  roleFilter.addEventListener("change", filter);
  document.querySelector(".search-btn").addEventListener("click", filter);
}

// ======== INIT ========
function initActivityLog() {
  loadActivityModules();
}

document.addEventListener("DOMContentLoaded", initActivityLog);