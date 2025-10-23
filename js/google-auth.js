// Whitelisted users | To be manipulated by the ADMIN
const ALLOWED_EMAILS = [
  "2240084@slu.edu.ph",
  "2240853@slu.edu.ph",
  // may add here
];

async function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  const email = data.email.toLowerCase();

  console.log("Google sign-in data:", data);

  // Check ALLOWED_EMAILS against attempting email
  if (!ALLOWED_EMAILS.includes(email)) {
    alert("Access denied. This Google account is not authorized.");
    google.accounts.id.disableAutoSelect(); // Prevent auto signin
    return;
  }

  try {
    // Load roles mapping from roles.json
    const res = await fetch("data/roles.json");
    const roles = await res.json();

    // Match attemmpting user email to a role
    const role = roles[email];
    if (!role) {
      alert(
        "Your account does not have an assigned role. Please contact OSAS."
      );
      return;
    }

    // Save session locally?
    localStorage.setItem("userData", JSON.stringify(data));
    localStorage.setItem("userRole", role);

    // Redirect by role
    redirectToRolePage(role);
  } catch (error) {
    console.error("Error loading roles.json:", error);
    alert("Error verifying role data. Please try again later.");
  }
}

// Response decoder
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

// Redirect to appropriate pages
function redirectToRolePage(role) {
  switch (role) {
    case "admin":
      window.location.href = "user/admin/pages/dashboard.html";
      break;
    case "org":
      window.location.href = "user/org/pages/dashboard.html";
      break;
    case "osas":
      window.location.href = "user/osas/pages/dashboard.html";
      break;
    default:
      alert("Unknown role. Contact administrator.");
      localStorage.clear();
      window.location.href = "login.html";
  }
}
