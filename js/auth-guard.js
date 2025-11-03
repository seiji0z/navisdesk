/*
export async function protectPage(expectedRole) {
  try {
    const res = await fetch("/server/auth/me.php", {
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
*/

  export async function protectPage(expectedRole) {
  // --- TEMP BYPASS FOR LOCAL TESTING ---
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    console.log("Bypassing auth guard (local mode)");
    return;
  }

  // --- NORMAL AUTH BEHAVIOR ---
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
