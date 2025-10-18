import { setCurrentDate } from "../components/folder.js";

function loadActivities() {
  document.querySelector("#folder-body").innerHTML = `
    <div class="folder-content-card">
      <div class="activities-container">

        <!-- Filter & Search Section -->
        <div class="filter-search">
          <h2>Filter & Search</h2>
          <div class="filters-row">
            <div class="search-box">
              <label>Search Activities</label>
              <div class="input-icon">
                <input type="text" placeholder="Search activities by keyword" />
                <button class="search-btn">
                  <img src="../../assets/images/review-icon.png" alt="Search" />
                </button>
              </div>
            </div>

            <div class="select-group">
              <label>Status</label>
              <select>
                <option>All Status</option>
                <option>Approved</option>
                <option>Pending</option>
                <option>Returned</option>
              </select>
            </div>

            <div class="select-group">
              <label>Organization</label>
              <select>
                <option>All Organization</option>
                <option>Integrated Confederacy</option>
              </select>
            </div>

            <div class="select-group">
              <label>SDGs</label>
              <select>
                <option>All SDGs</option>
                <option>SDG 4</option>
                <option>SDG 7</option>
                <option>SDG 8</option>
              </select>
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
              <tr>
                <th>Activity Name</th>
                <th>Organization</th>
                <th>SDGs</th>
                <th>Term</th>
                <th>Status</th>
                <th>Submission Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p class="activity-name">Montes Progue</p>
                  <p class="activity-desc">Short description</p>
                </td>
                <td>Integrated Confederacy</td>
                <td><span class="sdg sdg-4">SDG 4</span></td>
                <td>First Sem</td>
                <td><span class="status approved">Approved</span></td>
                <td>2025-10-14, 14:00</td>
                <td><button class="review-btn"><img src="../../assets/images/submissions-icon.png" alt="" class="btn-icon"> Activity Review</button></td>
              </tr>
              <tr>
                <td>
                  <p class="activity-name">Montes Progue</p>
                  <p class="activity-desc">Short description</p>
                </td>
                <td>Integrated Confederacy</td>
                <td><span class="sdg sdg-8">SDG 8</span></td>
                <td>First Sem</td>
                <td><span class="status pending">Pending</span></td>
                <td>2025-10-14, 14:00</td>
                <td><button class="review-btn"><img src="../../assets/images/submissions-icon.png" alt="" class="btn-icon"> Activity Review</button></td>
              </tr>
              <tr>
                <td>
                  <p class="activity-name">Montes Progue</p>
                  <p class="activity-desc">Short description</p>
                </td>
                <td>Integrated Confederacy</td>
                <td><span class="sdg sdg-7">SDG 7</span></td>
                <td>First Sem</td>
                <td><span class="status returned">Returned</span></td>
                <td>2025-10-14, 14:00</td>
                <td><button class="review-btn"><img src="../../assets/images/submissions-icon.png" alt="" class="btn-icon"> Activity Review</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function initActivities() {
  setCurrentDate();
  loadActivities();
}

initActivities();
