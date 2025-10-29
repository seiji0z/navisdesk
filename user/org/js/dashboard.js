// ===============================
// ORGANIZATION DASHBOARD
// ===============================

const ICON_ORG_ID = "6716001a9b8c2001abcd0001";
let activitiesData = [];

// Helper function to normalize activity data
function normalizeActivity(activity) {
  return {
    ...activity,
    org_id: activity.org_id?.$oid || activity.org_id || "",
    submitted_by: activity.submitted_by?.$oid || activity.submitted_by || "N/A",
    reviewed_by: activity.reviewed_by?.$oid || activity.reviewed_by || null,
    _id: activity._id?.$oid || activity._id || "",
  };
}

// Fetch activities data and normalize
async function fetchActivities() {
  try {
    const response = await fetch("../../../data/activities.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const rawData = await response.json();
    activitiesData = rawData.map(normalizeActivity);
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
  bindActivityCardClicks(); // Enables clicking on activity/reminder cards
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
  const iconActivities = activitiesData.filter(
    (a) => a.org_id === ICON_ORG_ID
  );

  const approvedCount = iconActivities.filter((a) => a.status === "Approved").length;
  const pendingCount = iconActivities.filter((a) => a.status === "Pending").length;
  const returnedCount = iconActivities.filter((a) => a.status === "Returned").length;

  const statuses = [
    { title: "Approved", count: approvedCount, class: "approved" },
    { title: "Pending", count: pendingCount, class: "review" },
    { title: "Returned", count: returnedCount, class: "attention" },
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
  const iconActivities = activitiesData
    .filter((a) => a.org_id === ICON_ORG_ID)
    .slice(0, 3);

  const activityItems = iconActivities
    .map(
      (a) => `
        <div class="activity-item" data-id="${a._id}">
          <div class="activity-details">
            <p class="activity-title">${a.title}</p>
            <p class="activity-desc">${a.description}</p>
          </div>
          <span class="status-badge ${formatStatusClass(a.status)}">${formatStatus(a.status)}</span>
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
  const reviseActivities = activitiesData.filter(
    (a) => a.org_id === ICON_ORG_ID && a.status === "Returned"
  );

  const reminderItems = reviseActivities
    .map(
      (r) => `
        <div class="reminder-item" data-id="${r._id}">
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
    case "Approved": return "Approved";
    case "Pending": return "Pending";
    case "Returned": return "Returned";
    default: return status;
  }
}

function formatStatusClass(status) {
  switch (status) {
    case "Approved": return "approved";
    case "Pending": return "review";
    case "Returned": return "attention";
    default: return status.toLowerCase();
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

function animateProgressBars() {
  document.querySelectorAll(".progress-bar").forEach((bar) => {
    bar.style.width = "0";
    setTimeout(() => {
      const value = parseInt(bar.dataset.value || 0, 10);
      const max = 5;
      const percentage = Math.min((value / max) * 100, 100);
      bar.style.transition = "width 0.8s ease-out";
      bar.style.width = `${percentage}%`;
    }, 300);
  });
}

function bindActivityCardClicks() {
  const folderBody = document.querySelector("#folder-body");
  if (!folderBody) return;

  const activityItems = folderBody.querySelectorAll(".activity-item, .reminder-item");
  activityItems.forEach((item) => {
    item.addEventListener("click", () => {
      const activityId = item.dataset.id;
      const selectedActivity = activitiesData.find(
        (a) => a._id === activityId
      );
      if (selectedActivity) {
        showActivityDetails(selectedActivity);
      }
    });
  });
}

// ===============================
// ACTIVITY DETAILS VIEW
// ===============================

function showActivityDetails(submission) {
  const folderBody = document.querySelector("#folder-body");
  folderBody.classList.add("details-view-active");
  folderBody.scrollTop = 0;
  folderBody.innerHTML = "";

  // Load my-activities.css dynamically
  let styleTag = document.getElementById("myActivitiesCSS");
  if (!styleTag) {
    styleTag = document.createElement("link");
    styleTag.rel = "stylesheet";
    styleTag.href = "../css/my-activities.css";
    styleTag.id = "myActivitiesCSS";
    document.head.appendChild(styleTag);
  }

  const detailsComponent = new ActivityDetailsComponent();
  const detailsView = detailsComponent.render(submission);
  folderBody.appendChild(detailsView);

  detailsComponent.bindBackButton(() => {
    const folderBody = document.querySelector("#folder-body");
    if (folderBody) {
      folderBody.classList.remove("details-view-active");
    }
    // Remove the temporarily loaded CSS
    const styleToRemove = document.getElementById("myActivitiesCSS");
    if (styleToRemove) styleToRemove.remove();
    renderOrgDashboard(); // Re-render dashboard
  });
}

// ===============================
// INITIALIZER
// ===============================

function initDashboard() {
  renderOrgDashboard();
  window.addEventListener("resize", debounce(() => {}, 300));
}

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

initDashboard();

// ===============================
// SHARED COMPONENTS
// ===============================

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

class ActivityDetailsComponent {
  render(submission) {
    const container = document.createElement("div");
    container.classList.add("activity-details");

    container.innerHTML = `
      <button class="back-btn"><i class="fas fa-arrow-left"></i> Back</button>
      <h2>${submission.title}</h2>

      <!-- General Information -->
      <section class="details-section">
        <h3>General Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <strong>Status:</strong>
            <span class="status ${submission.status.toLowerCase()}">${submission.status}</span>
          </div>
          <div class="info-item">
            <strong>Description:</strong>
            <span>${submission.description}</span>
          </div>
          <div class="info-item">
            <strong>Objectives:</strong>
            <span>${submission.objectives}</span>
          </div>
          <div class="info-item">
            <strong>Academic Year:</strong>
            <span>${submission.acad_year}</span>
          </div>
          <div class="info-item">
            <strong>Term:</strong>
            <span>${submission.term}</span>
          </div>
          <div class="info-item">
            <strong>Organization ID:</strong>
            <span>${submission.org_id}</span>
          </div>
          <div class="info-item">
            <strong>Submitted By:</strong>
            <span>${submission.submitted_by}</span>
          </div>
          <div class="info-item">
            <strong>Submitted At:</strong>
            <span>${formatDate(submission.submitted_at)}</span>
          </div>
          <div class="info-item">
            <strong>Reviewed By:</strong>
            <span>${submission.reviewed_by || ""}</span>
          </div>
          <div class="info-item">
            <strong>Reviewed At:</strong>
            <span>${formatDate(submission.reviewed_at)}</span>
          </div>
          <div class="info-item">
            <strong>Created At:</strong>
            <span>${formatDate(submission.created_at)}</span>
          </div>
        </div>
      </section>

      <!-- Event Details -->
      <section class="details-section">
        <h3>Event Details</h3>
        <div class="info-grid">
          <div class="info-item">
            <strong>Venue:</strong>
            <span>${submission.venue}</span>
          </div>
          <div class="info-item">
            <strong>Date Start:</strong>
            <span>${formatDate(submission.date_start)}</span>
          </div>
          <div class="info-item">
            <strong>Date End:</strong>
            <span>${formatDate(submission.date_end)}</span>
          </div>
          <div class="info-item full-width">
            <strong>SDGs:</strong>
            <span>${submission.sdgs && submission.sdgs.length ? submission.sdgs.join(", ") : "None"}</span>
          </div>
        </div>
      </section>

      <!-- Supporting Documents -->
      <section class="details-section">
        <h3>Supporting Documents</h3>
        <div class="evidence-grid">
          ${
            submission.supporting_docs && submission.supporting_docs.length
              ? submission.supporting_docs
                  .map(
                    (d) => `
                <div class="evidence-item">
                  <div class="document-preview">
                    <i class="fas fa-file-alt fa-3x"></i>
                  </div>
                  <div class="evidence-info">
                    <p class="evidence-name">${d.file_name || d}</p>
                    <p class="evidence-date"><small>Uploaded: ${d.upload_date ? formatDate(d.upload_date) : formatDate(submission.submitted_at)}</small></p>
                  </div>
                </div>`
                  )
                  .join("")
              : "<p>No supporting documents available.</p>"
          }
        </div>
      </section>

      <!-- Evidences -->
      <section class="details-section">
        <h3>Evidences</h3>
        <div class="evidence-grid">
          ${
            submission.evidences && submission.evidences.length
              ? submission.evidences
                  .map(
                    (e) => `
                <div class="evidence-item">
                  <img src="../../../uploads/${e.file_name || e}" alt="${e.file_name || e}" loading="lazy" />
                  <div class="evidence-info">
                    <p class="evidence-name">${e.file_name || e}</p>
                    <p class="evidence-date"><small>Uploaded: ${e.upload_date ? formatDate(e.upload_date) : formatDate(submission.submitted_at)}</small></p>
                  </div>
                </div>`
                  )
                  .join("")
              : "<p>No evidences available.</p>"
          }
        </div>
      </section>

      <!-- Activity History -->
      <section class="details-section">
        <h3>History</h3>
        <div class="info-grid">
          ${this.generateHistory(submission)}
        </div>
      </section>
    `;

    return container;
  }

  generateHistory(submission) {
    const historyItems = [];

    // Add submission event if submitted_at exists
    if (submission.submitted_at) {
      historyItems.push({
        date: submission.submitted_at,
        status: submission.status,
        remarks: submission.remarks || "No Remarks"
      });
    }

    // If no history items exist, create one with current status
    if (historyItems.length === 0) {
      historyItems.push({
        date: submission.created_at || new Date().toISOString(),
        status: submission.status,
        remarks: submission.remarks || "No Remarks"
      });
    }

    return historyItems
      .map(
        (h) => `
      <div class="info-item">
        <strong>Date:</strong>
        <span>${formatDate(h.date)}</span>
      </div>
      <div class="info-item">
        <strong>Status:</strong>
        <span class="status ${h.status.toLowerCase()}">${h.status}</span>
      </div>
      <div class="info-item full-width">
        <strong>Remarks:</strong>
        <span>${h.remarks}</span>
      </div>`
      )
      .join("");
  }

  bindBackButton(handler) {
    const backBtn = document.querySelector(".back-btn");
    if (backBtn) backBtn.addEventListener("click", handler);
  }
}