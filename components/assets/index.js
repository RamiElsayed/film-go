const btnEl = document.querySelector("#play");
const videoContainerEl = document.querySelector(".video-container");
const close = document.querySelector(".close");

btnEl.addEventListener("click", () => {
  videoContainerEl.classList.add("show");
});

close.addEventListener("click", () => {
  videoContainerEl.classList.remove("show");
});
