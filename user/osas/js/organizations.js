function loadOrganizations() {
  document.querySelector("#folder-body").innerHTML = `
    <div class="folder-content-card">
      <div class="organizations-layout">
        <div class="summary-column">
          
          <div class="summary-card total">
            <img src="../../../assets/images/organizations-icon.png" alt="" class="summary-card-bg-icon" />
            <div class="summary-card-info">
              <h3>11</h3>
              <p>Total Organizations</p>
            </div>
          </div>
          
          <div class="summary-card active">
            <img src="../../../assets/images/organizations-icon.png" alt="" class="summary-card-bg-icon" />
            <div class="summary-card-info">
              <h3>10</h3>
              <p>Active Organizations</p>
            </div>
          </div>

          <div class="summary-card pending">
            <img src="../../../assets/images/organizations-icon.png" alt="" class="summary-card-bg-icon" />
            <div class="summary-card-info">
              <h3>1</h3>
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
                  <button class="search-btn">
                    <img src="../../../assets/images/review-icon.png" alt="Search" />
                  </button>
                </div>
              </div>

              <div class="select-group">
                <label for="departmentFilter">School/Department</label>
                <select id="departmentFilter">
                  <option>All Departments</option>
                  </select>
              </div>

              <div class="select-group">
                <label for="typeFilter">Type</label>
                <select id="typeFilter">
                  <option>All Types</option>
                  </select>
              </div>

              <div class="select-group">
                <label for="statusFilter">Status</label>
                <select id="statusFilter">
                  <option>All Statuses</option>
                  </select>
              </div>
            </div>
          </div>

          <div class="organization-cards-grid" id="organizationCardsGrid">
            
            <div class="organization-card">
              <div class="organization-identifier">
                <div class="organization-logo">
                  <img src="../../../assets/images/schema-logo.png" alt="SCHEMA logo" />
                </div>
                <p class="organization-acronym">SCHEMA</p>
              </div>
              <div class="organization-details">
                <h3>SCHEMA</h3>
                <p>Department: <strong>SAMCIS</strong></p>
                <p>Type: <strong>Publication</strong></p>
                <p>Adviser: <strong>Prof. Name Name</strong></p>
                <span class="status-tag active">Active</span>
                <img src="../../../assets/images/arrow-up-right.png" alt="View" class="card-link-icon" onclick="loadOrganizationDetails()" />
              </div>
            </div>

            <div class="organization-card">
              <div class="organization-identifier">
                <div class="organization-logo">
                  <img src="../../../assets/images/rpg-logo.png" alt="Rated Production Guild logo" />
                </div>
                <p class="organization-acronym">RPG</p>
              </div>
              <div class="organization-details">
                <h3>Rated Production Guild</h3>
                <p>Department: <strong>SAMCIS</strong></p>
                <p>Type: <strong>Extra-Curricular</strong></p>
                <p>Adviser: <strong>Prof. Name Name</strong></p>
                <span class="status-tag pending">Inactive</span>
                <img src="../../../assets/images/arrow-up-right.png" alt="View" class="card-link-icon" onclick="loadOrganizationDetails()" />
              </div>
            </div>

            <div class="organization-card">
              <div class="organization-identifier">
                <div class="organization-logo">
                  <img src="../../../assets/images/rpg-logo.png" alt="Rated Production Guild logo" />
                </div>
                <p class="organization-acronym">RPG</p>
              </div>
              <div class="organization-details">
                <h3>Rated Production Guild</h3>
                <p>Department: <strong>SAMCIS</strong></p>
                <p>Type: <strong>Extra-Curricular</strong></p>
                <p>Adviser: <strong>Prof. Name Name</strong></p>
                <span class="status-tag active">Active</span>
                <img src="../../../assets/images/arrow-up-right.png" alt="View" class="card-link-icon" onclick="loadOrganizationDetails()" />
              </div>
            </div>

            <div class="organization-card">
              <div class="organization-identifier">
                <div class="organization-logo">
                  <img src="../../../assets/images/schema-logo.png" alt="SCHEMA logo" />
                </div>
                <p class="organization-acronym">SCHEMA</p>
              </div>
              <div class="organization-details">
                <h3>SCHEMA</h3>
                <p>Department: <strong>SAMCIS</strong></p>
                <p>Type: <strong>Publication</strong></p>
                <p>Adviser: <strong>Prof. Name Name</strong></p>
                <span class="status-tag active">Active</span>
                <img src="../../../assets/images/arrow-up-right.png" alt="View" class="card-link-icon" onclick="loadOrganizationDetails()" />
              </div>
            </div>

            <div class="organization-card">
              <div class="organization-identifier">
                <div class="organization-logo">
                  <img src="../../../assets/images/rpg-logo.png" alt="Rated Production Guild logo" />
                </div>
                <p class="organization-acronym">RPG</p>
              </div>
              <div class="organization-details">
                <h3>Rated Production Guild</h3>
                <p>Department: <strong>SAMCIS</strong></p>
                <p>Type: <strong>Extra-Curricular</strong></p>
                <p>Adviser: <strong>Prof. Name Name</strong></p>
                <span class="status-tag pending">Inactive</span>
                <img src="../../../assets/images/arrow-up-right.png" alt="View" class="card-link-icon" onclick="loadOrganizationDetails()" />
              </div>
            </div>

            <div class="organization-card">
              <div class="organization-identifier">
                <div class="organization-logo">
                  <img src="../../../assets/images/rpg-logo.png" alt="Rated Production Guild logo" />
                </div>
                <p class="organization-acronym">RPG</p>
              </div>
              <div class="organization-details">
                <h3>Rated Production Guild</h3>
                <p>Department: <strong>SAMCIS</strong></p>
                <p>Type: <strong>Extra-Curricular</strong></p>
                <p>Adviser: <strong>Prof. Name Name</strong></p>
                <span class="status-tag active">Active</span>
                <img src="../../../assets/images/arrow-up-right.png" alt="View" class="card-link-icon" onclick="loadOrganizationDetails()" />
              </div>
            </div>

            <div class="organization-card">
              <div class="organization-identifier">
                <div class="organization-logo">
                  <img src="../../../assets/images/schema-logo.png" alt="SCHEMA logo" />
                </div>
                <p class="organization-acronym">SCHEMA</p>
              </div>
              <div class="organization-details">
                <h3>SCHEMA</h3>
                <p>Department: <strong>SAMCIS</strong></p>
                <p>Type: <strong>Publication</strong></p>
                <p>Adviser: <strong>Prof. Name Name</strong></p>
                <span class="status-tag active">Active</span>
                <img src="../../../assets/images/arrow-up-right.png" alt="View" class="card-link-icon" onclick="loadOrganizationDetails()" />
              </div>
            </div>
            <div class="organization-card">
              <div class="organization-identifier">
                <div class="organization-logo">
                  <img src="../../../assets/images/rpg-logo.png" alt="Rated Production Guild logo" />
                </div>
                <p class="organization-acronym">RPG</p>
              </div>
              <div class="organization-details">
                <h3>Rated Production Guild</h3>
                <p>Department: <strong>SAMCIS</strong></p>
                <p>Type: <strong>Extra-Curricular</strong></p>
                <p>Adviser: <strong>Prof. Name Name</strong></p>
                <span class="status-tag pending">Inactive</span>
                <img src="../../../assets/images/arrow-up-right.png" alt="View" class="card-link-icon" onclick="loadOrganizationDetails()" />
              </div>
            </div>
             <div class="organization-card">
              <div class="organization-identifier">
                <div class="organization-logo">
                  <img src="../../../assets/images/rpg-logo.png" alt="Rated Production Guild logo" />
                </div>
                <p class="organization-acronym">RPG</p>
              </div>
              <div class="organization-details">
                <h3>Rated Production Guild</h3>
                <p>Department: <strong>SAMCIS</strong></p>
                <p>Type: <strong>Extra-Curricular</strong></p>
                <p>Adviser: <strong>Prof. Name Name</strong></p>
                <span class="status-tag active">Active</span>
                <img src="../../../assets/images/arrow-up-right.png" alt="View" class="card-link-icon" onclick="loadOrganizationDetails()" />
              </div>
            </div>
             <div class="organization-card">
              <div class="organization-identifier">
                <div class="organization-logo">
                  <img src="../../../assets/images/rpg-logo.png" alt="Rated Production Guild logo" />
                </div>
                <p class="organization-acronym">RPG</p>
              </div>
              <div class="organization-details">
                <h3>Rated Production Guild</h3>
                <p>Department: <strong>SAMCIS</strong></p>
                <p>Type: <strong>Extra-Curricular</strong></p>
                <p>Adviser: <strong>Prof. Name Name</strong></p>
                <span class="status-tag active">Active</span>
                <img src="../../../assets/images/arrow-up-right.png" alt="View" class="card-link-icon" onclick="loadOrganizationDetails()" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function loadOrganizationDetails() {
  document.querySelector("#folder-body").innerHTML = `
    <div class="folder-content-card">
      <div class="organization-detail-layout">
        
        <div class="detail-main-column">
          <button class="back-btn" onclick="loadOrganizations()">
            <img src="../../../assets/images/arrow-left-circle.png" alt="Back" />
          </button>
          
          <div class="detail-inner-layout">
            
            <div class="detail-header">
              <div class="detail-logo">
                <img src="../../../assets/images/schema-logo.png" alt="SCHEMA logo" />
              </div>
              <div class="detail-title">
                <h1>SCHEMA</h1>
                <span id="organizationStatusTag" class="status-tag active" onclick="promptToggleStatus()">Active</span>
              </div>
            </div>

            <div class="detail-content">
              <p class="description">
                Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              
              <div class="detail-info-list">
                <p><strong>Name or Organization:</strong> <span>SCHEMA</span></p>
                <p><strong>Acronym/Short Name:</strong> <span>SCHEMA</span></p>
                <p><strong>Department:</strong> <span>School of Accountancy, Management, Computing and Information Studies | SAMCIS</span></p>
                <p><strong>Official SLU Institution Email:</strong> <span>schema@slu.edu.ph</span></p>
                <p><strong>Type of Organization:</strong> <span>Publication</span></p>
                <p><strong>Name of Adviser:</strong> <span>Ms. Prof Name</span></p>
                <p><strong>Date Created:</strong> <span>August 26, 2025</span></p>
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
                <span>Montes, Prague</span>
                <span class="date">August 10, 2025</span>
              </li>
              <li>
                <img src="../../../assets/images/blue-submissions-icon.png" alt="doc" />
                <span>Prague, Montes</span>
                <span class="date">August 10, 2025</span>
              </li>
              <li>
                <img src="../../../assets/images/blue-submissions-icon.png" alt="doc" />
                <span>Prague, Montes</span>
                <span class="date">August 10, 2025</span>
              </li>
              <li>
                <img src="../../../assets/images/blue-submissions-icon.png" alt="doc" />
                <span>Prague, Montes</span>
                <span class="date">August 10, 2025</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  `;
}

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

function closeConfirmationModal() {
  const modal = document.getElementById("confirmationModal");
  if (modal) {
    modal.parentNode.removeChild(modal);
  }
}

function promptToggleStatus() {
  const statusTag = document.getElementById("organizationStatusTag");
  const isCurrentlyActive = statusTag.classList.contains("active");

  if (isCurrentlyActive) {
    showConfirmationModal(
      "Are you sure you want to mark SCHEMA as Inactive?",
      "Mark as Inactive",
      "inactive",
      updateStatusToInactive
    );
  } else {
    showConfirmationModal(
      "Are you sure you want to mark SCHEMA as Active?",
      "Mark as Active",
      "active",
      updateStatusToActive
    );
  }
}

function updateStatusToInactive() {
  const statusTag = document.getElementById("organizationStatusTag");
  if (statusTag) {
    statusTag.textContent = "Inactive";
    statusTag.classList.remove("active");
    statusTag.classList.add("pending"); 
  }
}

function updateStatusToActive() {
  const statusTag = document.getElementById("organizationStatusTag");
  if (statusTag) {
    statusTag.textContent = "Active";
    statusTag.classList.remove("pending");
    statusTag.classList.add("active");
  }
}

function initOrganizations() {
  loadOrganizations();
}

initOrganizations();