function handleCredentialResponse(response) {
  fetch("server/auth/google.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential: response.credential }),
  })
    .then((res) => {
      if (!res.ok)
        return res.json().then((err) => {
          throw err;
        });
      return res.json();
    })
    .then((data) => {
      if (data.role === "admin") {
        window.location.href = "/user/admin/pages/dashboard.html";
      } else if (data.role === "osas") {
        window.location.href = "/user/osas/pages/dashboard.html";
      } else if (data.role === "org") {
        window.location.href = "/user/org/pages/dashboard.html";
      }
    })
    .catch((err) => {
      alert(err.error || "Login failed");
    });
}
