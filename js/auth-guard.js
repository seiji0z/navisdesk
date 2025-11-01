export async function protectPage(expectedRole) {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });

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
