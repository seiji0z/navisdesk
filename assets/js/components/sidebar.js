fetch("../components/sidebar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("sidebar").innerHTML = data;

    const toggleBtn = document.getElementById("toggle-btn");
    const sidenav = document.querySelector(".sidenav");

    if (toggleBtn && sidenav) {
      toggleBtn.addEventListener("click", () => {
        sidenav.classList.toggle("collapsed");
      });
    }
  })
  .catch((error) => console.error("Sidebar failed to load:", error));