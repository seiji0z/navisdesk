// ===============================
// ORGANIZATION DASHBOARD (GRID LAYOUT)
// ===============================

// Wait for DOM + Auth
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Authenticate user
    await protectPage("org");

    // Fetch organization details
    const response = await fetch("../../../server/php/get-student-orgs.php");
    if (!response.ok) throw new Error("Failed to fetch organization details");
    const orgs = await response.json();
    organizationsData = orgs; // Store globally for later use

    // Find our organization
    const myOrg = orgs.find((org) => org._id === ICON_ORG_ID);
    if (!myOrg) throw new Error("Organization not found");

    // Set the welcome name to organization abbreviation
    const nameSpan = document.querySelector(".welcome span");
    if (nameSpan) {
      nameSpan.textContent = myOrg.abbreviation;
    }

    renderOrgDashboard();
  } catch (err) {
    console.error("Access denied or error:", err);
    document.body.innerHTML = "<h1>Access Denied</h1>";
  }
});

const ICON_ORG_ID = "6716001a9b8c2001abcd0001";
let activitiesData = [];
let organizationsData = [];

async function fetchActivitiesFromDB() {
  try {
    const response = await fetch("../../../server/php/get-activities.php", {
      headers: {
        "x-org-id": ICON_ORG_ID, // THIS IS THE MISSING LINE
      },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`HTTP ${response.status}: ${err}`);
    }

    const allActivities = await response.json();

    activitiesData = allActivities.map((a) => ({
      _id: a._id,
      org_id: a.org_id,
      title: a.title || "Untitled",
      description: a.description || "No description",
      status: a.status || "Pending",
      submitted_at: a.submitted_at || a.created_at,
      remarks: a.remarks || "",
      // Add other fields you need
      venue: a.venue,
      date_start: a.date_start,
      date_end: a.date_end,
      objectives: a.objectives,
      acad_year: a.acad_year,
      term: a.term,
      submitted_by: a.submitted_by,
      reviewed_by: a.reviewed_by,
      reviewed_at: a.reviewed_at,
      created_at: a.created_at,
      sdgs: a.sdgs,
      supporting_docs: a.supporting_docs,
      evidences: a.evidences,
    }));

    console.log("ICON Activities:", activitiesData);
    return activitiesData;
  } catch (error) {
    console.error("Fetch error:", error);
    activitiesData = [];
    return [];
  }
}

// --- MAIN RENDER ---
async function renderOrgDashboard() {
  const folderBody = document.querySelector("#folder-body");
  if (!folderBody) return;

  await fetchActivitiesFromDB();

  const iconActivities = activitiesData.filter((a) => a.org_id === ICON_ORG_ID);

  const approved = iconActivities.filter((a) => a.status === "Approved").length;
  const pending = iconActivities.filter((a) => a.status === "Pending").length;
  const returned = iconActivities.filter((a) => a.status === "Returned").length;
  const recent = iconActivities.slice(0, 3);
  const toRevise = iconActivities.filter((a) => a.status === "Returned");

  folderBody.innerHTML = `
    <div class="grid-container">
      <!-- Quick Actions -->
      <div class="grid-item small">
        <div class="card quick-actions-card">
          <h3>Quick Actions</h3>
          <button class="create-btn">+ Create New Activity</button>
          <a href="#" class="view-link">View my Activities</a>
        </div>
      </div>

      <!-- Status Counters -->
      <div class="grid-item small">
        <div class="card status-card">
          <div class="left-details"><p class="number">${approved}</p><p class="desc">Approved</p></div>
          <div class="right-icon"><img src="../../../assets/images/check-icon.png" class="card-icon"></div>
        </div>
      </div>

      <div class="grid-item small">
        <div class="card status-card">
          <div class="left-details"><p class="number">${pending}</p><p class="desc">Pending</p></div>
          <div class="right-icon"><img src="../../../assets/images/under-review.png" class="card-icon"></div>
        </div>
      </div>

      <div class="grid-item small">
        <div class="card status-card">
          <div class="left-details"><p class="number">${returned}</p><p class="desc">Returned</p></div>
          <div class="right-icon"><img src="../../../assets/images/close-icon.png" class="card-icon"></div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="grid-item medium">
        <div class="card recent-card">
          <div class="section-header">
            <h3>Recent Activities</h3>
            <a href="my-activities.html" class="view-all">View all</a>
          </div>
          <div class="activity-list">
            ${recent
              .map(
                (a) => `
                  <div class="activity-item" data-id="${a._id}">
                    <div class="activity-details">
                      <p class="activity-title">${a.title}</p>
                      <p class="activity-meta"><small>${formatDate(
                        a.submitted_at
                      )}</small></p>
                      <p class="activity-desc">${a.description}</p>
                    </div>
                    <span class="status-badge ${formatStatusClass(
                      a.status
                    )}">${formatStatus(a.status)}</span>
                  </div>`
              )
              .join("")}
          </div>
        </div>
      </div>

      <!-- Reminders -->
      <div class="grid-item medium">
        <div class="card reminders-card">
          <h3>To Be Revised</h3>
          <div class="reminder-list">
            ${
              toRevise.length
                ? toRevise
                    .map(
                      (r) => `
                  <div class="reminder-item" data-id="${r._id}">
                    <p class="reminder-title">${r.title}</p>
                    <p class="reminder-date">Remarks: ${r.remarks || "None"}</p>
                  </div>`
                    )
                    .join("")
                : "<p>No items to revise.</p>"
            }
          </div>
        </div>
      </div>
    </div>
  `;

  setupInteractions();
  bindActivityCardClicks();
}

