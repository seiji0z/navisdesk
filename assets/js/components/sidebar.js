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

    // highlight active sidebar link
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split("/").pop();
    const links = sidebar.querySelectorAll("nav a");

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const hrefFile = href.split("/").pop();

      if (currentPage === hrefFile) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // ✅ Update current date after sidebar loads
    updateCurrentDate();
  })
  .catch((error) => console.error("Sidebar failed to load:", error));

// ✅ Function to display current date
function updateCurrentDate() {
  const dateElement = document.querySelector(".current-date");
  if (dateElement) {
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    dateElement.textContent = today.toLocaleDateString("en-US", options);
  }
}
