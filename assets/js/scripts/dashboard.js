import { setFolderTitle, setCurrentDate } from "../components/folder.js";

// dashboard layouts by role
// ---- OSAS Dashboard ----
function loadOsasDashboard() {
  document.querySelector("#folder-body").innerHTML = `
    <div class="grid-container">

      <!-- Summary Cards -->
      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="first">60</p>
            <p class="desc">Total Submissions</p>
          </div>
          <div class="right-icon"> 
            <img src="../../assets/images/blue-submissions-icon.png" alt="Submissions icon" class="card-icon" /> 
          </div>
        </div>
      </div>

      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="second">3</p>
            <p class="desc">Approved</p>
          </div>
          <div class="right-icon"> 
            <img src="../../assets/images/check-icon.png" alt="Submissions icon" class="card-icon" /> 
          </div>
        </div>
      </div>

      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="third">7</p>
            <p class="desc">Pending Review</p>
          </div>
          <div class="right-icon"> 
            <img src="../../assets/images/clock-icon.png" alt="Submissions icon" class="card-icon" /> 
          </div>
        </div>
      </div>

      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="fourth">0</p>
            <p class="desc">Returned</p>
          </div>
          <div class="right-icon"> 
            <img src="../../assets/images/close-icon.png" alt="Submissions icon" class="card-icon" /> 
          </div>
        </div>
      </div>

      <!-- Activities by Term -->
      <div class="grid-item medium">
        <div class="card chart">
          <h3>Activities by Term</h3>
          <img src="../../assets/images/placeholder-graph.png" alt="SDG graph" />
        </div>
      </div>

      <!-- Top 5 SDGs -->
      <div class="grid-item medium">
        <div class="card chart">
          <h3>Top SDGs</h3>
          <img src="../../assets/images/placeholder-graph-2.png" alt="SDG graph" />
        </div>
      </div>

    </div>
  `;
}

// ---- ADMIN ----
function loadAdminDashboard() {
  document.querySelector("#folder-body").innerHTML = `
    <div class="grid-container">

        <!-- Small cards -->
      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="first">1,200</p>
            <p class="desc">Total Deliverables Submitted</p>
          </div>
          <div class="right-icon">
            <img src="../../assets/images/close-icon.png" alt="Submissions icon" class="card-icon" />
          </div>
        </div>
      </div>

      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="second">45</p>
            <p class="desc">Approved Deliverables</p>
          </div>
          <div class="right-icon">
            <img src="../../assets/images/close-icon.png" alt="Submissions icon" class="card-icon" />
          </div>
        </div>
      </div>

      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="third">45</p>
            <p class="desc">Returned Deliverables</p>
          </div>
          <div class="right-icon">
            <img src="../../assets/images/close-icon.png" alt="Submissions icon" class="card-icon" />
          </div>
        </div>
      </div>

      <div class="grid-item small">
        <div class="card">
          <div class="left-details">
            <p class="number" id="fourth">7</p>
            <p class="desc">Organizations Recognized</p>
          </div>
          <div class="right-icon">
            <img src="../../assets/images/close-icon.png" alt="Submissions icon" class="card-icon" />
          </div>
        </div>
      </div>
      
      <!-- Activities by Term -->
      <div class="grid-item medium">
        <div class="card chart">
          <h3>Activities by Term</h3>
          <img src="../../assets/images/placeholder-graph.png" alt="SDG graph" />
        </div>
      </div>

            <!-- Top 5 SDGs -->
      <div class="grid-item medium">
        <div class="card chart">
          <h3>Top SDGs</h3>
          <img src="../../assets/images/placeholder-graph-2.png" alt="SDG graph" />
        </div>
      </div>
    </div>
  `;
}

// ---- USER (Student Org) ----
function loadUserDashboard() {
  document.querySelector("#folder-body").innerHTML = `
    <div class="org-dashboard">

      <!-- Quick Actions + Submission Overview -->
      <div class="top-section">
        <div class="quick-actions card">
          <h3>Quick Actions</h3>
          <button class="create-btn">+ Create New Activity</button>
          <a href="#" class="view-link">View my Activities</a>
        </div>

        <div class="submission-overview card">
          <h3>Submission Status Overview</h3>
          <div class="status-container">
            <div class="status-item">
              <p class="status-title approved">Approved</p>
              <p class="status-count">3</p>
              <div class="progress-bar approved"></div>
            </div>
            <div class="status-item">
              <p class="status-title review">Under Review</p>
              <p class="status-count">3</p>
              <div class="progress-bar review"></div>
            </div>
            <div class="status-item">
              <p class="status-title attention">Needs Attention</p>
              <p class="status-count">3</p>
              <div class="progress-bar attention"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section: Activities + Deadlines -->
      <div class="bottom-section">
        <div class="recent-activities card">
          <div class="section-header">
            <h3>Recent Activities</h3>
            <a href="#" class="view-all">View all</a>
          </div>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-details">
                <p class="activity-title">Annual Report Submission</p>
                <p class="activity-desc">A short description of what is being done</p>
              </div>
              <span class="status-badge approved">Approved</span>
            </div>

            <div class="activity-item">
              <div class="activity-details">
                <p class="activity-title">Annual Report Submission</p>
                <p class="activity-desc">A short description of what is being done</p>
              </div>
              <span class="status-badge review">Under Review</span>
            </div>

            <div class="activity-item">
              <div class="activity-details">
                <p class="activity-title">Annual Report Submission</p>
                <p class="activity-desc">A short description of what is being done</p>
              </div>
              <span class="status-badge attention">Needs Attention</span>
            </div>
          </div>
        </div>

        <div class="reminders card">
          <h3>Reminders & Deadlines</h3>
          <div class="reminder-item">
            <p class="reminder-title">Annual Report Submission</p>
            <p class="reminder-date orange">Due: Oct 31, 2025</p>
          </div>
          <div class="reminder-item">
            <p class="reminder-title">Annual Report Submission</p>
            <p class="reminder-date blue">Due: Oct 31, 2025</p>
          </div>
        </div>
      </div>
    </div>
  `;
}


// main dashboard initializer
function initDashboard() {
  setFolderTitle("Dashboard");
  setCurrentDate();

  const sidebar = document.querySelector("#sidebar");
  const role = sidebar?.getAttribute("data-role") || "default";

  if (role === "osas") {
    loadOsasDashboard();
  } else if (role === "admin") {
    loadAdminDashboard();
  } else {
    loadUserDashboard();
  }
}

initDashboard();
