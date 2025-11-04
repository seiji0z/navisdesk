// ======== GLOBAL USERS ARRAY ========
let users = [];
let applyFilters;

// ======== LOAD USERS FROM DATABASE (FILTERED BY PHP) ========
async function loadUsersFromDB(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const url = `../../../server/php/get-users.php?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

    const data = await res.json();

    users = data;
    renderTable(users);
  } catch (error) {
    console.error("DB Load Error:", error);
    const tbody = document.getElementById("users-table-body");
    if (tbody) {
      tbody.innerHTML = `
        <tr><td colspan="7" style="text-align:center;color:red;padding:20px;">
          Failed to load user data.
        </td></tr>`;
    }
  }
}

// ======== FORMAT DATE ========
function formatDate(isoString) {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  if (isNaN(date)) return "Invalid Date";
  return date.toLocaleDateString("en-GB");
}

// ======== LOAD MAIN PAGE (HTML + INITIAL DATA + FILTERS) ========
function loadUserModules() {
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
                  <img src="../../../assets/images/review-icon.png" alt="Search" />
                </button>
              </div>
            </div>

            <div class="select-group">
              <label>Role</label>
              <select id="filter-role">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="osas">OSAS Officer</option>
                <option value="Organization">Student Org</option>
              </select>
            </div>

            <!-- NEW DEPARTMENT FILTER -->
            <div class="select-group">
              <label>Department</label>
              <select id="filter-department">
                <option value="">All Departments</option>
                <option value="SAMCIS">SAMCIS</option>
                <option value="SOHNABS">SOHNABS</option>
                <option value="STELA">STELA</option>
                <option value="SEA">SEA</option>
                <option value="SOM">SOM</option>
                <option value="SOL">SOL</option>
                <option value="UNIV WIDE">UNIV WIDE</option>
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

            <div class="btn-group">
              <button class="add-user-btn" onclick="showAddUserModal()">
                <img src="../../../assets/images/add-user.png" alt="Add User" />
                Add User
              </button>
            </div>
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
            <tbody id="users-table-body"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Container -->
    <div id="modal" class="modal">
      <div class="modal-content" id="modal-content"></div>
    </div>
  `;

  // Load data → then attach filters (elements exist)
  loadUsersFromDB().then(setupFilters);
}

