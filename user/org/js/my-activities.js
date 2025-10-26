class ActivitiesSummaryComponent {
  render(activities) {
    const container = document.createElement("div");
    container.classList.add("activities-cards");

    activities.forEach((activity) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="card-header"><h3>${activity.title}</h3></div>
        <h1>${activity.count}</h1>
        <p>${activity.description}</p>
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
          <div class="submission-card" data-id="${s.id}">
            <h3>${s.title}</h3>
            <p>Status: <span class="status ${s.status.toLowerCase()}">${s.status}</span></p>
            <p>${s.description}</p>
          </div>`
        )
        .join("");
    } else {
      const table = document.createElement("table");
      table.classList.add("submissions-table");
      table.innerHTML = `
        <thead>
          <tr>
            <th>Activity</th>
            <th>Status</th>
            <th>Submitted Date</th>
            <th>Venue</th>
            <th>Participants</th>
          </tr>
        </thead>
        <tbody>
          ${submissions
            .map(
              (s) => `
            <tr data-id="${s.id}">
              <td>${s.title}</td>
              <td><span class="status ${s.status.toLowerCase()}">${s.status}</span></td>
              <td>${s.submitted_at}</td>
              <td>${s.venue}</td>
              <td>${s.participants}</td>
            </tr>`
            )
            .join("")}
        </tbody>`;
      container.appendChild(table);
    }

    return container;
  }

  bindSubmissionClick(handler) {
    document.querySelectorAll("[data-id]").forEach((el) => {
      el.addEventListener("click", () => {
        const id = parseInt(el.dataset.id);
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
        <p><strong>Status:</strong> <span class="status ${submission.status.toLowerCase()}">${submission.status}</span></p>
        <p><strong>Description:</strong> ${submission.description}</p>
        <p><strong>Objectives:</strong> ${submission.objectives}</p>
        <p><strong>Academic Year:</strong> ${submission.acad_year}</p>
        <p><strong>Term:</strong> ${submission.term}</p>
        <p><strong>Organization ID:</strong> ${submission.org_id}</p>
        <p><strong>Submitted By:</strong> ${submission.submitted_by}</p>
        <p><strong>Submitted At:</strong> ${submission.submitted_at}</p>
        <p><strong>Reviewed By:</strong> ${submission.reviewed_by ? submission.reviewed_by : "N/A"}</p>
        <p><strong>Reviewed At:</strong> ${submission.reviewed_at ? submission.reviewed_at : "N/A"}</p>
        <p><strong>Created At:</strong> ${submission.created_at}</p>
      </section>

      <!-- Event Details -->
      <section class="details-section">
        <h3>Event Details</h3>
        <p><strong>Venue:</strong> ${submission.venue}</p>
        <p><strong>Date Start:</strong> ${submission.date_start}</p>
        <p><strong>Date End:</strong> ${submission.date_end}</p>
        <p><strong>Participants:</strong> ${submission.participants}</p>
        <p><strong>SDGs:</strong> ${submission.sdgs && submission.sdgs.length ? submission.sdgs.join(", ") : "None"}</p>
      </section>

      <!-- Supporting Documents -->
      <section class="details-section">
        <h3>Supporting Documents</h3>
        ${
          submission.supporting_docs && submission.supporting_docs.length
            ? `<ul>
                ${submission.supporting_docs
                  .map(
                    (d) => `
                  <li>
                    <a href="../../../uploads/${d.file_name}" target="_blank">${d.file_name}</a>
                    <span class="file-type">(${d.file_type})</span> 
                    <span class="upload-date">Uploaded: ${d.upload_date}</span>
                  </li>`
                  )
                  .join("")}
              </ul>`
            : "<p>No supporting documents available.</p>"
        }
      </section>

      <!-- Evidences -->
      <section class="details-section">
        <h3>Evidences</h3>
        <div class="evidence">
          ${
            submission.evidences && submission.evidences.length
              ? submission.evidences
                  .map(
                    (e) => `
                <div class="evidence-item">
                  <img src="../../../uploads/${e.file_name}" alt="${e.file_name}" />
                  <p>${e.file_name}</p>
                  <p><small>Uploaded: ${e.upload_date}</small></p>
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
        ${
          submission.history && submission.history.length
            ? `<ul>
                ${submission.history
                  .map(
                    (h) =>
                      `<li><strong>${h.date}:</strong> ${h.status} - ${h.remarks}</li>`
                  )
                  .join("")}
              </ul>`
            : "<p>No history records found.</p>"
        }
      </section>
    `;

    return container;
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
  }

  async loadActivities() {
    // Default statuses (linked to `activities.status`)
    this.activities = [
      { title: "Approved", count: 0, description: "Approved activities" },
      { title: "Revise", count: 0, description: "Requires review" },
      { title: "Pending", count: 0, description: "Awaiting approval" },
    ];
  }

  async loadSubmissions() {
    // Mock dataset reflecting your MongoDB structure
    this.submissions = [
      {
        id: 1,
        org_id: "6741a9f2c1234567890abcde",
        title: "Community Clean-Up Drive",
        description: "A clean-up project around Burnham Park led by volunteers.",
        acad_year: "2025-2026",
        term: "1st Semester",
        date_start: "2025-09-25",
        date_end: "2025-09-26",
        venue: "Burnham Park",
        objectives: "Promote environmental awareness and civic responsibility.",
        sdgs: ["Sustainable Cities and Communities"],
        evidences: [
          { file_name: "cleanup1.jpg", file_type: "image/jpeg", upload_date: "2025-09-26" },
          { file_name: "cleanup2.jpg", file_type: "image/jpeg", upload_date: "2025-09-26" },
        ],
        supporting_docs: [
          { file_name: "proposal.pdf", file_type: "application/pdf", upload_date: "2025-09-20" },
          { file_name: "attendance.xlsx", file_type: "application/vnd.ms-excel", upload_date: "2025-09-26" },
        ],
        submitted_by: "org_president_01",
        submitted_at: "2025-09-26",
        reviewed_by: "osas_admin_02",
        reviewed_at: "2025-09-27",
        participants: "25",
        status: "Approved",
        created_at: "2025-09-18",
        history: [
          { date: "2025-09-20", status: "Pending", remarks: "Under initial review" },
          { date: "2025-09-27", status: "Approved", remarks: "All documents validated" },
        ],
      },
      {
        id: 2,
        org_id: "6741a9f2c1234567890abcdf",
        title: "Tree Planting Initiative",
        description: "Planting native trees around Camp John Hay to promote biodiversity.",
        acad_year: "2025-2026",
        term: "1st Semester",
        date_start: "2025-10-05",
        date_end: "2025-10-05",
        venue: "Camp John Hay",
        objectives: "Support environmental sustainability through reforestation.",
        sdgs: ["Life on Land"],
        evidences: [{ file_name: "treeplant1.jpg", file_type: "image/jpeg", upload_date: "2025-10-06" }],
        supporting_docs: [{ file_name: "tree_plan.pdf", file_type: "application/pdf", upload_date: "2025-10-04" }],
        submitted_by: "org_secretary_01",
        submitted_at: "2025-10-06",
        reviewed_by: null,
        reviewed_at: null,
        participants: "30",
        status: "Pending",
        created_at: "2025-10-03",
        history: [{ date: "2025-10-04", status: "Pending", remarks: "Waiting for admin review" }],
      },
      {
        id: 3,
        org_id: "6741a9f2c1234567890abce0",
        title: "Mental Health Awareness Workshop",
        description: "A seminar promoting mental well-being and emotional resilience.",
        acad_year: "2025-2026",
        term: "1st Semester",
        date_start: "2025-09-15",
        date_end: "2025-09-15",
        venue: "SLU Student Center",
        objectives: "Raise awareness on mental health and coping strategies.",
        sdgs: ["Good Health and Well-being"],
        evidences: [{ file_name: "workshop_photo.jpg", file_type: "image/jpeg", upload_date: "2025-09-15" }],
        supporting_docs: [
          { file_name: "agenda.pdf", file_type: "application/pdf", upload_date: "2025-09-12" },
          { file_name: "participants.xlsx", file_type: "application/vnd.ms-excel", upload_date: "2025-09-15" },
        ],
        submitted_by: "org_president_02",
        submitted_at: "2025-09-15",
        reviewed_by: "osas_admin_01",
        reviewed_at: "2025-09-17",
        participants: "80",
        status: "Approved",
        created_at: "2025-09-10",
        history: [
          { date: "2025-09-13", status: "Pending", remarks: "Under review" },
          { date: "2025-09-17", status: "Approved", remarks: "Validated and approved" },
        ],
      },
    ];

    // Summarize activity counts
    const summaryMap = {};
    this.submissions.forEach((s) => {
      summaryMap[s.status] = (summaryMap[s.status] || 0) + 1;
    });

    this.activities = [
      { title: "Approved", count: summaryMap["Approved"] || 0, description: "Approved activities" },
      { title: "Revise", count: summaryMap["Revise"] || 0, description: "Requires review" },
      { title: "Pending", count: summaryMap["Pending"] || 0, description: "Awaiting approval" },
    ];
  }

  getActivities() {
    return this.activities;
  }

  getSubmissions() {
    return this.submissions;
  }

  getSubmissionById(id) {
    return this.submissions.find((s) => s.id === id);
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

    const whiteSection = document.createElement("div");
    whiteSection.classList.add("white-section");

    const statusTitle = document.createElement("h2");
    statusTitle.textContent = "Submission Status";
    statusTitle.classList.add("section-title");
    whiteSection.appendChild(statusTitle);
    whiteSection.appendChild(this.summaryComponent.render(activities));

    const submissionsHeader = document.createElement("div");
    submissionsHeader.classList.add("submissions-header");
    const submissionsTitle = document.createElement("h2");
    submissionsTitle.textContent = "All Submissions";
    submissionsTitle.classList.add("section-title");

    const toggleContainer = document.createElement("div");
    toggleContainer.classList.add("toggle-container");
    toggleContainer.innerHTML = `
      <button class="table-toggle-btn ${this.currentViewMode === "cards" ? "active" : ""}" data-view="cards">
        <i class="fas fa-th-large"></i> Cards
      </button>
      <button class="table-toggle-btn ${this.currentViewMode === "table" ? "active" : ""}" data-view="table">
        <i class="fas fa-table"></i> Table
      </button>
    `;

    submissionsHeader.appendChild(submissionsTitle);
    submissionsHeader.appendChild(toggleContainer);
    whiteSection.appendChild(submissionsHeader);

    this.submissionContainer = this.submissionsComponent.render(submissions, this.currentViewMode);
    whiteSection.appendChild(this.submissionContainer);
    this.folderBody.appendChild(whiteSection);

    toggleContainer.querySelectorAll(".table-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedView = btn.dataset.view;
        if (selectedView === this.currentViewMode) return;
        toggleContainer.querySelectorAll(".table-toggle-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentViewMode = selectedView;
        const newView = this.submissionsComponent.render(this.submissionsData, this.currentViewMode);
        this.submissionContainer.replaceWith(newView);
        this.submissionContainer = newView;
        this.submissionsComponent.bindSubmissionClick((submissionId) => {
          this.showActivityDetails(submissionId);
        });
      });
    });

    this.submissionsComponent.bindSubmissionClick((submissionId) => {
      this.showActivityDetails(submissionId);
    });
  }

  showActivityDetails(submissionId) {
    const submission = this.submissionsData.find((s) => s.id === submissionId);
    if (!submission) return;
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

  updateActivityCount(title, newCount) {
    this.model.updateActivityCount(title, newCount);
    this.view.updateActivityCounts(this.model.getActivities());
  }
}

const controller = new MyActivitiesController();
controller.init();
