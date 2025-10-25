// ======== USER DATA ========
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


// ======== MAIN CONTAINER LOADER ========
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
            <div class="btn-group">
              <button class="add-user-btn">
                <img src="../../../assets/images/add-user.png" alt="Add User" />
                Add User
              </button>
              <button class="generate-btn">
                <img src="../../../assets/images/submissions-icon.png" alt="Generate Report" />
                Generate Reports
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
  
  renderTable(users);
  setupFilters();
  document.querySelector(".add-user-btn").addEventListener("click", showAddUserModal);
}


// ======== TABLE RENDER FUNCTION ========
function renderTable(userList) {
  const tbody = document.getElementById("users-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  userList.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="clickable-user" onclick="showUserDetails(${index})">${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.status}</td>
      <td>${user.dateRegistered}</td>
      <td>${user.lastLogin}</td>
      <td>
        <button class="edit-btn" onclick="showEditModal(${index})">Edit</button>
        <button class="deactivate-btn" onclick="showDeactivateModal(${index})">Deactivate</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}
// ======== VIEW USER DETAILS MODAL ========
function showUserDetails(index) {
  const user = users[index];
  const modal = document.getElementById("modal");
  const content = document.getElementById("modal-content");

  content.innerHTML = `
    <span class="close-btn" id="close-details">&times;</span>
    <h3>User Details</h3>
    <div class="user-details-modal">
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Role:</strong> ${user.role}</p>
      <p><strong>Status:</strong> ${user.status}</p>
      <p><strong>Date Registered:</strong> ${user.dateRegistered}</p>
      <p><strong>Last Login:</strong> ${user.lastLogin}</p>
      ${user.department ? `<p><strong>Department:</strong> ${user.department}</p>` : ""}
      ${user.adviserName ? `<p><strong>Adviser:</strong> ${user.adviserName}</p>` : ""}
      ${user.adviserEmail ? `<p><strong>Adviser Email:</strong> ${user.adviserEmail}</p>` : ""}
      ${user.officer1Name ? `<p><strong>President:</strong> ${user.officer1Name}</p>` : ""}
      ${user.officer1Email ? `<p><strong>President Email:</strong> ${user.officer1Email}</p>` : ""}
      ${user.description ? `<p><strong>Description:</strong> ${user.description}</p>` : ""}
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" id="close-details-btn">Close</button>
    </div>
  `;

  modal.style.display = "flex";
  document.getElementById("close-details").onclick = () => (modal.style.display = "none");
  document.getElementById("close-details-btn").onclick = () => (modal.style.display = "none");
}



// ======== ADD USER MODAL ========
function showAddUserModal() {
  const modal = document.getElementById("modal");
  const content = document.getElementById("modal-content");

  content.innerHTML = `
    <span class="close-btn" id="close-add">&times;</span>
    <h3>Add New User</h3>
    
    <label>Name</label>
    <input type="text" id="add-name" placeholder="Enter full name" />

    <label>Abbreviation</label>
    <input type="text" id="add-abbr" placeholder="Enter abbreviation" />

    <label>Email</label>
    <input type="email" id="add-email" placeholder="Enter email" />

    <label>Department</label>
    <select id="add-dept">
      <option value="">Select Department</option>
      <option value="SAMCIS">SAMCIS</option>
      <option value="STELA">STELA</option>
      <option value="SEA">SEA</option>
      <option value="SOHNABS">SOHNABS</option>
      <option value="SOM">SOM</option>
    </select>

    <label>Role</label>
    <select id="add-type">
      <option value="">Select Role</option>
      <option value="Admin">Admin</option>
      <option value="OSAS Officer">OSAS Officer</option>
      <option value="Student Org">Student Org</option>
    </select>

    <label>Adviser Name</label>
    <input type="text" id="add-adv-name" placeholder="Enter adviser name" />

    <label>Adviser Email</label>
    <input type="email" id="add-adv-email" placeholder="Enter adviser email" />

    <label>Org President Name</label>
    <input type="text" id="add-off1-name" placeholder="Enter president name" />

    <label>Org President Email</label>
    <input type="email" id="add-off1-email" placeholder="Enter president email" />

    <label>Description</label>
    <textarea id="add-desc" rows="3" style="width:100%;" placeholder="Enter description"></textarea>

    <label>Status</label>
    <select id="add-status">
      <option>Active</option>
      <option>Inactive</option>
      <option>Suspended</option>
    </select>

    <div class="modal-actions">
      <button class="btn-cancel" id="cancel-add">Cancel</button>
      <button class="btn-confirm" id="save-add">Save User</button>
    </div>
  `;

  modal.style.display = "flex";
  document.getElementById("close-add").onclick = () => (modal.style.display = "none");
  document.getElementById("cancel-add").onclick = () => (modal.style.display = "none");

  // When "Save User" is clicked — show preview modal before final save
  document.getElementById("save-add").onclick = () => {
    const newUser = {
      name: document.getElementById("add-name").value.trim(),
      abbreviation: document.getElementById("add-abbr").value.trim(),
      email: document.getElementById("add-email").value.trim(),
      department: document.getElementById("add-dept").value.trim(),
      type: document.getElementById("add-type").value.trim(),
      adviserName: document.getElementById("add-adv-name").value.trim(),
      adviserEmail: document.getElementById("add-adv-email").value.trim(),
      officer1Name: document.getElementById("add-off1-name").value.trim(),
      officer1Email: document.getElementById("add-off1-email").value.trim(),
      description: document.getElementById("add-desc").value.trim(),
      status: document.getElementById("add-status").value,
      dateRegistered: new Date().toLocaleDateString("en-GB"),
      lastLogin: "N/A"
    };

    if (!newUser.name || !newUser.email) {
      alert("Please fill in required fields (Name and Email).");
      return;
    }

    // === Show Preview Confirmation Modal ===
    content.innerHTML = `
      <span class="close-btn" id="close-preview">&times;</span>
      <h3>Confirm User Details</h3>
      <p>Review the information below before adding:</p>
      <div class="preview-details">
        <p><strong>Name:</strong> ${newUser.name}</p>
        <p><strong>Abbreviation:</strong> ${newUser.abbreviation}</p>
        <p><strong>Email:</strong> ${newUser.email}</p>
        <p><strong>Department:</strong> ${newUser.department}</p>
        <p><strong>Type:</strong> ${newUser.type}</p>
        <p><strong>Adviser Name:</strong> ${newUser.adviserName}</p>
        <p><strong>Adviser Email:</strong> ${newUser.adviserEmail}</p>
        <p><strong>President Name:</strong> ${newUser.officer1Name}</p>
        <p><strong>President Email:</strong> ${newUser.officer1Email}</p>
        <p><strong>Description:</strong> ${newUser.description}</p>
        <p><strong>Status:</strong> ${newUser.status}</p>
      </div>
      <p>Are you sure you want to add this user?</p>
      <div class="modal-actions">
        <button class="btn-cancel" id="back-add">Go Back</button>
        <button class="btn-confirm" id="confirm-add">Yes, Add User</button>
      </div>
    `;

    document.getElementById("close-preview").onclick = () => (modal.style.display = "none");
    document.getElementById("back-add").onclick = () => showAddUserModal();

    document.getElementById("confirm-add").onclick = () => {
      users.push({
        name: newUser.name,
        email: newUser.email,
        role: newUser.type || "Student Org",
        status: newUser.status,
        dateRegistered: newUser.dateRegistered,
        lastLogin: "N/A"
      });
      renderTable(users);
      modal.style.display = "none";
      alert("User successfully added!");
    };
  };
}

// ======== EDIT USER MODAL ========
function showEditModal(index) {
  const user = users[index];
  const modal = document.getElementById("modal");
  const content = document.getElementById("modal-content");

  // Main edit form
  content.innerHTML = `
    <span class="close-btn" id="close-edit">&times;</span>
    <h3>Edit User Details</h3>
    
    <label>Name</label>
    <input type="text" id="edit-name" value="${user.name}" />

    <label>Abbreviation</label>
    <input type="text" id="edit-abbr" value="${user.abbr || ""}" />

    <label>Email</label>
    <input type="email" id="edit-email" value="${user.email}" />

    <label>Department</label>
    <select id="edit-dept">
      <option value="SAMCIS" ${user.department === "SAMCIS" ? "selected" : ""}>SAMCIS</option>
      <option value="STELA" ${user.department === "STELA" ? "selected" : ""}>STELA</option>
      <option value="SEA" ${user.department === "SEA" ? "selected" : ""}>SEA</option>
      <option value="SOHNABS" ${user.department === "SOHNABS" ? "selected" : ""}>SOHNABS</option>
      <option value="SOM" ${user.department === "SOM" ? "selected" : ""}>SOM</option>
    </select>

    <label>Role</label>
    <select id="edit-type">
      <option value="Admin" ${user.role === "Admin" ? "selected" : ""}>Admin</option>
      <option value="OSAS Officer" ${user.role === "OSAS Officer" ? "selected" : ""}>OSAS Officer</option>
      <option value="Student Org" ${user.role === "Student Org" ? "selected" : ""}>Student Org</option>
    </select>

    <label>Adviser Name</label>
    <input type="text" id="edit-adv-name" value="${user.adviserName || ""}" />

    <label>Adviser Email</label>
    <input type="email" id="edit-adv-email" value="${user.adviserEmail || ""}" />

    <label>Org President Name</label>
    <input type="text" id="edit-off1-name" value="${user.officer1Name || ""}" />
    
    <label>Org President Email</label>
    <input type="email" id="edit-off1-email" value="${user.officer1Email || ""}" />

    <label>Description</label>
    <textarea id="edit-desc" rows="3" style="width:100%;">${user.description || ""}</textarea>

    <label>Status</label>
    <select id="edit-status">
      <option ${user.status === "Active" ? "selected" : ""}>Active</option>
      <option ${user.status === "Inactive" ? "selected" : ""}>Inactive</option>
      <option ${user.status === "Suspended" ? "selected" : ""}>Suspended</option>
    </select>

    <div class="modal-actions">
      <button class="btn-cancel" id="cancel-edit">Cancel</button>
      <button class="btn-confirm" id="save-edit">Save Changes</button>
    </div>
  `;

  modal.style.display = "flex";
  document.getElementById("close-edit").onclick = () => (modal.style.display = "none");
  document.getElementById("cancel-edit").onclick = () => (modal.style.display = "none");

  // When Save Changes is clicked, show preview confirmation
  document.getElementById("save-edit").onclick = () => {
    const updatedUser = {
      name: document.getElementById("edit-name").value.trim(),
      abbr: document.getElementById("edit-abbr").value.trim(),
      email: document.getElementById("edit-email").value.trim(),
      department: document.getElementById("edit-dept").value.trim(),
      role: document.getElementById("edit-type").value.trim(),
      adviserName: document.getElementById("edit-adv-name").value.trim(),
      adviserEmail: document.getElementById("edit-adv-email").value.trim(),
      officer1Name: document.getElementById("edit-off1-name").value.trim(),
      officer1Email: document.getElementById("edit-off1-email").value.trim(),
      description: document.getElementById("edit-desc").value.trim(),
      status: document.getElementById("edit-status").value
    };

    if (!updatedUser.name || !updatedUser.email) {
      alert("Please fill in required fields (Name and Email).");
      return;
    }

    // Show preview modal
    content.innerHTML = `
      <span class="close-btn" id="close-preview-edit">&times;</span>
      <h3>Confirm Updated Details</h3>
      <p>Review the information below before saving:</p>
      <div class="preview-details">
        <p><strong>Name:</strong> ${updatedUser.name}</p>
        <p><strong>Abbreviation:</strong> ${updatedUser.abbr}</p>
        <p><strong>Email:</strong> ${updatedUser.email}</p>
        <p><strong>Department:</strong> ${updatedUser.department}</p>
        <p><strong>Type:</strong> ${updatedUser.role}</p>
        <p><strong>Adviser Name:</strong> ${updatedUser.adviserName}</p>
        <p><strong>Adviser Email:</strong> ${updatedUser.adviserEmail}</p>
        <p><strong>President Name:</strong> ${updatedUser.officer1Name}</p>
        <p><strong>President Email:</strong> ${updatedUser.officer1Email}</p>
        <p><strong>Description:</strong> ${updatedUser.description}</p>
        <p><strong>Status:</strong> ${updatedUser.status}</p>
      </div>
      <p>Are you sure you want to save these changes?</p>
      <div class="modal-actions">
        <button class="btn-cancel" id="back-edit">Go Back</button>
        <button class="btn-confirm" id="confirm-edit">Yes, Save Changes</button>
      </div>
    `;

    // Handle preview confirmation actions
    document.getElementById("close-preview-edit").onclick = () => (modal.style.display = "none");
    document.getElementById("back-edit").onclick = () => showEditModal(index);

    document.getElementById("confirm-edit").onclick = () => {
      Object.assign(users[index], updatedUser);
      renderTable(users);
      modal.style.display = "none";
      alert("User details successfully updated!");
    };
  };
}


// ======== DEACTIVATE MODAL ========
function showDeactivateModal(index) {
  const user = users[index];
  const modal = document.getElementById("modal");
  const content = document.getElementById("modal-content");

  content.innerHTML = `
    <span class="close-btn" id="close-deactivate">&times;</span>
    <h3>Deactivate User</h3>
    <p>Are you sure you want to deactivate <strong>${user.name}</strong>?</p>
    <div class="modal-actions">
      <button class="btn-cancel" id="cancel-deactivate">Cancel</button>
      <button class="btn-confirm" id="confirm-deactivate">Yes, Deactivate</button>
    </div>
  `;

  modal.style.display = "flex";
  document.getElementById("close-deactivate").onclick = () => (modal.style.display = "none");
  document.getElementById("cancel-deactivate").onclick = () => (modal.style.display = "none");
  document.getElementById("confirm-deactivate").onclick = () => {
    users[index].status = "Inactive";
    renderTable(users);
    modal.style.display = "none";
  };
}


// ======== FILTER FUNCTIONS ========
function setupFilters() {
  const searchInput = document.getElementById("search-user");
  const roleFilter = document.getElementById("filter-role");
  const statusFilter = document.getElementById("filter-status");
  [searchInput, roleFilter, statusFilter].forEach(el => {
    el.addEventListener("input", filterTable);
    el.addEventListener("change", filterTable);
  });
}

function filterTable() {
  const search = document.getElementById("search-user").value.toLowerCase();
  const role = document.getElementById("filter-role").value;
  const status = document.getElementById("filter-status").value;
  const filtered = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search) || user.role.toLowerCase().includes(search);
    const matchRole = role === "" || user.role === role;
    const matchStatus = status === "" || user.status === status;
    return matchSearch && matchRole && matchStatus;
  });
  renderTable(filtered);
}


// ======== INIT ========
function initUserManagement() {
  loadUserModules();
}
initUserManagement();

window.showEditModal = showEditModal;
window.showDeactivateModal = showDeactivateModal;
window.showUserDetails = showUserDetails;
