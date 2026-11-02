const track = document.querySelector(".carousel-track");

const slides = document.querySelectorAll(".hero-slide");

const dots = document.querySelectorAll(".dot");

const nextBtn = document.getElementById("nextBtn");

const prevBtn = document.getElementById("prevBtn");


let currentIndex = 0;

let autoSlide;


/* =========================
   SHOW SLIDE
========================= */

function showSlide(index) {

    if (index >= slides.length) {
        currentIndex = 0;
    }

    else if (index < 0) {
        currentIndex = slides.length - 1;
    }

    else {
        currentIndex = index;
    }


    track.style.transform =
        `translateX(-${currentIndex * 100}%)`;


    dots.forEach((dot) => {
        dot.classList.remove("active");
    });


    dots[currentIndex].classList.add("active");
}


/* =========================
   NEXT
========================= */

function nextSlide() {

    showSlide(currentIndex + 1);

}


/* =========================
   PREVIOUS
========================= */

function previousSlide() {

    showSlide(currentIndex - 1);

}


/* =========================
   BUTTONS
========================= */

nextBtn.addEventListener("click", () => {

    nextSlide();

    restartAutoSlide();

});


prevBtn.addEventListener("click", () => {

    previousSlide();

    restartAutoSlide();

});


/* =========================
   DOTS
========================= */

dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        showSlide(index);

        restartAutoSlide();

    });

});


/* =========================
   AUTO SLIDE
========================= */

function startAutoSlide() {

    autoSlide = setInterval(() => {

        nextSlide();

    }, 5000);

}


function restartAutoSlide() {

    clearInterval(autoSlide);

    startAutoSlide();

}


startAutoSlide();