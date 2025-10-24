// ---- ORG Dashboard ----
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
              <p class="status-count">2</p>
              <div class="progress-bar review"></div>
            </div>
            <div class="status-item">
              <p class="status-title attention">Needs Attention</p>
              <p class="status-count">4</p>
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

// ---- INITIALIZER ----
function initDashboard() {
  loadUserDashboard();

  // Wire quick action buttons after rendering
  const folder = document.querySelector('#folder-body');
  if (folder) {
    const createBtn = folder.querySelector('.create-btn');
    const viewLink = folder.querySelector('.view-link');
    if (createBtn) createBtn.addEventListener('click', () => { window.location.href = 'submit-activity.html'; });
    if (viewLink) viewLink.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'my-activities.html'; });
  }
}

initDashboard();