// ======== TABLE RENDER FUNCTION ========
function renderTable(userList) {
  const tbody = document.getElementById("users-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  userList.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.status}</td>
      <td>${user.dateRegistered}</td>
      <td>${user.lastLogin}</td>
      <td>
        <div class="action-buttons">
          <button class="edit-btn" onclick="showEditModal(${index})">Edit</button>
          <button class="deactivate-btn" onclick="showDeactivateModal(${index})">Deactivate</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ======== FILTER FUNCTIONS ========
function setupFilters() {
  const searchInput   = document.getElementById("search-user");
  const roleFilter    = document.getElementById("filter-role");
  const deptFilter    = document.getElementById("filter-department");
  const statusFilter  = document.getElementById("filter-status");

  if (!searchInput || !roleFilter || !deptFilter || !statusFilter) return;

  // Remove any old listeners to prevent stacking
  applyFilters = () => {
    const filters = {
      search:      searchInput.value.trim(),
      role:        roleFilter.value,
      department:  deptFilter.value,
      status:      statusFilter.value,
    };
    loadUsersFromDB(filters);
  };

  // Clean up old listeners
  searchInput.removeEventListener("input", applyFilters);
  roleFilter.removeEventListener("change", applyFilters);
  deptFilter.removeEventListener("change", applyFilters);
  statusFilter.removeEventListener("change", applyFilters);

  // Add fresh listeners
  searchInput.addEventListener("input", applyFilters);
  roleFilter.addEventListener("change", applyFilters);
  deptFilter.addEventListener("change", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
}

// ======== ADD USER MODAL ========
function showAddUserModal() {
  const modal = document.getElementById("modal");
  const content = document.getElementById("modal-content");

  const departments = ["SAMCIS", "SOHNABS", "STELA", "SEA", "SOM", "SOL"];
  const orgTypes = ["Academic Org", "Publication", "Universal Org"];

  function renderRoleFields(role) {
    if (role === "Organization") {
      return `
        <label>Name</label>
        <input type="text" id="add-name" placeholder="Enter organization name" />
        <label>Abbreviation</label>
        <input type="text" id="add-abbr" placeholder="Enter abbreviation" />
        <label>Email</label>
        <input type="email" id="add-email" placeholder="Enter email" />
        <label>Department</label>
        <select id="add-dept">
          <option value="">Select Department</option>
          ${departments
            .map((d) => `<option value="${d}">${d}</option>`)
            .join("")}
        </select>
        <label>Description</label>
        <textarea id="add-desc" rows="3" placeholder="Enter organization description"></textarea>
        <label>Type of Organization</label>
        <select id="add-org-type">
          <option value="">Select Type</option>
          ${orgTypes.map((t) => `<option value="${t}">${t}</option>`).join("")}
        </select>
        <label>Adviser Name</label>
        <input type="text" id="add-adv-name" placeholder="Enter adviser name" />
        <label>Adviser Email</label>
        <input type="email" id="add-adv-email" placeholder="Enter adviser email" />
        <label>Facebook Link</label>
        <input type="url" id="add-fb" placeholder="Enter Facebook link" />
        <label>Instagram Link (Optional)</label>
        <input type="url" id="add-ig" placeholder="Enter Instagram link" />
        <label>Website Link (Optional)</label>
        <input type="url" id="add-web" placeholder="Enter website link" />
      `;
    } else if (role === "OSAS" || role === "Admin") {
      return `
        <label>Name</label>
        <input type="text" id="add-name" placeholder="Enter full name" />
        <label>Email</label>
        <input type="email" id="add-email" placeholder="Enter email" />
        <label>Department</label>
        <select id="add-dept">
          <option value="">Select Department</option>
          ${[...departments, "UNIV WIDE"]
            .map((d) => `<option value="${d}">${d}</option>`)
            .join("")}
        </select>
      `;
    }
    return "";
  }

  content.innerHTML = `
    <span class="close-btn" id="close-add">×</span>
    <h3>Add New User</h3>
    <label>Role</label>
    <select id="add-role">
      <option value="">Select Role</option>
      <option value="Organization">Organization</option>
      <option value="OSAS">OSAS</option>
      <option value="Admin">Admin</option>
    </select>
    <div id="role-fields"></div>
    <div class="modal-actions">
      <button class="btn-cancel" id="cancel-add">Cancel</button>
      <button class="btn-confirm" id="save-add">Save User</button>
    </div>
  `;

  modal.style.display = "flex";

  const roleSelect = content.querySelector("#add-role");
  const roleFields = content.querySelector("#role-fields");

  roleSelect.addEventListener("change", () => {
    roleFields.innerHTML = renderRoleFields(roleSelect.value);
  });

  document.getElementById("close-add").onclick = () =>
    (modal.style.display = "none");
  document.getElementById("cancel-add").onclick = () =>
    (modal.style.display = "none");

  document.getElementById("save-add").onclick = () => {
    const role = roleSelect.value;
    if (!role) return alert("Please select a role.");

    const newUser = {
      role,
      name: document.getElementById("add-name")?.value.trim() || "",
      email: document.getElementById("add-email")?.value.trim() || "",
      department: document.getElementById("add-dept")?.value || "",
      status: "Active",
      dateRegistered: new Date().toLocaleDateString("en-GB"),
      lastLogin: "N/A",
    };

    if (role === "Organization") {
      newUser.abbreviation =
        document.getElementById("add-abbr")?.value.trim() || "";
      newUser.description =
        document.getElementById("add-desc")?.value.trim() || "";
      newUser.orgType = document.getElementById("add-org-type")?.value || "";
      newUser.adviserName =
        document.getElementById("add-adv-name")?.value.trim() || "";
      newUser.adviserEmail =
        document.getElementById("add-adv-email")?.value.trim() || "";
      newUser.fb = document.getElementById("add-fb")?.value.trim() || "";
      newUser.ig = document.getElementById("add-ig")?.value.trim() || "";
      newUser.website = document.getElementById("add-web")?.value.trim() || "";
    }

    if (!newUser.name || !newUser.email)
      return alert("Please fill in the required fields (Name, Email).");

    showPreviewModal(newUser, () => {
      users.push(newUser);
      renderTable(users);
      modal.style.display = "none";
      alert(`${role} user added successfully!`);
    });
  };
}

// ======== EDIT USER MODAL ========
function showEditModal(index) {
  const user = users[index];
  const modal = document.getElementById("modal");
  const content = document.getElementById("modal-content");

  const departments = ["SAMCIS", "SOHNABS", "STELA", "SEA", "SOM", "SOL"];
  const orgTypes = ["Academic Org", "Publication", "Universal Org"];

  function renderEditFields(role) {
    if (role === "Organization") {
      return `
        <label>Name</label>
        <input type="text" id="edit-name" value="${user.name || ""}" />
        <label>Abbreviation</label>
        <input type="text" id="edit-abbr" value="${user.abbreviation || ""}" />
        <label>Email</label>
        <input type="email" id="edit-email" value="${user.email || ""}" />
        <label>Department</label>
        <select id="edit-dept">
          ${departments
            .map(
              (d) =>
                `<option value="${d}" ${
                  user.department === d ? "selected" : ""
                }>${d}</option>`
            )
            .join("")}
        </select>
        <label>Description</label>
        <textarea id="edit-desc">${user.description || ""}</textarea>
        <label>Type of Organization</label>
        <select id="edit-org-type">
          ${orgTypes
            .map(
              (t) =>
                `<option value="${t}" ${
                  user.orgType === t ? "selected" : ""
                }>${t}</option>`
            )
            .join("")}
        </select>
        <label>Adviser Name</label>
        <input type="text" id="edit-adv-name" value="${
          user.adviserName || ""
        }" />
        <label>Adviser Email</label>
        <input type="email" id="edit-adv-email" value="${
          user.adviserEmail || ""
        }" />
        <label>Facebook Link</label>
        <input type="url" id="edit-fb" value="${user.fb || ""}" />
        <label>Instagram Link (Optional)</label>
        <input type="url" id="edit-ig" value="${user.ig || ""}" />
        <label>Website Link (Optional)</label>
        <input type="url" id="edit-web" value="${user.website || ""}" />
        <label>Status</label>
        <select id="edit-status">
          <option ${user.status === "Active" ? "selected" : ""}>Active</option>
          <option ${
            user.status === "Inactive" ? "selected" : ""
          }>Inactive</option>
          <option ${
            user.status === "Suspended" ? "selected" : ""
          }>Suspended</option>
        </select>
      `;
    } else {
      return `
        <label>Name</label>
        <input type="text" id="edit-name" value="${user.name || ""}" />
        <label>Email</label>
        <input type="email" id="edit-email" value="${user.email || ""}" />
        <label>Department</label>
        <select id="edit-dept">
          ${[...departments, "UNIV WIDE"]
            .map(
              (d) =>
                `<option value="${d}" ${
                  user.department === d ? "selected" : ""
                }>${d}</option>`
            )
            .join("")}
        </select>
        <label>Status</label>
        <select id="edit-status">
          <option ${user.status === "Active" ? "selected" : ""}>Active</option>
          <option ${
            user.status === "Inactive" ? "selected" : ""
          }>Inactive</option>
          <option ${
            user.status === "Suspended" ? "selected" : ""
          }>Suspended</option>
        </select>
      `;
    }
  }

  content.innerHTML = `
    <span class="close-btn" id="close-edit">×</span>
    <h3>Edit User</h3>
    <label>Role</label>
    <select id="edit-role">
      <option value="Organization" ${
        user.role === "Organization" ? "selected" : ""
      }>Organization</option>
      <option value="OSAS" ${
        user.role === "OSAS" ? "selected" : ""
      }>OSAS</option>
      <option value="Admin" ${
        user.role === "Admin" ? "selected" : ""
      }>Admin</option>
    </select>
    <div id="edit-fields">${renderEditFields(user.role)}</div>
    <div class="modal-actions">
      <button class="btn-cancel" id="cancel-edit">Cancel</button>
      <button class="btn-confirm" id="save-edit">Save Changes</button>
    </div>
  `;

  modal.style.display = "flex";

  const roleSelect = document.getElementById("edit-role");
  const fieldsContainer = document.getElementById("edit-fields");

  roleSelect.addEventListener("change", () => {
    fieldsContainer.innerHTML = renderEditFields(roleSelect.value);
  });

  document.getElementById("close-edit").onclick = () =>
    (modal.style.display = "none");
  document.getElementById("cancel-edit").onclick = () =>
    (modal.style.display = "none");

  document.getElementById("save-edit").onclick = () => {
    const updatedUser = {
      ...user,
      role: roleSelect.value,
      name: document.getElementById("edit-name").value.trim(),
      email: document.getElementById("edit-email").value.trim(),
      department: document.getElementById("edit-dept").value,
      status: document.getElementById("edit-status").value,
    };

    if (updatedUser.role === "Organization") {
      updatedUser.abbreviation = document
        .getElementById("edit-abbr")
        .value.trim();
      updatedUser.description = document
        .getElementById("edit-desc")
        .value.trim();
      updatedUser.orgType = document.getElementById("edit-org-type").value;
      updatedUser.adviserName = document
        .getElementById("edit-adv-name")
        .value.trim();
      updatedUser.adviserEmail = document
        .getElementById("edit-adv-email")
        .value.trim();
      updatedUser.fb = document.getElementById("edit-fb").value.trim();
      updatedUser.ig = document.getElementById("edit-ig").value.trim();
      updatedUser.website = document.getElementById("edit-web").value.trim();
    }

    showPreviewModal(updatedUser, () => {
      Object.assign(user, updatedUser);
      renderTable(users);
      modal.style.display = "none";
      alert("User details updated successfully!");
    });
  };
}

// ======== PREVIEW MODAL ========
function showPreviewModal(data, onConfirm) {
  const previewModal = document.createElement("div");
  previewModal.className = "preview-modal";
  previewModal.style.cssText = `
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
  `;

  const detailsHTML = Object.entries(data)
    .map(
      ([key, value]) =>
        `<tr><td><strong>${key}</strong></td><td>${value || "—"}</td></tr>`
    )
    .join("");

  previewModal.innerHTML = `
    <div style="background: #fff; padding: 20px 25px; border-radius: 12px; width: 450px; max-height: 80vh; overflow-y: auto;">
      <h3 style="text-align:center;margin-bottom:10px;">Review Details</h3>
      <p style="text-align:center;">Please review the details before saving. Are all the details correct?</p>
      <table style="width:100%;border-collapse:collapse;margin:10px 0;">
        ${detailsHTML}
      </table>
      <div style="text-align:center;margin-top:15px;">
        <button id="confirm-preview" style="background:#28a745;color:white;padding:8px 14px;border:none;border-radius:6px;margin-right:8px;">Confirm</button>
        <button id="cancel-preview" style="background:#dc3545;color:white;padding:8px 14px;border:none;border-radius:6px;">Go Back</button>
      </div>
    </div>
  `;

  document.body.appendChild(previewModal);

  previewModal.querySelector("#confirm-preview").onclick = () => {
    onConfirm();
    previewModal.remove();
  };

  previewModal.querySelector("#cancel-preview").onclick = () =>
    previewModal.remove();
}

// ======== DEACTIVATE MODAL ========
function showDeactivateModal(index) {
  const user = users[index];
  const modal = document.getElementById("modal");
  const content = document.getElementById("modal-content");

  content.innerHTML = `
    <span class="close-btn" id="close-deactivate">×</span>
    <h3>Deactivate User</h3>
    <p>Are you sure you want to deactivate <strong>${user.name}</strong>?</p>
    <div class="modal-actions">
      <button class="btn-cancel" id="cancel-deactivate">Cancel</button>
      <button class="btn-confirm" id="confirm-deactivate">Yes, Deactivate</button>
    </div>
  `;

  modal.style.display = "flex";
  document.getElementById("close-deactivate").onclick = () =>
    (modal.style.display = "none");
  document.getElementById("cancel-deactivate").onclick = () =>
    (modal.style.display = "none");
  document.getElementById("confirm-deactivate").onclick = () => {
    users[index].status = "Inactive";
    renderTable(users);
    modal.style.display = "none";
  };
}

// ======== INIT ========
function initUserManagement() {
  loadUserModules();
}
initUserManagement();

window.showAddUserModal = showAddUserModal;
window.showEditModal = showEditModal;
window.showDeactivateModal = showDeactivateModal;
