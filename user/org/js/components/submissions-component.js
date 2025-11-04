class SubmissionsComponent {
  constructor() {
    this.orgAbbreviation = "";
  }

  async init() {
    try {
      const response = await fetch("../../../server/php/get-student-orgs.php");
      if (!response.ok) throw new Error("Failed to fetch organization details");
      const orgs = await response.json();

      const myOrg = orgs.find((org) => org._id === ICON_ORG_ID);
      if (!myOrg) throw new Error("Organization not found");

      this.orgAbbreviation = myOrg.abbreviation;
    } catch (err) {
      console.error("Failed to fetch org details:", err);
    }
  }

  render(submissions, viewType = "cards") {
    if (viewType === "table") {
      return this.renderTable(submissions);
    } else {
      return this.renderCards(submissions);
    }
  }

  renderCards(submissions) {
    const container = document.createElement("div");
    container.classList.add("submission-cards");

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

      container.appendChild(card);
    });

    return container;
  }

  renderTable(submissions) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("submissions-table-wrapper");

    const table = document.createElement("table");
    table.classList.add("submissions-table");

    table.innerHTML = `
      <thead>
        <tr>
          <th>Activity</th>
          <th>Status</th>
          <th>Submitted</th>
          <th>Date</th>
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
            <td><span class="status-badge" style="${
              s.status === "Approved"
                ? "background-color:#22c55e;color:white;"
                : s.status === "Pending"
                ? "background-color:#facc15;color:black;"
                : s.status === "Needs Attention"
                ? "background-color:#ef4444;color:white;"
                : ""
            }">${s.status}</span></td>
            <td>${s.submittedDate}</td>
            <td>${s.date}</td>
            <td>${s.venue}</td>
            <td>${s.participants}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    `;
    wrapper.appendChild(table);
    return wrapper;
  }

  bindSubmissionClick(handler) {
    document.addEventListener("click", (e) => {
      const element = e.target.closest(".card, tr[data-id]");
      if (element && element.dataset.id) handler(parseInt(element.dataset.id));
    });
  }
}
