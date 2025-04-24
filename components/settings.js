const settingsPanel = document.querySelector(".SETTINGS");
const openButton = document.querySelector(" .image.open");
const closeButton = document.querySelector(" .image.close");

openButton.addEventListener("click", () => {
  settingsPanel.classList.remove("inactive");
  settingsPanel.classList.add("active");
  openButton.classList.remove("active");
  openButton.classList.add("inactive");
  closeButton.classList.remove("inactive");
  closeButton.classList.add("active");
});

closeButton.addEventListener("click", () => {
  settingsPanel.classList.remove("active");
  settingsPanel.classList.add("inactive");
  openButton.classList.add("active");
  openButton.classList.remove("inactive");
  closeButton.classList.remove("active");
  closeButton.classList.add("inactive");
  console.log(openButton, openButton.classList);
});
