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
            <h3>${s.activity}</h3>
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
              <td>${s.activity}</td>
              <td><span class="status ${s.status.toLowerCase()}">${s.status}</span></td>
              <td>${s.submittedDate}</td>
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
      <h2>${submission.activity}</h2>
      <p><strong>Status:</strong> <span class="status ${submission.status.toLowerCase()}">${submission.status}</span></p>
      <p><strong>Description:</strong> ${submission.description}</p>
      <p><strong>Venue:</strong> ${submission.venue}</p>
      <p><strong>Participants:</strong> ${submission.participants}</p>
      <p><strong>SDG:</strong> ${submission.sdg}</p>
      <h3>Documents</h3>
      <ul>${submission.documents.map((d) => `<li>${d}</li>`).join("")}</ul>
      <h3>Evidence</h3>
      <div class="evidence">
        ${submission.evidence.map((e) => `<img src="../../../uploads/${e}" alt="${e}" />`).join("")}
      </div>
      <h3>History</h3>
      <ul>
        ${submission.history.map((h) => `<li><strong>${h.date}:</strong> ${h.status} - ${h.remarks}</li>`).join("")}
      </ul>
      <h3>Feedback</h3>
      <ul>
        ${submission.feedback.map((f) => `<li><strong>${f.reviewer}</strong> (${f.date}): ${f.comment}</li>`).join("")}
      </ul>
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
    this.activities = [
      { title: "Approved", count: 0, description: "Approved activities" },
      { title: "Revise", count: 0, description: "Requires review" },
      { title: "Pending", count: 0, description: "Awaiting approval" },
    ];
  }

  updateActivityCount(title, newCount) {
    const activity = this.activities.find((a) => a.title === title);
    if (activity) activity.count = newCount;
  }

  async loadSubmissions() {
    this.submissions = [
      {
        id: 1,
        activity: "Community Clean-Up Drive",
        status: "Approved",
        description: "A community clean-up project around Burnham Park.",
        submittedDate: "2025-10-18",
        date: "2025-10-10",
        venue: "Burnham Park",
        participants: "25",
        sdg: "Sustainable Cities and Communities",
        documents: ["proposal.pdf", "attendance.xlsx"],
        evidence: ["evidence1.jpg", "evidence2.jpg"],
        history: [
          { date: "2025-10-12", status: "Pending", remarks: "Waiting for approval" },
          { date: "2025-10-15", status: "Approved", remarks: "All requirements met" },
        ],
        feedback: [
          { reviewer: "Admin A", date: "2025-10-16", comment: "Good initiative! Continue collaborating with local units." },
          { reviewer: "Coordinator B", date: "2025-10-17", comment: "Ensure to submit the final attendance sheet next time." },
        ],
      },
      {
        id: 2,
        activity: "Tree Planting Initiative",
        status: "Pending",
        description: "Planting native trees around Camp John Hay.",
        submittedDate: "2025-10-15",
        date: "2025-10-08",
        venue: "Camp John Hay",
        participants: "30",
        sdg: "Life on Land",
        documents: ["plan.pdf", "list.xlsx"],
        evidence: ["photo1.jpg", "photo2.jpg"],
        history: [{ date: "2025-10-10", status: "Draft", remarks: "Initial submission" }],
        feedback: [],
      },

      {
        id: 4,
        activity: "Mental Health Awareness Workshop",
        status: "Approved",
        description: "An interactive workshop on student mental health and resilience.",
        submittedDate: "2025-10-11",
        date: "2025-10-04",
        venue: "Student Center",
        participants: "80",
        sdg: "Good Health and Well-being",
        documents: ["agenda.pdf", "participants.xlsx"],
        evidence: ["group-photo.jpg"],
        history: [
          { date: "2025-10-06", status: "Pending", remarks: "Under review" },
          { date: "2025-10-09", status: "Approved", remarks: "Looks good to proceed" },
        ],
        feedback: [],
      },
      

      {
        id: 6,
        activity: "Coastal Cleanup Initiative",
        status: "Approved",
        description: "Students collaborated with NGOs to clean up coastal areas.",
        submittedDate: "2025-10-07",
        date: "2025-09-30",
        venue: "La Union Beach",
        participants: "40",
        sdg: "Life Below Water",
        documents: ["coastal-plan.pdf"],
        evidence: ["cleanup.jpg", "volunteers.jpg"],
        history: [{ date: "2025-10-03", status: "Approved", remarks: "Great community engagement" }],
        feedback: [],
      },
    ];

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
