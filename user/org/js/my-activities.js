// Helper function to format dates as "Month Day, Year"
function formatDate(dateString) {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    return "";
  }
}

// Helper function to format date range
function formatDateRange(startDate, endDate) {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (!start && !end) return "";
  if (start === end) return start;
  if (!start) return end;
  if (!end) return start;
  return `${start} to ${end}`;
}

class ActivitiesSummaryComponent {
  render(activities) {
    const container = document.createElement("div");
    container.classList.add("activities-cards");

    activities.forEach((activity) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="card-content">
          <div class="card-title">${activity.title}</div>
          <div class="card-count">${activity.count}</div>
          <div class="card-description">${activity.description}</div>
        </div>
      `;
      container.appendChild(card);
    });

    return container;
  }
}

class SubmissionsComponent {
  render(submissions, viewMode = "cards") {
    const container = document.createElement("div");
    container.classList.add("submissions-container", viewMode);

    if (viewMode === "cards") {
      container.innerHTML = submissions
        .map(
          (s) => `
          <div class="submission-card ${s.status.toLowerCase()}" data-id="${s.id}">
            <div class="submission-card-content">
              <h3>${s.title}</h3>
              <p class="description">${s.description}</p>
              <div class="submission-meta">
                <div class="status-info">
                  <span class="status ${s.status.toLowerCase()}">${s.status}</span>
                </div>
                <div class="submission-details">
                  <span class="submission-date">${formatDate(s.submitted_at)}</span>
                  <span class="submission-venue">${s.venue}</span>
                </div>
              </div>
            </div>
          </div>`
        )
        .join("");
    } else {
      const tableWrapper = document.createElement("div");
      tableWrapper.classList.add("submissions-table-wrapper");

      const table = document.createElement("table");
      table.classList.add("submissions-table");
      table.innerHTML = `
        <thead>
          <tr>
            <th>Activity</th>
            <th>Status</th>
            <th>Submitted Date</th>
            <th>Venue</th>
          </tr>
        </thead>
        <tbody>
          ${submissions
            .map(
              (s) => `
            <tr class="${s.status.toLowerCase()}" data-id="${s.id}">
              <td>${s.title}</td>
              <td><span class="status ${s.status.toLowerCase()}">${s.status}</span></td>
              <td>${formatDate(s.submitted_at)}</td>
              <td>${s.venue}</td>
            </tr>`
            )
            .join("")}
        </tbody>`;
      tableWrapper.appendChild(table);
      container.appendChild(tableWrapper);
    }

    return container;
  }

  bindSubmissionClick(handler) {
    document.querySelectorAll("[data-id]").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.dataset.id; // Keep as string to match _id from JSON
        handler(id);
      });
    });
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

class MyActivitiesModel {
  constructor() {
    this.activities = [];
    this.submissions = [];
    this.ICON_ORG_ID = "6716001a9b8c2001abcd0001"; // ICON organization ID
  }

  async loadActivities() {
    // Default statuses will be updated after loading submissions
    this.activities = [
      { title: "Approved", count: 0, description: "Approved activities" },
      { title: "Returned", count: 0, description: "Requires revision" },
      { title: "Pending", count: 0, description: "Awaiting approval" },
    ];
  }

  async loadSubmissions() {
    try {
      // Get org ID from localStorage or fallback
      const orgId = localStorage.getItem("orgId") || this.ICON_ORG_ID;

      // Fetch from backend API
      const response = await fetch("http://localhost:5000/api/activities/my", {
        headers: {
          "x-org-id": orgId
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const allActivities = await response.json();

      // Map backend data to frontend format
      this.submissions = allActivities.map((activity, index) => {
        const activityId = activity._id || `activity_${index}`;
        return {
          id: activityId,
          _id: activityId,
          org_id: activity.org_id,
          title: activity.title || "Untitled Activity",
          description: activity.description || "No description provided",
          acad_year: activity.acad_year || "N/A",
          term: activity.term || "N/A",
          date_start: activity.date_start || "",
          date_end: activity.date_end || "",
          venue: activity.venue || "TBA",
          objectives: activity.objectives || "No objectives specified",
          sdgs: activity.sdgs || [],
          evidences: activity.evidences || [],
          supporting_docs: activity.supporting_docs || [],
          submitted_by: activity.submitted_by || "N/A",
          submitted_at: activity.submitted_at || "",
          reviewed_by: activity.reviewed_by || null,
          reviewed_at: activity.reviewed_at || null,
          status: activity.status || "Pending",
          created_at: activity.created_at || "",
        };
      });
    } catch (error) {
      console.error('Error loading activities from database:', error);
      this.submissions = [];
      alert("Failed to load activities. Please check server connection.");
    }

    // Summarize activity counts based on status
    const summaryMap = {};
    this.submissions.forEach((s) => {
      summaryMap[s.status] = (summaryMap[s.status] || 0) + 1;
    });

    this.activities = [
      {
        title: "Approved",
        count: summaryMap["Approved"] || 0,
        description: "Approved activities",
      },
      {
        title: "Returned",
        count: summaryMap["Returned"] || 0,
        description: "Requires revision",
      },
      {
        title: "Pending",
        count: summaryMap["Pending"] || 0,
        description: "Awaiting approval",
      },
    ];
  }

  getActivities() {
    return this.activities;
  }

  getSubmissions() {
    return this.submissions;
  }

  getSubmissionById(id) {
    // Support both string and numeric IDs
    return this.submissions.find((s) => s.id === id || s._id === id);
  }
}

class MyActivitiesView {
  constructor() {
    this.folderBody = document.getElementById("folder-body");
    this.summaryComponent = new ActivitiesSummaryComponent();
    this.submissionsComponent = new SubmissionsComponent();
    this.detailsComponent = new ActivityDetailsComponent();
    this.activitiesData = [];
    this.submissionsData = [];
    this.currentViewMode = "cards";
  }

  render(activities, submissions) {
    this.activitiesData = activities;
    this.submissionsData = submissions;
    this.folderBody.innerHTML = "";

    // Scroll to top when rendering
    this.folderBody.scrollTop = 0;

    // Section 1 — Submission Status
    const statusSection = document.createElement("div");
    statusSection.classList.add("white-section");

    const statusTitle = document.createElement("h2");
    statusTitle.textContent = "Submission Status";
    statusTitle.classList.add("section-title");
    statusSection.appendChild(statusTitle);

    // Render activity summary cards
    statusSection.appendChild(this.summaryComponent.render(activities));

    // Section 2 — All Submissions
    const submissionsSection = document.createElement("div");
    submissionsSection.classList.add("white-section");

    const submissionsHeader = document.createElement("div");
    submissionsHeader.classList.add("submissions-header");

    const submissionsTitle = document.createElement("h2");
    submissionsTitle.textContent = "All Submissions";
    submissionsTitle.classList.add("section-title");

    // View toggle (Cards/Table)
    const toggleContainer = document.createElement("div");
    toggleContainer.classList.add("toggle-container");
    toggleContainer.innerHTML = `
      <button class="table-toggle-btn ${
        this.currentViewMode === "cards" ? "active" : ""
      }" data-view="cards">
        <i class="fas fa-th-large"></i> Cards
      </button>
      <button class="table-toggle-btn ${
        this.currentViewMode === "table" ? "active" : ""
      }" data-view="table">
        <i class="fas fa-table"></i> Table
      </button>
    `;

    submissionsHeader.appendChild(submissionsTitle);
    submissionsHeader.appendChild(toggleContainer);
    submissionsSection.appendChild(submissionsHeader);

    // Render submissions (cards or table)
    this.submissionContainer = this.submissionsComponent.render(
      submissions,
      this.currentViewMode
    );
    submissionsSection.appendChild(this.submissionContainer);

    // Append both sections separately to folder body
    this.folderBody.appendChild(statusSection);
    this.folderBody.appendChild(submissionsSection);

    // Bind toggle events
    this.bindToggleEvents(toggleContainer);

    // Bind click events for submission details
    this.submissionsComponent.bindSubmissionClick((submissionId) => {
      this.showActivityDetails(submissionId);
    });
  }

  bindToggleEvents(toggleContainer) {
    toggleContainer.querySelectorAll(".table-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedView = btn.dataset.view;
        if (selectedView === this.currentViewMode) return;

        toggleContainer
          .querySelectorAll(".table-toggle-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentViewMode = selectedView;

        const newView = this.submissionsComponent.render(
          this.submissionsData,
          this.currentViewMode
        );
        this.submissionContainer.replaceWith(newView);
        this.submissionContainer = newView;

        this.submissionsComponent.bindSubmissionClick((submissionId) => {
          this.showActivityDetails(submissionId);
        });
      });
    });
  }

  showActivityDetails(submissionId) {
    const submission = this.submissionsData.find((s) => s.id === submissionId || s._id === submissionId);
    if (!submission) {
      console.error('Submission not found:', submissionId);
      return;
    }

    // Scroll to top when showing details
    this.folderBody.scrollTop = 0;

    this.folderBody.innerHTML = "";
    const detailsView = this.detailsComponent.render(submission);
    this.folderBody.appendChild(detailsView);

    this.detailsComponent.bindBackButton(() => {
      this.render(this.activitiesData, this.submissionsData);
    });
  }

  updateActivityCounts(activities) {
    const cards = document.querySelectorAll(".activities-cards .card");
    activities.forEach((activity) => {
      cards.forEach((card) => {
        const title = card.querySelector(".card-header h3").textContent.trim();
        if (title === activity.title) {
          const countEl = card.querySelector("h1");
          if (countEl) countEl.textContent = activity.count;
        }
      });
    });
  }
}

class MyActivitiesController {
  constructor() {
    this.model = new MyActivitiesModel();
    this.view = new MyActivitiesView();
  }

  async init() {
    await this.model.loadActivities();
    await this.model.loadSubmissions();
    this.view.render(this.model.getActivities(), this.model.getSubmissions());
  }
}

// Initialize the application
const controller = new MyActivitiesController();
controller.init();
