import { SubmissionHistoryComponent } from "./submission-history-component.js";
import { FeedbackComponent } from "./feedback-component.js";

export class ActivityDetailsComponent {
  constructor() {
    this.historyComponent = new SubmissionHistoryComponent();
    this.feedbackComponent = new FeedbackComponent();
  }

  render(submission) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("activity-details-wrapper");

    const statusColor =
      submission.status === "Approved"
        ? "background-color:#22c55e;color:white;"
        : submission.status === "Pending"
        ? "background-color:#facc15;color:black;"
        : submission.status === "Needs Attention"
        ? "background-color:#ef4444;color:white;"
        : "";

    wrapper.innerHTML = `
      <button class="back-button" id="back-button">
        <i class="fa-solid fa-arrow-left"></i> Back to Submissions
      </button>

      <div class="details-header">
        <div class="header-left">
          <h2>${submission.activity}</h2>
          <p>${submission.description}</p>
        </div>
        <div class="header-right">
          <span class="status-badge" style="${statusColor}">${submission.status}</span>
        </div>
      </div>

      <div class="details-section white-section scrollable">
        <h3>Activity Details</h3>
        <div><strong>Date:</strong> ${submission.date}</div>
        <div><strong>Venue:</strong> ${submission.venue}</div>
        <div><strong>Participants:</strong> ${submission.participants}</div>
        <div><strong>SDG Alignment:</strong> ${submission.sdg}</div>
      </div>

      <div class="details-section white-section scrollable">
        <h3>Supporting Documents</h3>
        <div class="documents-container">
          ${submission.documents.map((d) => `<div class="doc-card">${d}</div>`).join("")}
        </div>
      </div>

      <div class="details-section white-section scrollable">
        <h3>Activity Evidence</h3>
        <div class="evidence-container">
          ${submission.evidence.map((img) => `<img src="${img}" class="evidence-img" alt="Evidence">`).join("")}
        </div>
      </div>
    `;

    // Add subcomponents
    this.historyComponent.render(submission.history, wrapper);
    this.feedbackComponent.render(submission.feedback, wrapper);

    return wrapper;
  }

  bindBackButton(handler) {
    document.addEventListener("click", (e) => {
      if (e.target.id === "back-button") handler();
    });
  }
}
