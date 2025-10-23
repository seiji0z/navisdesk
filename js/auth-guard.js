function protectPage(expectedRole) {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userRole = localStorage.getItem("userRole");
  const LOGIN_PAGE = window.location.origin + "/login.html";
  window.location.href = LOGIN_PAGE;

  // Redirect if not logged in
  if (!userData || !userRole) {
    window.location.href = LOGIN_PAGE;
    return;
  }

  // Block if wrong role
  if (userRole !== expectedRole) {
    alert("Access denied!");
    window.location.href = LOGIN_PAGE;
    return;
  }

  console.log(`Welcome, ${userData.name} (${userRole})`);
  document.body.insertAdjacentHTML(
    "beforeend",
    `<p>Welcome, ${userData.name} (${userRole.toUpperCase()})</p>`
  );
}
