// ---- CONSTANTS ----
const ICON_ORG_ID = "6716001a9b8c2001abcd0001";

// ---- FETCH ACTIVITIES ----
async function fetchActivities() {
  try {
    const response = await fetch("../../../data/activities.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Could not fetch activities data:", error);
    return null;
  }
}

// ---- FILTER ICON ACTIVITIES ----
function filterIconActivities(activities) {
  if (!activities) return [];
  return activities.filter(activity => {
    const orgId = activity.org_id?.$oid || activity.org_id;
    return orgId === ICON_ORG_ID;
  });
}

// ---- COUNT STATUS ----
function countByStatus(activities) {
  const counts = {
    "Approved": 0,
    "Pending": 0,
    "Revise": 0
  };

  activities.forEach(activity => {
    if (counts.hasOwnProperty(activity.status)) {
      counts[activity.status]++;
    }
  });

  return counts;
}

// ---- GENERATE STATUS BADGE CLASS ----
function getStatusBadgeClass(status) {
  if (status === "Approved") return "approved";
  if (status === "Pending") return "review";
  if (status === "Revise") return "attention";
  return "";
}

// ---- ORG Dashboard ----
async function loadUserDashboard() {
  // Fetch activities
  const allActivities = await fetchActivities();
  const iconActivities = filterIconActivities(allActivities);
  const statusCounts = countByStatus(iconActivities);

  // Filter activities for "Revise" (for reminders)
  const needsAttentionActivities = iconActivities.filter(activity => activity.status === "Revise");

  // Generate recent activities HTML
  let recentActivitiesHTML = '';
  iconActivities.forEach(activity => {
    const statusClass = getStatusBadgeClass(activity.status);
    recentActivitiesHTML += `
      <div class="activity-item">
        <div class="activity-details">
          <p class="activity-title">${activity.title}</p>
          <p class="activity-desc">${activity.description}</p>
        </div>
        <span class="status-badge ${statusClass}">${activity.status}</span>
      </div>
    `;
  });

  // Generate reminders HTML (only "Revise" activities)
  let remindersHTML = '';
  if (needsAttentionActivities.length > 0) {
    needsAttentionActivities.forEach(activity => {
      const remarks = activity.remarks || "No remarks";
      remindersHTML += `
        <div class="reminder-item">
          <p class="reminder-title">${activity.title}</p>
          <p class="reminder-remarks">${remarks}</p>
        </div>
      `;
    });
  } else {
    remindersHTML = '<p class="no-reminders">No activities need revision at this time.</p>';
  }

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
              <p class="status-count">${statusCounts["Approved"]}</p>
              <div class="progress-bar approved"></div>
            </div>
            <div class="status-item">
              <p class="status-title review">Pending</p>
              <p class="status-count">${statusCounts["Pending"]}</p>
              <div class="progress-bar review"></div>
            </div>
            <div class="status-item">
              <p class="status-title attention">Revise</p>
              <p class="status-count">${statusCounts["Revise"]}</p>
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
            ${recentActivitiesHTML}
          </div>
        </div>

        <div class="reminders card">
          <h3>To Be Revised</h3>
          ${remindersHTML}
        </div>
      </div>
    </div>
  `;
}

// ---- INITIALIZER ----
async function initDashboard() {
  await loadUserDashboard();

  // Wire quick action buttons after rendering
  const folder = document.querySelector('#folder-body');
  if (folder) {
    const createBtn = folder.querySelector('.create-btn');
    const viewLink = folder.querySelector('.view-link');
    const viewAllLink = folder.querySelector('.view-all');
    if (createBtn) createBtn.addEventListener('click', () => { window.location.href = 'submit-activity.html'; });
    if (viewLink) viewLink.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'my-activities.html'; });
    if (viewAllLink) viewAllLink.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'my-activities.html'; });
  }
}

initDashboard();