let allOrganizationsData = [];

async function apiFetch(url, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const resp = await fetch(url, { ...options, headers });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${txt}`);
  }
  return resp.json();
}

const getProp = (obj, path) =>
  path.split(".").reduce((acc, part) => acc && acc[part], obj);

function createOrganizationCardHTML(org) {
  const statusClass = org.status.toLowerCase() === "active" ? "active" : "pending";
  const statusText = org.status.charAt(0).toUpperCase() + org.status.slice(1).toLowerCase();
  const adviserName = (org.adviser && org.adviser.name) || "Not Specified";
  const logoSrc = org.profile_pic || "../../../assets/images/navi-logo.png";
  const pendingReviewClass = org.has_pending_update ? "pending-review" : "";

  return `
    <div class="organization-card ${pendingReviewClass}" onclick="loadOrganizationDetails('${org._id}')">
      <div class="organization-identifier">
        <div class="organization-logo">
          <img src="${logoSrc}" alt="${org.abbreviation} logo" style="width:60px;height:60px;border-radius:50%;object-fit:cover;" />
        </div>
        <p class="organization-acronym">${org.abbreviation}</p>
      </div>
      <div class="organization-details">
        <h3>${org.name}</h3>
        <p>Department: <strong>${org.department}</strong></p>
        <p>Type: <strong>${org.type}</strong></p>
        <p>Adviser: <strong>${adviserName}</strong></p>
        <span class="status-tag ${statusClass}">${statusText}</span>
      </div>
    </div>
  `;
}

// load orgs
function loadOrganizations(organizations) {
  // calculate stats
  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter(
    (org) => org.status === "Active"
  ).length;
  const inactiveOrgs = totalOrgs - activeOrgs;
  const pendingReviewOrgs = organizations.filter(
    (org) => org.has_pending_update
  ).length;

  document.querySelector("#folder-body").innerHTML = `
    <div class="folder-content-card">
      <div class="organizations-layout">
        <div class="summary-column">
          
          <div class="summary-card total">
            <img src="../../../assets/images/organizations-icon.png" alt="" class="summary-card-bg-icon" />
            <div class="summary-card-info">
              <h3>${totalOrgs}</h3>
              <p>Total Organizations</p>
            </div>
          </div>
          
          <div class="summary-card active">
            <img src="../../../assets/images/organizations-icon.png" alt="" class="summary-card-bg-icon" />
            <div class="summary-card-info">
              <h3>${activeOrgs}</h3>
              <p>Active Organizations</p>
            </div>
          </div>

          <div class="summary-card pending">
            <img src="../../../assets/images/organizations-icon.png" alt="" class="summary-card-bg-icon" />
            <div class="summary-card-info">
              <h3>${inactiveOrgs}</h3>
              <p>Inactive Organizations</p>
            </div>
          </div>

          <div class="summary-card pending-review-summary">
            <img src="../../../assets/images/account-alert.png" alt="" class="summary-card-bg-icon" style="filter: invert(30%) sepia(85%) saturate(7000%) hue-rotate(340deg) brightness(80%) contrast(100%);" />
            <div class="summary-card-info">
              <h3>${pendingReviewOrgs}</h3>
              <p>Pending Reviews</p>
            </div>
          </div>
        </div>

        <div class="content-column">
          <div class="filter-search-organizations">
            <div class="filters-row">
              <div class="search-box">
                <label for="searchOrganization">Search Organization</label>
                <div class="input-icon">
                  <input type="text" id="searchOrganization" placeholder="Enter name or keyword..." />
                  <button class="search-btn" id="searchOrganizationBtn">
                    <img src="../../../assets/images/review-icon.png" alt="Search" />
                  </button>
                </div>
              </div>

              <div class="select-group">
                <label for="departmentFilter">School/Department</label>
                <select id="departmentFilter">
                  <option value="">All Departments</option>
                </select>
              </div>

              <div class="select-group">
                <label for="typeFilter">Type</label>
                <select id="typeFilter">
                  <option value="">All Types</option>
                </select>
              </div>

              <div class="select-group">
                <label for="statusFilter">Status</label>
                <select id="statusFilter">
                  <option value="">All Statuses</option>
                </select>
              </div>
            </div>
          </div>

          <div class="organization-cards-grid" id="organizationCardsGrid">
            </div>
        </div>
      </div>
    </div>
  `;
}

// populate filter dropdowns
function populateOrganizationFilters(organizations) {
  const departments = [
    ...new Set(organizations.map((org) => org.department)),
  ].sort();
  const types = [...new Set(organizations.map((org) => org.type))].sort();
  const statuses = [...new Set(organizations.map((org) => org.status))].sort();

  populateSelect("departmentFilter", departments);
  populateSelect("typeFilter", types);
  populateSelect("statusFilter", statuses);
}

// populate select
function populateSelect(selectId, optionsArray) {
  const select = document.getElementById(selectId);
  if (select) {
    optionsArray.forEach((option) => {
      const newOption = document.createElement("option");
      newOption.value = option;
      newOption.textContent = option;
      select.appendChild(newOption);
    });
  }
}

// render org cards
function renderOrganizationCards(organizations) {
  const grid = document.getElementById("organizationCardsGrid");
  if (!grid) return;

  if (organizations.length === 0) {
    grid.innerHTML =
      '<p style="text-align: center; grid-column: 1 / -1;">No organizations match the current filters.</p>';
    return;
  }

  const organizationCardsHTML = organizations
    .map(createOrganizationCardHTML)
    .join("");
  grid.innerHTML = organizationCardsHTML;
}

// fetch ALL organizations from the backend
async function fetchOrganizations() {
  try {
    // 1. Get the list of all orgs (id + name + department)
    const list = await apiFetch("http://localhost:5000/api/student-orgs");

    // 2. For every org fetch its full details (temporary_details, etc.)
    const fullOrgs = await Promise.all(
      list.map(async (short) => {
        try {
          const full = await apiFetch(`http://localhost:5000/api/orgs/me`, {
            headers: { "x-org-id": short._id }
          });

          // Mark pending updates
          full.has_pending_update = !!full.temporary_details;
          full.pending_data = full.temporary_details || {};
          full.pending_update_description =
            "The organization has requested to update several details.";

          return full;
        } catch (e) {
          console.error(`Failed to load details for org ${short._id}:`, e);
          return null;
        }
      })
    );

    // Drop any that failed
    return fullOrgs.filter(Boolean);
  } catch (error) {
    console.error("Could not fetch organizations from API:", error);
    return null;
  }
}

