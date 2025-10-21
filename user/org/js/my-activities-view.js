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

    // Render both summary and submissions
    this.folderBody.appendChild(this.summaryComponent.render(activities));
    this.folderBody.appendChild(this.submissionsComponent.render(submissions));

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
}
