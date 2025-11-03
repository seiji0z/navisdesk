async function handleCredentialResponse(response) {
  try {
    // ---- STORE TOKEN IN HTTP-ONLY COOKIE (via Set-Cookie) ----
    document.cookie = `google_token=${response.credential}; path=/; SameSite=Lax`;

    const res = await fetch("/server/php/auth/google.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Login failed");
      google.accounts.id.disableAutoSelect(); // Prevent auto sign-in
      return;
    }

    const { role } = await res.json();
    redirectToRolePage(role);
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    alert("Error verifying credentials. Please try again.");
  }
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
      window.location.href = "login.html";
  }
}