// event listeners
function addOrganizationFilterListeners() {
  const filterIds = ["departmentFilter", "typeFilter", "statusFilter"];
  filterIds.forEach((id) => {
    const selectElement = document.getElementById(id);
    if (selectElement) {
      selectElement.addEventListener("change", filterAndRenderOrganizations);
    }
  });

  const searchInput = document.getElementById("searchOrganization");
  const searchButton = document.getElementById("searchOrganizationBtn");

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        filterAndRenderOrganizations();
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", filterAndRenderOrganizations);
  }
}

// filter
function filterAndRenderOrganizations() {
  if (!allOrganizationsData) return;

  const searchTerm =
    document.getElementById("searchOrganization")?.value.toLowerCase().trim() ||
    "";
  const departmentFilter =
    document.getElementById("departmentFilter")?.value || "";
  const typeFilter = document.getElementById("typeFilter")?.value || "";
  const statusFilter = document.getElementById("statusFilter")?.value || "";

  const filteredOrganizations = allOrganizationsData.filter((org) => {
    const adviserName = (org.adviser && org.adviser.name) || "";

    const matchesSearch =
      !searchTerm ||
      org.name.toLowerCase().includes(searchTerm) ||
      org.abbreviation.toLowerCase().includes(searchTerm) ||
      org.department.toLowerCase().includes(searchTerm) ||
      adviserName.toLowerCase().includes(searchTerm);

    const matchesDepartment =
      !departmentFilter || org.department === departmentFilter;
    const matchesType = !typeFilter || org.type === typeFilter;
    const matchesStatus = !statusFilter || org.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesType && matchesStatus;
  });

  renderOrganizationCards(filteredOrganizations);
}

