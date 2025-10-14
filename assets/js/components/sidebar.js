fetch("../components/sidebar.html")
  .then((response) => response.text())
  .then((data) => {
    document.querySelector("#sidebar").innerHTML = data;

    const toggleBtn = document.querySelector(".toggle-btn");
    const sidebar = document.querySelector(".sidebar");
    const main = document.querySelector(".main");

    if (toggleBtn && sidebar && main) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        main.classList.toggle("collapsed-sidebar");
      });
    }
  })
  .catch((error) => console.error("sidebar failed to load:", error));
