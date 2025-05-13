const buildingButton = document.querySelector(".BUILDING-UI.wrapper");

document
  .querySelector(".BUILDING-UI.wrapper span.label")
  .addEventListener("click", function (e) {
    if (buildingButton.classList.contains("active")) {
      buildingButton.classList.remove("active");
      buildingButton.classList.add("inactive");
    } else {
      buildingButton.classList.remove("inactive");
      buildingButton.classList.add("active");
    }
  });
