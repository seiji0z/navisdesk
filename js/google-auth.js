async function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  const email = data.email.toLowerCase();
  console.log("Signed in:", data);

  try {
    // Load role mapping
    const res = await fetch("data/roles.json");
    const roles = await res.json();

    // Find role based on email
    const role = roles[email];

    if (!role) {
      alert(
        "Your account does not have an assigned role. Please contact support."
      );
      return;
    }

    // Store user info locally
    localStorage.setItem("userData", JSON.stringify(data));
    localStorage.setItem("userRole", role);

    // Redirect based on role
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
    }
  } catch (error) {
    console.error("Error loading roles.json:", error);
    alert("Error verifying role data. Please try again later.");
  }
}

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
