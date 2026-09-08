const track = document.getElementById('track');
const dots = document.querySelectorAll('.dot');
const totalRealSlides = 3;
let currentIndex = 0;

function moveCarousel() {
  currentIndex++;

  // Aplica la transición normal de avance
  track.style.transition = 'transform 0.6s ease-in-out';
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  // Actualiza los puntos indicadores
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === (currentIndex % totalRealSlides));
  });

  // Cuando llega a la imagen clonada (índice 3)
  if (currentIndex === totalRealSlides) {
    setTimeout(() => {
      // Quita la animación y regresa instantáneamente a la foto 1 sin que se note
      track.style.transition = 'none';
      currentIndex = 0;
      track.style.transform = `translateX(0%)`;
    }, 600); // 600ms coincide con el tiempo de la animación CSS
  }
}

// Cambia automáticamente cada 3 segundos
setInterval(moveCarousel, 3000);