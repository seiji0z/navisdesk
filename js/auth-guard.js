export async function protectPage(expectedRole) {
  // Allow easy local development bypass on localhost

  // Normal auth behavior: ask server who the user is
  try {
    const res = await fetch("/server/auth/me.php", { credentials: "include" });
    if (!res.ok) {
      window.location.href = "/login.html";
      return;
    }

    const user = await res.json();
    if (!user.loggedIn || user.role !== expectedRole) {
      alert("Access denied!");
      window.location.href = "/login.html";
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    window.location.href = "/login.html";
  }
}
