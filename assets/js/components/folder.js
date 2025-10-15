export async function loadFolder(targetSelector, title) {
  try {
    const response = await fetch("../components/folder.html");
    if (!response.ok) throw new Error("Folder HTML not found");

    const html = await response.text();
    console.log("Folder HTML fetched:", html);

    const target = document.querySelector(targetSelector);
    target.innerHTML = html;

    document.querySelector(".folder-title").textContent = title;

    const dateElement = document.querySelector(".current-date");
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch (err) {
    console.error(err);
  }
}
