function setCurrentDate() {
  const dateElement = document.querySelector(".current-date");
  if (!dateElement) return;

  const today = new Date();
  dateElement.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

async function loadFolder(targetSelector, title) {
  try {
    const response = await fetch("../components/folder.html");
    if (!response.ok) throw new Error("Folder HTML not found");

    const html = await response.text();
    const target = document.querySelector(targetSelector);
    target.innerHTML = html;

    setFolderTitle(title);
    setCurrentDate();
  } catch (err) {
    console.error(err);
  }
}
