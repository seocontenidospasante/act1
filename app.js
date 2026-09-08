const track = document.getElementById('track');
const dots = document.querySelectorAll('.dot');
const totalRealSlides = 3;
let currentIndex = 0;

function moveCarousel() {
  currentIndex++;

  
  track.style.transition = 'transform 0.6s ease-in-out';
  track.style.transform = `translateX(-${currentIndex * 100}%)`;


  
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === (currentIndex % totalRealSlides));
  });

  
  if (currentIndex === totalRealSlides) {
    setTimeout(() => {
      
      track.style.transition = 'none';
      currentIndex = 0;
      track.style.transform = `translateX(0%)`;
    }, 600); 
  }
}


setInterval(moveCarousel, 3000);