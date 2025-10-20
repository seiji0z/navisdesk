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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initOrganizations() {
  loadOrganizations();
}

initOrganizations();