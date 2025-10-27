// ===============================
// ORGANIZATION DASHBOARD
// ===============================

// --- MAIN RENDER FUNCTION ---
function renderOrgDashboard() {
  const folderBody = document.querySelector("#folder-body");
  if (!folderBody) return;

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
  const statuses = [
    { title: "Approved", count: 3, class: "approved" },
    { title: "Under Review", count: 2, class: "review" },
    { title: "Needs Attention", count: 4, class: "attention" },
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
  const activities = [
    {
      title: "Annual Report Submission",
      desc: "A short description of what is being done",
      status: "approved",
    },
    {
      title: "Project Proposal",
      desc: "Awaiting evaluation",
      status: "review",
    },
    {
      title: "Community Service",
      desc: "Pending revisions",
      status: "attention",
    },
  ];

  const activityItems = activities
    .map(
      (a) => `
        <div class="activity-item">
          <div class="activity-details">
            <p class="activity-title">${a.title}</p>
            <p class="activity-desc">${a.desc}</p>
          </div>
          <span class="status-badge ${a.status}">${formatStatus(
        a.status
      )}</span>
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
  const reminders = [
    {
      title: "Annual Report Submission",
      date: "Oct 31, 2025",
      color: "orange",
    },
    { title: "Midyear Evaluation", date: "Nov 15, 2025", color: "blue" },
  ];

  const reminderItems = reminders
    .map(
      (r) => `
        <div class="reminder-item">
          <p class="reminder-title">${r.title}</p>
          <p class="reminder-date ${r.color}">Due: ${r.date}</p>
        </div>`
    )
    .join("");

  return `
    <div class="reminders card">
      <h3>Reminders & Deadlines</h3>
      ${reminderItems}
    </div>
  `;
}

// ===============================
// HELPER FUNCTIONS
// ===============================

function formatStatus(status) {
  switch (status) {
    case "approved":
      return "Approved";
    case "review":
      return "Under Review";
    case "attention":
      return "Needs Attention";
    default:
      return status;
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
