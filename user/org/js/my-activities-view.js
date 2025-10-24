import { ActivitiesSummaryComponent } from "./components/activities-summary-component.js";
import { SubmissionsComponent } from "./components/submissions-component.js";
import { ActivityDetailsComponent } from "./components/activity-details-component.js";

export class MyActivitiesView {
  constructor() {
    this.folderBody = document.getElementById("folder-body");

    this.summaryComponent = new ActivitiesSummaryComponent();
    this.submissionsComponent = new SubmissionsComponent();
    this.detailsComponent = new ActivityDetailsComponent();

    this.activitiesData = [];
    this.submissionsData = [];
    this.currentViewMode = "cards"; // default
  }

  render(activities, submissions) {
    this.activitiesData = activities;
    this.submissionsData = submissions;

    this.folderBody.innerHTML = "";

    const whiteSection = document.createElement("div");
    whiteSection.classList.add("white-section");

    /* ================================
       Submission Status Section
    ================================= */
    const statusTitle = document.createElement("h2");
    statusTitle.textContent = "Submission Status";
    statusTitle.classList.add("section-title");
    whiteSection.appendChild(statusTitle);
    whiteSection.appendChild(this.summaryComponent.render(activities));

    /* ================================
       All Submissions Header + Toggle
    ================================= */
    const submissionsHeader = document.createElement("div");
    submissionsHeader.classList.add("submissions-header");

    const submissionsTitle = document.createElement("h2");
    submissionsTitle.textContent = "All Submissions";
    submissionsTitle.classList.add("section-title");

    // Toggle container beside title
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

    /* ================================
       Submissions Section
    ================================= */
    this.submissionContainer = this.submissionsComponent.render(submissions, this.currentViewMode);
    whiteSection.appendChild(this.submissionContainer);
    this.folderBody.appendChild(whiteSection);

    /* ================================
       Toggle Behavior (fixed)
    ================================= */
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


    // Submission Click → Details
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
