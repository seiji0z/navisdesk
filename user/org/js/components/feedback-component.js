export class FeedbackComponent {
  render(feedback, parent) {
    const section = document.createElement("div");
    section.classList.add("details-section", "white-section", "scrollable");
    section.innerHTML = `<h3>Feedback</h3>`;

    const container = document.createElement("div");
    container.classList.add("feedback-container");

    if (feedback?.length) {
      feedback.forEach((f) => {
        const card = document.createElement("div");
        card.classList.add("feedback-card");
        card.innerHTML = `
          <div class="feedback-header">
            <strong>${f.reviewer}</strong> <span>• ${f.date}</span>
          </div>
          <div class="feedback-comment">${f.comment}</div>
        `;
        container.appendChild(card);
      });
    } else {
      container.innerHTML = `<div class="empty-text">No feedback yet.</div>`;
    }

    section.appendChild(container);
    parent.appendChild(section);
  }
}
