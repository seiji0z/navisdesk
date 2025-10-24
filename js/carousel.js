const images = document.querySelectorAll(".carousel img");
let current = 0;

function showNext() {
  images[current].classList.remove("active");
  current = (current + 1) % images.length;
  images[current].classList.add("active");
}

setInterval(showNext, 4000);