// === Helpers ===
function formatStatus(s) {
  switch (s) {
    case "Approved":
      return "Approved";
    case "Pending":
      return "Pending";
    case "Returned":
      return "Returned";
    default:
      return s;
  }
}
function formatStatusClass(s) {
  switch (s) {
    case "Approved":
      return "approved";
    case "Pending":
      return "review";
    case "Returned":
      return "attention";
    default:
      return s.toLowerCase();
  }
}

// === Interactions ===
function setupInteractions() {
  const createBtn = document.querySelector(".create-btn");
  const viewLink = document.querySelector(".view-link");

  if (createBtn)
    createBtn.onclick = () => (location.href = "submit-activity.html");
  if (viewLink)
    viewLink.onclick = (e) => {
      e.preventDefault();
      location.href = "my-activities.html";
    };
}

function bindActivityCardClicks() {
  document
    .querySelectorAll(".activity-item, .reminder-item")
    .forEach((item) => {
      item.onclick = () => {
        const id = item.dataset.id;
        const act = activitiesData.find((a) => a._id === id);
        if (act) showActivityDetails(act);
      };
    });
}

// ===============================
// ACTIVITY DETAILS VIEW
// ===============================

function showActivityDetails(submission) {
  const folderBody = document.querySelector("#folder-body");
  folderBody.classList.add("details-view-active");
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
  const detailsView = detailsComponent.render(submission, organizationsData);
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

  detailsComponent.bindResubmitButton((activityId) => {
    // Redirect to submit-activity page with activity ID
    window.location.href = `submit-activity.html?edit=${activityId}`;
  });
}

// ===============================
// SHARED COMPONENTS
// ===============================

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

