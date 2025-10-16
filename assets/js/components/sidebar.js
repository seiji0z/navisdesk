const sidebarContainer = document.querySelector("#sidebar");
const role = sidebarContainer.getAttribute("data-role");

// determines which sidebar to load
let sidebarPath;

switch (role) {
  case "admin":
    sidebarPath = "../components/admin/sidebar.html";
    break;
  case "osas":
    sidebarPath = "../components/osas/sidebar.html";
    break;
  case "org":
    sidebarPath = "../components/org/sidebar.html";
    break;
  default:
    sidebarPath = "../components/sidebar.html";
    break;
}

fetch(sidebarPath)
  .then((response) => response.text())
  .then((data) => {
    sidebarContainer.innerHTML = data;

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
  .catch((error) => console.error("Sidebar failed to load:", error));