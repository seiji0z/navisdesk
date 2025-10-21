export class SubmissionHistoryComponent {
  render(history = [], parent) {
    const section = document.createElement("div");
    section.classList.add("details-section", "white-section", "scrollable");
    section.innerHTML = `<h3>Submission History</h3>`;

    const container = document.createElement("div");
    container.classList.add("history-container");

    if (history.length) {
      history.forEach((h, index) => {
        const versionCard = document.createElement("div");
        versionCard.classList.add("history-card");
        versionCard.innerHTML = `
          <div class="history-header">
            <strong>Version ${index + 1}</strong> <span>${h.date}</span>
          </div>
          <div class="history-details">
            <p><strong>Status:</strong> ${h.status}</p>
            <p><strong>Remarks:</strong> ${h.remarks || "—"}</p>
          </div>
        `;
        container.appendChild(versionCard);
      });
    } else {
      container.innerHTML = `<div class="empty-text">No previous versions available.</div>`;
    }

    section.appendChild(container);
    parent.appendChild(section);
  }
}
