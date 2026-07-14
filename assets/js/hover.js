// Al hacer hover no se, no me da la gana



function hoverPelicula({
    id,
    titulo,
    descripcion,
    categoria,
    portada,
    trailer,
    puntuacion,
    otras
}){

}
let testing = false;
/* 
document.addEventListener('DOMContentLoaded', () => {
  const allToHover = document.querySelectorAll('[data-hoverable]');
  
  // Obtén la instancia de Swiper (asegúrate de inicializar Swiper antes)
  const swiperInstance = document.querySelector('.swiper')?.swiper;

  allToHover.forEach((card) => {
    let hoverDiv;
    let hoverTimeout;

    const showHoverDiv = () => {
      if (hoverDiv) return;

      const rect = card.getBoundingClientRect();

      hoverDiv = document.createElement('div');
      hoverDiv.className = 'hover-div';

      // Imagen del card
      const img = card.querySelector('img');
      if (img) {
        const imgClone = img.cloneNode(true);
        img.draggable = false;
        hoverDiv.appendChild(imgClone);
      }

      // Título del card
      const divContent = document.createElement('div');
      divContent.className = 'divContent';
      const title = card.querySelector('.movie-list-item-title');
      if(title){
        const p = document.createElement('p');
        p.innerHTML = title.innerHTML;
        divContent.appendChild(p);
      }
      hoverDiv.appendChild(divContent);

      // Posición relativa a la ventana y Swiper translateX
      let offsetX = 0;
      if(swiperInstance) offsetX = swiperInstance.translate || 0; // valor negativo

      hoverDiv.style.position = 'absolute';
      hoverDiv.style.top = (rect.top + window.scrollY) + 'px';
      hoverDiv.style.left = (rect.left + window.scrollX - offsetX) + 'px';
      hoverDiv.style.width = rect.width + 'px';
      hoverDiv.style.height = rect.height + 'px';
      hoverDiv.style.zIndex = 9999;

      // Agregar al body para evitar overflow hidden del Swiper
      document.body.appendChild(hoverDiv);

      // Animación tipo pop
      hoverDiv.style.transition = 'transform 0.3s ease';
      hoverDiv.style.transform = 'scale(0.95)';
      requestAnimationFrame(() => hoverDiv.style.transform = 'scale(1.2)');

      // Hover sobre el div evita que desaparezca
      hoverDiv.addEventListener('mouseover', () => clearTimeout(hoverTimeout));
      hoverDiv.addEventListener('mouseout', hideHoverDivWithDelay);
    };

    const hideHoverDivWithDelay = () => {
      hoverTimeout = setTimeout(() => {
        hoverDiv?.remove();
        hoverDiv = null;
      }, 100);
    };

    // Hover sobre el card original
    card.addEventListener('mouseover', () => {
      clearTimeout(hoverTimeout);
      showHoverDiv();
    });

    card.addEventListener('mouseout', hideHoverDivWithDelay);

    // Opcional: actualizar posición si arrastras el swiper
    if(swiperInstance){
      swiperInstance.on('setTranslate', () => {
        if(!hoverDiv) return;
        const rect = card.getBoundingClientRect();
        hoverDiv.style.left = (rect.left + window.scrollX - swiperInstance.translate) + 'px';
      });
    }
  });
});
 */