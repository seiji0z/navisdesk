let allOrganizationsData = [];

function createOrganizationCardHTML(org) {
  const statusClass = org.status.toLowerCase() === 'active' ? 'active' : 'pending';
  const statusText = org.status.charAt(0).toUpperCase() + org.status.slice(1).toLowerCase();
  const adviserName = org.adviser.name || 'Not Specified';
  const logoSrc = org.profile_pic || '../../../assets/images/schema-logo.png'; 

  return `
    <div class="organization-card" onclick="loadOrganizationDetails('${org._id.$oid}')">
      <div class="organization-identifier">
        <div class="organization-logo">
          <img src="${logoSrc}" alt="${org.abbreviation} logo" />
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
  const activeOrgs = organizations.filter(org => org.status === 'Active').length;
  const inactiveOrgs = totalOrgs - activeOrgs;

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
  const departments = [...new Set(organizations.map(org => org.department))].sort();
  const types = [...new Set(organizations.map(org => org.type))].sort();
  const statuses = [...new Set(organizations.map(org => org.status))].sort();

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
    grid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">No organizations match the current filters.</p>';
    return;
  }

  const organizationCardsHTML = organizations.map(createOrganizationCardHTML).join('');
  grid.innerHTML = organizationCardsHTML;
}

// fetch the organizations
async function fetchOrganizations() {
  try {
    const response = await fetch("../../../data/student_organizations.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Could not fetch organizations data:", error);
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

  // get filter values
  const searchTerm = document.getElementById("searchOrganization")?.value.toLowerCase().trim() || "";
  const departmentFilter = document.getElementById("departmentFilter")?.value || "";
  const typeFilter = document.getElementById("typeFilter")?.value || "";
  const statusFilter = document.getElementById("statusFilter")?.value || "";

  // filter the data
  const filteredOrganizations = allOrganizationsData.filter((org) => {
    // search logic
    const matchesSearch =
      !searchTerm ||
      org.name.toLowerCase().includes(searchTerm) ||
      org.abbreviation.toLowerCase().includes(searchTerm) ||
      org.department.toLowerCase().includes(searchTerm) || 
      org.adviser.name.toLowerCase().includes(searchTerm); 

    // filter logic
    const matchesDepartment = !departmentFilter || org.department === departmentFilter;
    const matchesType = !typeFilter || org.type === typeFilter;
    const matchesStatus = !statusFilter || org.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesType && matchesStatus;
  });

  // render the cards with filtered data
  renderOrganizationCards(filteredOrganizations);
}


// render the details page
function loadOrganizationDetails(orgId) {
  console.log("Loading details for organization ID:", orgId);
  
  const organization = allOrganizationsData.find(org => org._id.$oid === orgId);

  if (!organization) {
    console.error("Organization not found!");
    document.querySelector("#folder-body").innerHTML = `<p>Error: Organization not found.</p>`;
    return;
  }
  
  const statusClass = organization.status.toLowerCase() === 'active' ? 'active' : 'pending';
  const statusText = organization.status.charAt(0).toUpperCase() + organization.status.slice(1).toLowerCase();
  const logoSrc = organization.profile_pic || '../../../assets/images/schema-logo.png'; // temporary image
  const description = organization.description || 'No description provided for this organization.';
  const adviserName = organization.adviser.name || 'Not Specified';
  
  const createdDate = new Date(organization.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  document.querySelector("#folder-body").innerHTML = `
    <div class="folder-content-card">
      <div class="organization-detail-layout">
        
        <div class="detail-main-column">
          <button class="back-button" onclick="initOrganizations()">
            Back to Organizations
          </button>
          
          <div class="detail-inner-layout">
            
            <div class="detail-header">
              <div class="detail-logo">
                <img src="${logoSrc}" alt="${organization.abbreviation} logo" />
              </div>
              <div class="detail-title">
                <h1>${organization.name}</h1>
                <span id="organizationStatusTag" class="status-tag ${statusClass}" 
                      onclick="promptToggleStatus('${organization._id.$oid}')">${statusText}</span>
              </div>
            </div>

            <div class="detail-content">
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

// show confirmation
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

  document.getElementById("modalConfirmButton").onclick = function() {
    onConfirm();
    closeConfirmationModal();
  };

  modalOverlay.onclick = function(e) {
    if (e.target === modalOverlay) {
      closeConfirmationModal();
    }
  };
}

// close modal
function closeConfirmationModal() {
  const modal = document.getElementById("confirmationModal");
  if (modal) {
    modal.parentNode.removeChild(modal);
  }
}

// toggle org status
function promptToggleStatus(orgId) {
  const organization = allOrganizationsData.find(org => org._id.$oid === orgId);
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
  const organization = allOrganizationsData.find(org => org._id.$oid === orgId);
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
  const organization = allOrganizationsData.find(org => org._id.$oid === orgId);
  if (!organization) return;
  
  organization.status = "Active";
  console.log(`Updated ${organization.abbreviation} status to Active in data store.`);

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
      document.querySelector("#folder-body").innerHTML = 
        `<div class="folder-content-card"><p style="color: red; text-align: center;">
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