// render the details page
function loadOrganizationDetails(orgId) {
  console.log("Loading details for organization ID:", orgId);

  const organization = allOrganizationsData.find(
    (org) => org._id === orgId
  );

  if (!organization) {
    console.error("Organization not found!");
    document.querySelector(
      "#folder-body"
    ).innerHTML = `<div class="folder-content-card"><p>Error: Organization not found.</p></div>`;
    return;
  }

  const statusClass =
    organization.status.toLowerCase() === "active" ? "active" : "pending";
  const statusText =
    organization.status.charAt(0).toUpperCase() +
    organization.status.slice(1).toLowerCase();
  const logoSrc =
    organization.profile_pic || "../../../assets/images/navi-logo.png";
  const description =
    organization.description ||
    "No description provided for this organization.";
  const adviserName =
    (organization.adviser && organization.adviser.name) || "Not Specified";

  const createdDate = new Date(organization.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const profileUpdateReviewHTML = organization.has_pending_update
    ? `
    <div class="profile-update-review-section" onclick="showUpdateReviewModal('${
      organization._id.$oid
    }')">
      <div class="profile-update-review-header">
        <img src="../../../assets/images/account-alert.png" alt="Profile Update Icon" class="profile-update-icon" />
        <span class="profile-update-title">Profile Update Review</span>
      </div>
      <p class="profile-update-description">
        ${
          organization.pending_update_description ||
          "This organization has submitted an update to its profile details. Click to review."
        }
      </p>
    </div>
  `
    : "";

  document.querySelector("#folder-body").innerHTML = `
    <div class="folder-content-card">
      <button class="back-button" onclick="initOrganizations()">
        Back to Organizations
      </button>
      <div class="organization-detail-layout">
        
        <div class="detail-main-column">
          
          <div class="detail-inner-layout">
            
            <div class="detail-header">
              <div class="detail-logo">
                <img src="${logoSrc}" alt="${organization.abbreviation} logo" style="width:80px;height:80px;border-radius:50%;object-fit:cover;" />
              </div>
              <div class="detail-title">
                <h1>${organization.name}</h1>
                <span id="organizationStatusTag" class="status-tag ${statusClass}" 
                      onclick="promptToggleStatus('${organization._id.$oid}')">${statusText}</span>
              </div>
            </div>

            <div class="detail-content">
              ${profileUpdateReviewHTML} 
              
              <p class="description">
                ${description}
              </p>
              
              <div class="detail-info-list">
                <p><strong>Name or Organization:</strong> <span>${organization.name}</span></p>
                <p><strong>Acronym/Short Name:</strong> <span>${organization.abbreviation}</span></p>
                <p><strong>Department:</strong> <span>${organization.department}</span></p>
                <p><strong>Official SLU Institution Email:</strong> <span>${organization.email}</span></p>
                <p><strong>Type of Organization:</strong> <span>${organization.type}</span></p>
                <p><strong>Name of Adviser:</strong> <span>${adviserName}</span></p>
                <p><strong>Date Created:</strong> <span>${createdDate}</span></p>
              </div>
            </div>

          </div>
        </div>

        <div class="detail-sidebar-column">
          <div class="history-sidebar-card">
            <h3>History of submissions</h3>
            <ul class="history-list">
              <li>
                <img src="../../../assets/images/blue-submissions-icon.png" alt="doc" />
                <span>Montes Progue</span>
                <span class="date">August 10, 2025</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  `;
}

function generateDiffTableHTML(current, pending) {
  const fields = [
    { key: "name", label: "Name of Organization" },
    { key: "abbreviation", label: "Acronym / Short Name" },
    { key: "description", label: "Organization Description" },
    { key: "email", label: "Official SLU Institution Email" },
    { key: "type", label: "Type of Organization" },
    { key: "adviser.name", label: "Adviser Name" },
  ];

  let html = "";
  const noValue = "<em>Not Specified</em>";

  fields.forEach((field) => {
    const currentValue = getProp(current, field.key) || noValue;
    const requestedValue = getProp(pending, field.key);

    const isUpdated =
      requestedValue !== undefined && requestedValue !== currentValue;

    const displayValue =
      requestedValue !== undefined ? requestedValue : currentValue;

    const updateClass = isUpdated ? "highlight-update" : "";

    html += `
      <tr>
        <td><strong>${field.label}</strong></td>
        <td>${currentValue}</td>
        <td class="${updateClass}">${displayValue}</td>
      </tr>
    `;
  });

  return html;
}

function showUpdateReviewModal(orgId) {
  closeReviewModal();

  const organization = allOrganizationsData.find(
    (org) => org._id === orgId
  );
  if (!organization || !organization.pending_data) {
    console.error("No pending data found for this organization.");
    return;
  }

  const tableRowsHTML = generateDiffTableHTML(
    organization,
    organization.pending_data
  );

  const modalHTML = `
    <div class="review-modal-overlay" id="reviewModal">
      <div class="review-modal-content">
        <div class="review-modal-header">
          <h3>Review Profile Updates</h3>
          <button class="review-modal-close-btn" onclick="closeReviewModal()">&times;</button>
        </div>
        <div class="review-modal-body">
          <table class="review-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Current Details</th>
                <th>Requested Update</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHTML}
            </tbody>
          </table>
        </div>
        <div class="review-modal-actions">
          <button class="review-btn reject" onclick="rejectUpdates('${orgId}')">Reject</button>
          <button class="review-btn accept" onclick="acceptUpdates('${orgId}')">Accept</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function closeReviewModal() {
  const modal = document.getElementById("reviewModal");
  if (modal) {
    modal.parentNode.removeChild(modal);
  }
}

function acceptUpdates(orgId) {
  const org = allOrganizationsData.find((o) => o._id.$oid === orgId);
  if (!org || !org.pending_data) return;

  const pending = org.pending_data;

  for (const key in pending) {
    if (Object.hasOwnProperty.call(pending, key)) {
      if (key === "adviser" && typeof pending.adviser === "object") {
        if (!org.adviser) org.adviser = {};
        Object.assign(org.adviser, pending.adviser);
      } else {
        org[key] = pending[key];
      }
    }
  }

  org.has_pending_update = false;
  delete org.pending_data;
  delete org.pending_update_description;

  console.log("Updates accepted for:", org.abbreviation);
  closeReviewModal();
  loadOrganizationDetails(orgId);
}

function rejectUpdates(orgId) {
  const org = allOrganizationsData.find((o) => o._id.$oid === orgId);
  if (!org) return;

  org.has_pending_update = false;
  delete org.pending_data;
  delete org.pending_update_description;

  console.log("Updates rejected for:", org.abbreviation);
  closeReviewModal();
  loadOrganizationDetails(orgId);
}

// show confirmation for status toggle
function showConfirmationModal(message, confirmText, confirmClass, onConfirm) {
  closeConfirmationModal();

  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  modalOverlay.id = "confirmationModal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  modalContent.innerHTML = `
    <h4>Confirmation</h4>
    <p>${message}</p>
    <div class="modal-buttons">
      <button class="modal-btn modal-btn-cancel" onclick="closeConfirmationModal()">Cancel</button>
      <button class="modal-btn modal-btn-confirm ${confirmClass}" id="modalConfirmButton">${confirmText}</button>
    </div>
  `;

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  document.getElementById("modalConfirmButton").onclick = function () {
    onConfirm();
    closeConfirmationModal();
  };

  modalOverlay.onclick = function (e) {
    if (e.target === modalOverlay) {
      closeConfirmationModal();
    }
  };
}

// close confirmation modal
function closeConfirmationModal() {
  const modal = document.getElementById("confirmationModal");
  if (modal) {
    modal.parentNode.removeChild(modal);
  }
}

// toggle org status
function promptToggleStatus(orgId) {
  const organization = allOrganizationsData.find(
    (org) => org._id === orgId
  );
  if (!organization) {
    console.error("Cannot toggle status: organization not found.");
    return;
  }

  const isCurrentlyActive = organization.status === "Active";

  if (isCurrentlyActive) {
    showConfirmationModal(
      `Are you sure you want to mark ${organization.abbreviation} as Inactive?`,
      "Mark as Inactive",
      "inactive",
      () => updateStatusToInactive(orgId)
    );
  } else {
    showConfirmationModal(
      `Are you sure you want to mark ${organization.abbreviation} as Active?`,
      "Mark as Active",
      "active",
      () => updateStatusToActive(orgId)
    );
  }
}

// update org status to inactive
function updateStatusToInactive(orgId) {
  const organization = allOrganizationsData.find(
    (org) => org._id === orgId
  );
  if (!organization) return;

  organization.status = "Inactive";
  console.log(`Updated ${organization.abbreviation} status to Inactive.`);

  const statusTag = document.getElementById("organizationStatusTag");
  if (statusTag) {
    statusTag.textContent = "Inactive";
    statusTag.classList.remove("active");
    statusTag.classList.add("pending");
  }
}

// update org status to active
function updateStatusToActive(orgId) {
  const organization = allOrganizationsData.find(
    (org) => org._id === orgId
  );
  if (!organization) return;

  organization.status = "Active";
  console.log(
    `Updated ${organization.abbreviation} status to Active in data store.`
  );

  const statusTag = document.getElementById("organizationStatusTag");
  if (statusTag) {
    statusTag.textContent = "Active";
    statusTag.classList.remove("pending");
    statusTag.classList.add("active");
  }
}

// initialize
async function initOrganizations() {
  if (allOrganizationsData.length === 0) {
    const orgData = await fetchOrganizations();
    if (orgData) {
      allOrganizationsData = orgData;
    } else {
      document.querySelector(
        "#folder-body"
      ).innerHTML = `<div class="folder-content-card"><p style="color: red; text-align: center;">
          Could not load organization data. Please try again later.
        </p></div>`;
      return;
    }
  }

  loadOrganizations(allOrganizationsData);
  populateOrganizationFilters(allOrganizationsData);
  renderOrganizationCards(allOrganizationsData);
  addOrganizationFilterListeners();
}

initOrganizations();
