async function protectPage(expectedRole) {
  // Allow easy local development bypass on localhost
  // Normal auth behavior: ask server who the user is
  try {
    const res = await fetch("/server/auth/me.php", { credentials: "include" });
    if (!res.ok) {
      // Not authenticated - redirect to login
      window.location.href = "/login.html";
      return null;
    }

    const user = await res.json();
    if (!user.loggedIn || user.role !== expectedRole) {
      alert(
        `Access denied! This page is only accessible to ${expectedRole} users.`
      );
      window.location.href = "/login.html";
      return null;
    }

    // Return the user object so pages can use it (e.g. display name)
    return user;
  } catch (error) {
    console.error("Auth check failed:", error);
    window.location.href = "/login.html";
    return null;
  }
}
