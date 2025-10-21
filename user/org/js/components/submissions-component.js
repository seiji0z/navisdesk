export class SubmissionsComponent {
  render(submissions) {
    this.container = document.createElement("div");
    this.container.id = "submission-cards";
    this.container.classList.add("submission-cards");

    submissions.forEach((s) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.id = s.id;

      const statusColor =
        s.status === "Approved"
          ? "background-color:#22c55e;color:white;"
          : s.status === "Pending"
          ? "background-color:#facc15;color:black;"
          : s.status === "Needs Attention"
          ? "background-color:#ef4444;color:white;"
          : "";

      card.innerHTML = `
        <div class="card-header">
          <h3>${s.activity}</h3>
          <span class="status-badge" style="${statusColor}">${s.status}</span>
        </div>
        <p class="card-description">${s.description}</p>
        <p class="card-date">Submitted: ${s.submittedDate}</p>
      `;

      this.container.appendChild(card);
    });

    return this.container;
  }

  bindSubmissionClick(handler) {
    this.container.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      if (card && card.dataset.id) handler(parseInt(card.dataset.id));
    });
  }
}
