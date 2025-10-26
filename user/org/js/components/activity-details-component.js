import { SubmissionHistoryComponent } from "./submission-history-component.js";
import { FeedbackComponent } from "./feedback-component.js";

export class ActivityDetailsComponent {
  constructor() {
    this.historyComponent = new SubmissionHistoryComponent();
    this.feedbackComponent = new FeedbackComponent();
  }

  // Escape HTML to prevent XSS
  escapeHTML(str) {
    return str
      ? str.replace(/[&<>'"]/g, (tag) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;"
        }[tag]))
      : "";
  }

  // Render the full activity details
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
          <h2>${this.escapeHTML(submission.activity)}</h2>
          <p>${this.escapeHTML(submission.description)}</p>
        </div>
        <div class="header-right">
          <span class="status-badge" style="${statusColor}">
            ${this.escapeHTML(submission.status)}
          </span>
        </div>
      </div>

      <div class="details-section white-section scrollable">
        <h3>Activity Details</h3>
        <div><strong>Date:</strong> ${this.escapeHTML(submission.date)}</div>
        <div><strong>Venue:</strong> ${this.escapeHTML(submission.venue)}</div>
        <div><strong>Participants:</strong> ${this.escapeHTML(submission.participants)}</div>
        <div><strong>SDG Alignment:</strong> ${this.escapeHTML(submission.sdg)}</div>
      </div>

      <div class="details-section white-section scrollable">
        <h3>Supporting Documents</h3>
        <div class="documents-container">
          ${
            submission.documents?.length
              ? submission.documents
                  .map((d) => `<div class="doc-card">${this.escapeHTML(d)}</div>`)
                  .join("")
              : "<p>No supporting documents uploaded.</p>"
          }
        </div>
      </div>

      <div class="details-section white-section scrollable">
        <h3>Activity Evidence</h3>
        <div class="evidence-container">
          ${
            submission.evidence?.length
              ? submission.evidence
                  .map(
                    (img) =>
                      `<img src="${img}" class="evidence-img" alt="Evidence" onclick="window.open('${img}', '_blank')">`
                  )
                  .join("")
              : "<p>No evidence uploaded.</p>"
          }
        </div>
      </div>
    `;

    // Add subcomponents (history & feedback)
    this.historyComponent.render(submission.history, wrapper);
    this.feedbackComponent.render(submission.feedback, wrapper);

    return wrapper;
  }

  // Bind back button (prevents multiple listener duplication)
  bindBackButton(handler) {
    const wrapper = document.querySelector(".activity-details-wrapper");
    if (!wrapper) return;

    const button = wrapper.querySelector("#back-button");
    if (button) {
      button.onclick = () => handler();
    }
  }

  // Optional cleanup method
  clear() {
    const existing = document.querySelector(".activity-details-wrapper");
    if (existing) existing.remove();
  }
}
