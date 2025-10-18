function loadActivitiesModule() {
  document.querySelector("#folder-body").innerHTML = `
    <div class="folder-content-card">
      <div class="user-management-container">

        <!-- Filter & Search Section -->
        <div class="filter-search">
          <h2>Filter & Search</h2>
          <div class="filters-row">
            <div class="search-box">
              <label>Search Users</label>
              <div class="input-icon">
                <input type="text" placeholder="Search users by keyword" />
                <button class="search-btn">
                  <img src="../../assets/images/review-icon.png" alt="Search" />
                </button>
              </div>
            </div>

            <div class="select-group">
              <label>Status</label>
              <select>
                <option>All Status</option>
                <option>Suspended</option>
                <option>Active</option>
              </select>
            </div>

            <div class="select-group">
              <label for="organization">Organization</label>
              <input
                type="text"
                id="organization"
                name="organization"
                placeholder="Type organization name..."
                list="organization-list"
              />
              <datalist id="organization-list">
                <option value="All Organization"></option>
                <option value="Integrated Confederacy"></option>
              </datalist>
            </div>


            <div class="select-group">
              <label for="date-created">Date Created</label>
              <input type="date" id="date-created" name="date-created" />
            </div>

            <button class="generate-btn">
              <img src="../../assets/images/submissions-icon.png" alt="Generate Report" />
              Generate Reports
            </button>
          </div>
        </div>

        <!-- Table Section -->
        <div class="activities-table">
          <table>
            <thead>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Organization</th>
                <th>Status</th>
                <th>Date Registered</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p class="user-email">224xxxx</p>
                </td>
                <td>Anjelo Esperanzate</td>
                <td>224xxxx@slu.edu.ph</td>
                <td>Vice Table</td>
                <td>Integrated Confederacy</td>
                <td>Active</td>
                <td>11-12-2025</td>
                <td>10-17-2025</td>
                <td><button class="review-btn"><img src="../../assets/images/submissions-icon.png" alt="" class="btn-icon">Review</button></td>
              </tr>
              
              <tr>
                <td>
                  <p class="user-email">224xxxx</p>
                </td>
                <td>Anjelo Esperanzate</td>
                <td>224xxxx@slu.edu.ph</td>
                <td>Vice Table</td>
                <td>Integrated Confederacy</td>
                <td>Active</td>
                <td>11-12-2025</td>
                <td>10-17-2025</td>
                <td><button class="review-btn"><img src="../../assets/images/submissions-icon.png" alt="" class="btn-icon">Review</button></td>
              </tr>

              <tr>
                <td>
                  <p class="user-email">224xxxx</p>
                </td>
                <td>Anjelo Esperanzate</td>
                <td>224xxxx@slu.edu.ph</td>
                <td>Vice Table</td>
                <td>Integrated Confederacy</td>
                <td>Active</td>
                <td>11-12-2025</td>
                <td>10-17-2025</td>
                <td><button class="review-btn"><img src="../../assets/images/submissions-icon.png" alt="" class="btn-icon">Review</button></td>
              </tr>

              <tr>
                <td>
                  <p class="user-email">224xxxx</p>
                </td>
                <td>Anjelo Esperanzate</td>
                <td>224xxxx@slu.edu.ph</td>
                <td>Vice Table</td>
                <td>Integrated Confederacy</td>
                <td>Active</td>
                <td>11-12-2025</td>
                <td>10-17-2025</td>
                <td><button class="review-btn"><img src="../../assets/images/submissions-icon.png" alt="" class="btn-icon">Review</button></td>
              </tr>

              <tr>
                <td>
                  <p class="user-email">224xxxx</p>
                </td>
                <td>Anjelo Esperanzate</td>
                <td>224xxxx@slu.edu.ph</td>
                <td>Vice Table</td>
                <td>Integrated Confederacy</td>
                <td>Active</td>
                <td>11-12-2025</td>
                <td>10-17-2025</td>
                <td><button class="review-btn"><img src="../../assets/images/submissions-icon.png" alt="" class="btn-icon">Review</button></td>
              </tr>

              <tr>
                <td>
                  <p class="user-email">224xxxx</p>
                </td>
                <td>Anjelo Esperanzate</td>
                <td>224xxxx@slu.edu.ph</td>
                <td>Vice Table</td>
                <td>Integrated Confederacy</td>
                <td>Active</td>
                <td>11-12-2025</td>
                <td>10-17-2025</td>
                <td><button class="review-btn"><img src="../../assets/images/submissions-icon.png" alt="" class="btn-icon">Review</button></td>
              </tr>

              <tr>
                <td>
                  <p class="user-email">224xxxx</p>
                </td>
                <td>Anjelo Esperanzate</td>
                <td>224xxxx@slu.edu.ph</td>
                <td>Vice Table</td>
                <td>Integrated Confederacy</td>
                <td>Active</td>
                <td>11-12-2025</td>
                <td>10-17-2025</td>
                <td><button class="review-btn"><img src="../../assets/images/submissions-icon.png" alt="" class="btn-icon">Review</button></td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function initActivities() {
  loadActivitiesModule();
}

initActivities();
