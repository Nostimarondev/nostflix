document.addEventListener("DOMContentLoaded", function () {
  // ==============================
  // 🎬 CARRUSEL DE PELÍCULAS
  // ==============================
  const arrows = document.querySelectorAll(".arrow");
  const movieLists = document.querySelectorAll(".movie-list");

  arrows.forEach((arrow, i) => {
    const movieList = movieLists[i];
    const itemNumber = movieList.querySelectorAll("img").length;
    let clickCounter = 0;

    arrow.addEventListener("click", () => {
      const ratio = Math.floor(window.innerWidth / 270);
      clickCounter++;
      const moveDistance = 300;

      if (itemNumber - (4 + clickCounter) + (4 - ratio) >= 0) {
        const currentTransform = movieList.style.transform.match(/-?\d+/);
        let currentX = currentTransform ? parseInt(currentTransform[0]) : 0;
        movieList.style.transform = `translateX(${currentX - moveDistance}px)`;
      } else {
        movieList.style.transform = "translateX(0)";
        clickCounter = 0;
      }
    });
  });

  // ==============================
  // 🎥 MODAL DE PELÍCULAS
  // ==============================
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalRating = document.getElementById("modal-rating");
  const modalCategory = document.getElementById("modal-category");
  const modalTrailerContainer = document.getElementById("modal-trailer-container");
  const modalDetalle = document.getElementById("modal-detalle");
  const modalOther = document.getElementById("modal-other");
  const closeBtn = document.querySelector(".close");
  const modalBody = document.querySelector(".modal-body");
  const verTrailerBtn = document.getElementById("ver-trailer-btn");


  let trailerVisible = false;
  let todasLasPeliculas = [];
  let currentPelicula = null;

  // ✅ Abrir modal con datos de la película
  function openModal(pelicula) {
    modal.style.display = "block";
    modalTitle.textContent = pelicula.titulo;
    modalDesc.textContent = pelicula.descripcion;
    modalRating.textContent = "⭐ " + (pelicula.puntuacion || "N/A");

    // 🔹 CORRECCIÓN: Mostrar todas las categorías
    modalCategory.textContent = pelicula.categorias && pelicula.categorias.length
      ? "Categorías: " + pelicula.categorias.join(", ")
      : "Categoría: N/A";

    modalDetalle.href = "detalle.php?id=" + pelicula.id;

    currentPelicula = pelicula;

    // limpiar y detener cualquier trailer anterior
    stopTrailer();
    modalTrailerContainer.style.display = "none";
    trailerVisible = false;

    // configurar el botón para llamar a toggleTrailer
    const verTrailerBtnLocal = document.getElementById("ver-trailer-btn");
    if (verTrailerBtnLocal) {
      verTrailerBtnLocal.innerHTML = `<i class="fa-brands fa-youtube"></i> Ver Trailer`;
      verTrailerBtnLocal.onclick = () => toggleTrailer();
    }

    // Fondo del modal
    modalBody.style.backgroundImage = `url('uploads/${pelicula.portada}')`;

    // 💫 Animación suave al cambiar de película dentro del modal
    modal.classList.remove("show");
    void modal.offsetWidth;
    modal.classList.add("show");

    const modalContent = modal.querySelector(".modal-content");
    modalContent.classList.add("modal-fade");
    setTimeout(() => modalContent.classList.remove("modal-fade"), 400);

    // Ocultar trailer
    modalTrailerContainer.style.display = "none";
    modalTrailerContainer.innerHTML = "";
    trailerVisible = false;

    // Miniaturas
    if (pelicula.otras && Array.isArray(pelicula.otras)) {
      todasLasPeliculas = pelicula.otras;
    }
    renderMiniaturas(todasLasPeliculas);
  }

  // 🎞️ Mostrar / ocultar trailer
  function toggleTrailer() {
    if (!currentPelicula) return;

    if (trailerVisible) {
      stopTrailer();
      trailerVisible = false;
      modalTrailerContainer.style.display = "none";
      const btn = document.getElementById("ver-trailer-btn");
      if (btn) btn.innerHTML = `<i class="fa-brands fa-youtube"></i> Ver Trailer`;
      return;
    }

    const url = currentPelicula.trailer || currentPelicula.url_trailer || "";
    if (url && url.includes("youtube")) {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        stopTrailer();
        const iframe = document.createElement("iframe");
        iframe.width = "100%";
        iframe.height = "400";
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        iframe.frameBorder = "0";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;

        modalTrailerContainer.appendChild(iframe);
        modalTrailerContainer.style.display = "block";
        const btn = document.getElementById("ver-trailer-btn");
        if (btn) btn.innerHTML = `<i class="fa-solid fa-xmark"></i> Cerrar Trailer`;
        trailerVisible = true;
      }
    } else {
      modalTrailerContainer.innerHTML = "<p style='color:#ccc;'>No hay tráiler disponible.</p>";
      modalTrailerContainer.style.display = "block";
    }
  }

  // 🎬 Renderizar las miniaturas del carrusel
  function renderMiniaturas(lista) {
    modalOther.innerHTML = "";
    lista.forEach((other) => {
      const div = document.createElement("div");
      div.classList.add("movie-list-item");
      div.innerHTML = `<img src="uploads/${other.portada}" alt="${other.titulo}">`;
      div.onclick = () => openModal(other);
      modalOther.appendChild(div);
    });
  }

  // Extraer ID de YouTube
  function extractYouTubeId(url) {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  }

  // Detener trailer
  function stopTrailer() {
    if (modalTrailerContainer) {
      modalTrailerContainer.innerHTML = "";
      modalTrailerContainer.style.display = "none";
    }
    trailerVisible = false;
  }

  // Cerrar modal
  closeBtn.onclick = () => {
    modal.style.display = "none";
    stopTrailer();
  };

  window.onclick = (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
      stopTrailer();
    }
  };

  // ==============================
  // 🎞️ MINI CARRUSEL DE "OTRAS PELÍCULAS"
  // ==============================
  const modalOtherWrapper = document.querySelector(".modal-other-wrapper");
  let leftArrow, rightArrow;

  if (modalOtherWrapper) {
    leftArrow = modalOtherWrapper.querySelector(".modal-other-arrow.left");
    rightArrow = modalOtherWrapper.querySelector(".modal-other-arrow.right");
  }

  let modalOtherOffset = 0;

  function updateModalOther() {
    if (!modalOtherWrapper) return;
    const modalOther = document.getElementById("modal-other");
    modalOther.style.transform = `translateX(${modalOtherOffset}px)`;
  }

  if (leftArrow && rightArrow) {
    leftArrow.addEventListener("click", () => {
      const modalOther = document.getElementById("modal-other");
      if (!modalOther.querySelector(".movie-list-item")) return;
      const itemWidth = modalOther.querySelector(".movie-list-item").offsetWidth + 15;
      modalOtherOffset += itemWidth * 2;
      if (modalOtherOffset > 0) modalOtherOffset = 0;
      updateModalOther();
    });

    rightArrow.addEventListener("click", () => {
      const modalOther = document.getElementById("modal-other");
      if (!modalOther.querySelector(".movie-list-item")) return;
      const itemWidth = modalOther.querySelector(".movie-list-item").offsetWidth + 15;
      const maxOffset = -(modalOther.scrollWidth - modalOtherWrapper.offsetWidth);
      modalOtherOffset -= itemWidth * 2;
      if (modalOtherOffset < maxOffset) modalOtherOffset = maxOffset;
      updateModalOther();
    });
  }

  function resetModalOtherOffset() {
    modalOtherOffset = 0;
    updateModalOther();
  }

  function filtrarPorCategoria(categoria) {
    const peliculasFiltradas = todasLasPeliculas.filter(p => p.categoria === categoria);
    renderMiniaturas(peliculasFiltradas);
  }

  // Exponer funciones globales
  window.openModal = openModal;
  window.resetModalOtherOffset = resetModalOtherOffset;
});
