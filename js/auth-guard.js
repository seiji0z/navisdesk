function protectPage(expectedRole) {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userRole = localStorage.getItem("userRole");

  // Redirect if not logged in
  if (!userData || !userRole) {
    window.location.href = "../../../login.html";
    return;
  }

  // Block if wrong role
  if (userRole !== expectedRole) {
    alert("Access denied!");
    window.location.href = "../../../login.html";
    return;
  }

  console.log(`Welcome, ${userData.name} (${userRole})`);
  document.body.insertAdjacentHTML(
    "beforeend",
    `<p>Welcome, ${userData.name} (${userRole.toUpperCase()})</p>`
  );
}
