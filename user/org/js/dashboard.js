// ===============================
// ORGANIZATION DASHBOARD
// ===============================

const ICON_ORG_ID = "6716001a9b8c2001abcd0001";
let activitiesData = [];

// Fetch activities data
async function fetchActivities() {
  try {
    const response = await fetch("../../../data/activities.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    activitiesData = await response.json();
    return activitiesData;
  } catch (error) {
    console.error("Could not fetch activities data:", error);
    return [];
  }
}

// --- MAIN RENDER FUNCTION ---
async function renderOrgDashboard() {
  const folderBody = document.querySelector("#folder-body");
  if (!folderBody) return;

  await fetchActivities();

  folderBody.innerHTML = `
    <div class="org-dashboard">
      <!-- Top Section -->
      <div class="top-section">
        ${createQuickActions()}
        ${createSubmissionOverview()}
      </div>

      <!-- Bottom Section -->
      <div class="bottom-section">
        ${createRecentActivities()}
        ${createReminders()}
      </div>
    </div>
  `;

  setupDashboardInteractions();
  animateProgressBars();
}

// ===============================
// SECTION TEMPLATES
// ===============================

function createQuickActions() {
  return `
    <div class="quick-actions card">
      <h3>Quick Actions</h3>
      <button class="create-btn">+ Create New Activity</button>
      <a href="#" class="view-link">View my Activities</a>
    </div>
  `;
}

function createSubmissionOverview() {
  // Filter activities for ICON org
  const iconActivities = activitiesData.filter(
    (a) => a.org_id.$oid === ICON_ORG_ID
  );

  // Count activities by status
  const approvedCount = iconActivities.filter(
    (a) => a.status === "Approved"
  ).length;
  const pendingCount = iconActivities.filter(
    (a) => a.status === "Pending"
  ).length;
  const reviseCount = iconActivities.filter(
    (a) => a.status === "Revise"
  ).length;

  const statuses = [
    { title: "Approved", count: approvedCount, class: "approved" },
    { title: "Pending", count: pendingCount, class: "review" },
    { title: "Revise", count: reviseCount, class: "attention" },
  ];

  const statusItems = statuses
    .map(
      (s) => `
        <div class="status-item">
          <p class="status-title ${s.class}">${s.title}</p>
          <p class="status-count">${s.count}</p>
          <div class="progress-bar ${s.class}" data-value="${s.count}"></div>
        </div>`
    )
    .join("");

  return `
    <div class="submission-overview card">
      <h3>Submission Status Overview</h3>
      <div class="status-container">${statusItems}</div>
    </div>
  `;
}

function createRecentActivities() {
  // Filter activities for ICON org and limit to 3
  const iconActivities = activitiesData
    .filter((a) => a.org_id.$oid === ICON_ORG_ID)
    .slice(0, 3);

  const activityItems = iconActivities
    .map(
      (a) => `
        <div class="activity-item">
          <div class="activity-details">
            <p class="activity-title">${a.title}</p>
            <p class="activity-desc">${a.description}</p>
          </div>
          <span class="status-badge ${formatStatusClass(
        a.status
      )}">${formatStatus(a.status)}</span>
        </div>`
    )
    .join("");

  return `
    <div class="recent-activities card">
      <div class="section-header">
        <h3>Recent Activities</h3>
        <a href="my-activities.html" class="view-all">View all</a>
      </div>
      <div class="activity-list">${activityItems}</div>
    </div>
  `;
}

function createReminders() {
  // Filter activities for ICON org with status "Revise"
  const reviseActivities = activitiesData.filter(
    (a) => a.org_id.$oid === ICON_ORG_ID && a.status === "Revise"
  );

  const reminderItems = reviseActivities
    .map(
      (r) => `
        <div class="reminder-item">
          <p class="reminder-title">${r.title}</p>
          <p class="reminder-date">Remarks: ${r.remarks || "None"}</p>
        </div>`
    )
    .join("");

  return `
    <div class="reminders card">
      <h3>To Be Revised</h3>
      ${reminderItems}
    </div>
  `;
}

// ===============================
// HELPER FUNCTIONS
// ===============================

function formatStatus(status) {
  switch (status) {
    case "Approved":
      return "Approved";
    case "Pending":
      return "Pending";
    case "Revise":
      return "Revise";
    default:
      return status;
  }
}

function formatStatusClass(status) {
  switch (status) {
    case "Approved":
      return "approved";
    case "Pending":
      return "review";
    case "Revise":
      return "attention";
    default:
      return status.toLowerCase();
  }
}

function setupDashboardInteractions() {
  const folder = document.querySelector("#folder-body");
  if (!folder) return;

  const createBtn = folder.querySelector(".create-btn");
  const viewLink = folder.querySelector(".view-link");

  if (createBtn)
    createBtn.addEventListener("click", () => {
      window.location.href = "submit-activity.html";
    });

  if (viewLink)
    viewLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "my-activities.html";
    });
}

// --- Animate Progress Bars ---
function animateProgressBars() {
  document.querySelectorAll(".progress-bar").forEach((bar) => {
    bar.style.width = "0";
    setTimeout(() => {
      const value = parseInt(bar.dataset.value || 0, 10);
      const max = 5; // adjust for scaling
      const percentage = Math.min((value / max) * 100, 100);
      bar.style.transition = "width 0.8s ease-out";
      bar.style.width = `${percentage}%`;
    }, 300);
  });
}

// ===============================
// INITIALIZER
// ===============================
function initDashboard() {
  renderOrgDashboard();

  // Handle resizing gracefully (optional future responsiveness)
  window.addEventListener(
    "resize",
    debounce(() => {
      // re-render only if width breakpoint changes
    }, 300)
  );
}

// Simple debounce utility
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

initDashboard();
