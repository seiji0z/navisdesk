import { ActivitiesSummaryComponent } from "./components/activities-summary-component.js";
import { SubmissionsComponent } from "./components/submissions-component.js";
import { ActivityDetailsComponent } from "./components/activity-details-component.js";

export class MyActivitiesView {
  constructor() {
    this.folderBody = document.getElementById("folder-body");

    // Create subcomponents
    this.summaryComponent = new ActivitiesSummaryComponent();
    this.submissionsComponent = new SubmissionsComponent();
    this.detailsComponent = new ActivityDetailsComponent();

    // Store data so we can re-render later
    this.activitiesData = [];
    this.submissionsData = [];
  }

render(activities, submissions) {
  this.activitiesData = activities;
  this.submissionsData = submissions;

  this.folderBody.innerHTML = "";

  // Create wrapper for the white section
  const whiteSection = document.createElement("div");
  whiteSection.classList.add("white-section");

  // ===== Submission Status Section =====
  const statusTitle = document.createElement("h2");
  statusTitle.textContent = "Submission Status";
  statusTitle.classList.add("section-title");

  whiteSection.appendChild(statusTitle);
  whiteSection.appendChild(this.summaryComponent.render(activities));

  // ===== All Submissions Section =====
  const submissionsTitle = document.createElement("h2");
  submissionsTitle.textContent = "All Submissions";
  submissionsTitle.classList.add("section-title");

  whiteSection.appendChild(submissionsTitle);
  whiteSection.appendChild(this.submissionsComponent.render(submissions));

  // Add everything to folder body
  this.folderBody.appendChild(whiteSection);

  // Handle submission click → show details
  this.submissionsComponent.bindSubmissionClick((submissionId) => {
    this.showActivityDetails(submissionId);
  });
}


  showActivityDetails(submissionId) {
    const submission = this.submissionsData.find((s) => s.id === submissionId);
    if (!submission) return;

    this.folderBody.innerHTML = ""; // Clear current view

    const detailsView = this.detailsComponent.render(submission);
    this.folderBody.appendChild(detailsView);

    // ✅ Properly restore both summary + submissions on back
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
