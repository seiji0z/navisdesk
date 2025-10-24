export class ActivitiesSummaryComponent {
  render(activities) {
    const container = document.createElement("div");
    container.id = "activities-cards";
    container.classList.add("activities-cards");

    activities.forEach((a) => {
      const card = document.createElement("div");
      card.classList.add("card");

      let icon = "";
      if (a.title === "Needs Attention")
        icon = '<i class="fa-solid fa-triangle-exclamation"></i>';
      else if (a.title === "Approved")
        icon = '<i class="fa-solid fa-check-circle"></i>';
      else if (a.title === "Rejected")
        icon = '<i class="fa-solid fa-xmark-circle"></i>';
      else if (a.title === "Pending")
        icon = '<i class="fa-solid fa-clock"></i>';

      card.innerHTML = `
        <div class="card-header">
          <h3>${a.title}</h3>
          ${icon}
        </div>
        <h1>${a.count}</h1>
        <p>${a.description}</p>
      `;
      container.appendChild(card);
    });

    return container;
  }
}