class ActivityDetailsComponent {
  render(submission, organizations = []) {
    const container = document.createElement("div");
    container.classList.add("activity-details");

    // Find the organization details
    const org = organizations.find((o) => o._id === submission.org_id);
    const orgName = org?.name || "N/A";
    const orgAbbreviation = org?.abbreviation || "N/A";

    container.innerHTML = `
      <button class="back-btn"><i class="fas fa-arrow-left"></i> Back</button>
      <h2>${submission.title}</h2>

      <!-- General Information -->
      <section class="details-section">
        <h3>General Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <strong>Status:</strong>
            <span class="status ${submission.status.toLowerCase()}">${
      submission.status
    }</span>
          </div>
          <div class="info-item">
            <strong>Organization Name:</strong>
            <span>${orgName}</span>
          </div>
          <div class="info-item">
            <strong>Organization Abbreviation:</strong>
            <span>${orgAbbreviation}</span>
          </div>
          <div class="info-item">
            <strong>Description:</strong>
            <span>${submission.description || "N/A"}</span>
          </div>
          <div class="info-item">
            <strong>Objectives:</strong>
            <span>${submission.objectives || "N/A"}</span>
          </div>
          <div class="info-item">
            <strong>Academic Year:</strong>
            <span>${submission.acad_year || "N/A"}</span>
          </div>
          <div class="info-item">
            <strong>Term:</strong>
            <span>${submission.term || "N/A"}</span>
          </div>
          <div class="info-item">
            <strong>Organization ID:</strong>
            <span>${submission.org_id || "N/A"}</span>
          </div>
          <div class="info-item">
            <strong>Submitted By:</strong>
            <span>${submission.submitted_by || "N/A"}</span>
          </div>
          <div class="info-item">
            <strong>Submitted At:</strong>
            <span>${formatDate(submission.submitted_at) || "N/A"}</span>
          </div>
          <div class="info-item">
            <strong>Reviewed By:</strong>
            <span>${submission.reviewed_by || "N/A"}</span>
          </div>
          <div class="info-item">
            <strong>Reviewed At:</strong>
            <span>${formatDate(submission.reviewed_at) || "N/A"}</span>
          </div>
          <div class="info-item">
            <strong>Created At:</strong>
            <span>${formatDate(submission.created_at) || "N/A"}</span>
          </div>
        </div>
      </section>

      <!-- Event Details -->
      <section class="details-section">
        <h3>Event Details</h3>
        <div class="info-grid">
          <div class="info-item">
            <strong>Venue:</strong>
            <span>${submission.venue || "N/A"}</span>
          </div>
          <div class="info-item">
            <strong>Date Start:</strong>
            <span>${formatDate(submission.date_start) || "N/A"}</span>
          </div>
          <div class="info-item">
            <strong>Date End:</strong>
            <span>${formatDate(submission.date_end) || "N/A"}</span>
          </div>
          <div class="info-item full-width">
            <strong>SDGs:</strong>
            <span>${
              submission.sdgs && submission.sdgs.length
                ? submission.sdgs.join(", ")
                : "N/A"
            }</span>
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
                    <p class="evidence-date"><small>Uploaded: ${
                      d.upload_date
                        ? formatDate(d.upload_date)
                        : formatDate(submission.submitted_at)
                    }</small></p>
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
                  <img src="../../../uploads/${e.file_name || e}" alt="${
                      e.file_name || e
                    }" loading="lazy" />
                  <div class="evidence-info">
                    <p class="evidence-name">${e.file_name || e}</p>
                    <p class="evidence-date"><small>Uploaded: ${
                      e.upload_date
                        ? formatDate(e.upload_date)
                        : formatDate(submission.submitted_at)
                    }</small></p>
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

      <!-- Re-submit Button (Only for Returned activities) -->
      ${
        submission.status === "Returned"
          ? `
      <div class="resubmit-action-row">
        <button class="resubmit-btn" data-activity-id="${submission._id}">
          <i class="fas fa-edit"></i> Re-submit Activity
        </button>
      </div>
      `
          : ""
      }
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
        remarks: submission.remarks || "No Remarks",
      });
    }

    // If no history items exist, create one with current status
    if (historyItems.length === 0) {
      historyItems.push({
        date: submission.created_at || new Date().toISOString(),
        status: submission.status,
        remarks: submission.remarks || "No Remarks",
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

  bindResubmitButton(handler) {
    const resubmitBtn = document.querySelector(".resubmit-btn");
    if (resubmitBtn) {
      resubmitBtn.addEventListener("click", () => {
        const activityId = resubmitBtn.getAttribute("data-activity-id");
        handler(activityId);
      });
    }
  }
}

// ===============================
// INITIALIZER
// ===============================

// init is handled by the DOMContentLoaded listener above
