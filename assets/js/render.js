document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('db.json');
        const db = await response.json();
        
        const peliculas = db.peliculas;
        const categorias = db.categorias;
        const pelicula_categoria = db.pelicula_categoria;

        // Create a map for fast lookup of category names
        const catMap = {};
        categorias.forEach(c => catMap[c.id] = c.nombre);
        
        // Attach categories array to each movie and sort by ID descending (latest)
        peliculas.forEach(p => {
            p.categorias = pelicula_categoria
                .filter(pc => pc.id_pelicula === p.id)
                .map(pc => catMap[pc.id_categoria]);
            // Format puntuacion just in case
            p.puntuacion = p.puntuacion || "N/A";
        });

        // Determine if we are on index or categorias page
        const isIndex = document.getElementById('new-releases-container') !== null;
        
        if (isIndex) {
            renderIndex(peliculas, categorias);
        } else {
            renderCategorias(peliculas, categorias);
            initSearch(peliculas, categorias);
        }
        
    } catch (e) {
        console.error("Error loading db.json data:", e);
    }
});

// Global variable to store movie data for the modal
window.movieDataMap = {};

function getOtrasPeliculas(peliculas, excludeId) {
    return peliculas.filter(p => p.id !== excludeId).slice(0, 10);
}

function createMovieItemHTML(p, otrasPeliculas) {
    // Store data in global map to avoid inline JSON stringification issues in HTML attributes
    window.movieDataMap[p.id] = {
        id: p.id,
        titulo: p.titulo,
        descripcion: p.descripcion,
        categorias: p.categorias,
        portada: p.portada,
        trailer: p.url_trailer || "",
        puntuacion: p.puntuacion,
        otras: otrasPeliculas
    };

    return `
        <img class="movie-list-item-img" src="uploads/${p.portada}" alt="${p.titulo}">
        <span class="movie-list-item-title">${p.titulo}</span>
        <p class="movie-list-item-desc">${p.descripcion}</p>

        <button class="movie-list-item-button" onclick="window.openModal(window.movieDataMap[${p.id}])">
            Ver Trailer / Más Info
        </button>
    `;
}

function renderIndex(peliculas, categorias) {
    // 1. Featured 1 (Latest movie)
    let pRecomendada = peliculas.length > 0 ? peliculas[peliculas.length - 1] : null;
    if(pRecomendada) {
        const featured1 = document.getElementById('featured-1');
        featured1.className = 'featured-content';
        featured1.style.background = `linear-gradient(to bottom, rgba(0,0,0,0), #151515), url('uploads/${pRecomendada.portada}') center/cover no-repeat`;
        
        let html = `<p class="featured-desc">${pRecomendada.descripcion}</p>`;
        if(pRecomendada.url_trailer) {
            html += `<a class="featured-button" target="_blank" href="${pRecomendada.url_trailer}">Ver ${pRecomendada.titulo}</a>`;
        }
        featured1.innerHTML = html;
    }

    // 2. New Releases (Last 15 movies)
    const newReleases = [...peliculas].reverse().slice(0, 15);
    const newRelContainer = document.getElementById('new-releases-container');
    newReleases.forEach(p => {
        const div = document.createElement('div');
        div.className = 'swiper-slide movie-list-item';
        div.style.width = '270px';
        div.innerHTML = createMovieItemHTML(p, getOtrasPeliculas(peliculas, p.id));
        newRelContainer.appendChild(div);
    });

    // 3. Featured 2 (Highest rating)
    let pDestacada2 = [...peliculas].sort((a,b) => parseFloat(b.puntuacion || 0) - parseFloat(a.puntuacion || 0))[0];
    if(pDestacada2) {
        const featured2 = document.getElementById('featured-2');
        featured2.className = 'featured-content';
        featured2.style.background = `linear-gradient(to bottom, rgba(0,0,0,0), #151515), url('uploads/${pDestacada2.portada}') center/cover no-repeat`;
        
        let html = `<p class="featured-desc">${pDestacada2.descripcion}</p>`;
        if(pDestacada2.url_trailer) {
            html += `<a class="featured-button" target="_blank" href="${pDestacada2.url_trailer}">Ver ${pDestacada2.titulo}</a>`;
        }
        featured2.innerHTML = html;
    }

    // 4. Categories Carousels
    const targetCategories = ["Acción", "Comedia", "Ciencia Ficción", "Documental"];
    const catContainer = document.getElementById('categories-container');
    
    targetCategories.forEach(catName => {
        const catMovies = peliculas.filter(p => p.categorias.includes(catName)).slice(0, 10);
        if(catMovies.length > 0) {
            const section = document.createElement('div');
            section.className = 'movie-list-container';
            
            let html = `<h1 class="movie-list-title">${catName}</h1>
                        <div class="movie-list-wrapper">
                            <div class="movie-list">`;
            
            catMovies.forEach(p => {
                const itemHTML = createMovieItemHTML(p, getOtrasPeliculas(peliculas, p.id));
                html += `<div class="movie-list-item">${itemHTML}</div>`;
            });
            
            html += `</div></div>`;
            section.innerHTML = html;
            catContainer.appendChild(section);
        }
    });

    // Initialize swiper if needed
    if(typeof Swiper !== 'undefined') {
        new Swiper('.swiper', {
            slidesPerView: "auto",
            spaceBetween: 12
        });
    }
}

function renderCategorias(peliculas, categorias) {
    // Featured category item (highest rating)
    let pDestacada2 = [...peliculas].sort((a,b) => parseFloat(b.puntuacion || 0) - parseFloat(a.puntuacion || 0))[0];
    if(pDestacada2) {
        const featured = document.getElementById('featured-category');
        featured.className = 'featured-content';
        featured.style.background = `linear-gradient(to bottom, rgba(0,0,0,0), #151515), url('uploads/${pDestacada2.portada}')`;
        featured.style.backgroundRepeat = 'no-repeat';
        featured.style.backgroundPosition = 'center';
        featured.style.backgroundSize = 'cover';
        
        let html = `<img class="featured-title" src="assets/img/f-t-1.png" alt="">
                    <p class="featured-desc">${pDestacada2.descripcion}</p>`;
        if(pDestacada2.url_trailer) {
            html += `<a class="featured-button" target="_blank" href="${pDestacada2.url_trailer}" style="text-decoration:none">Ver ${pDestacada2.titulo}</a>`;
        }
        featured.innerHTML = html;
    }

    // Render all categories
    const container = document.getElementById('categories-page-container');
    
    categorias.forEach(cat => {
        const catMovies = peliculas.filter(p => p.categorias.includes(cat.nombre));
        if(catMovies.length > 0) {
            const section = document.createElement('div');
            section.className = 'movie-list-container';
            
            let html = `<h2 class="movie-list-title">${cat.nombre}</h2>
                        <div class="movie-list-wrapper">
                            <div class="movie-list">`;
            
            catMovies.forEach(p => {
                const itemHTML = createMovieItemHTML(p, getOtrasPeliculas(peliculas, p.id));
                html += `<div class="movie-list-item">${itemHTML}</div>`;
            });
            
            html += `</div></div>`;
            section.innerHTML = html;
            container.appendChild(section);
        }
    });
}

function initSearch(peliculas, categorias) {
    const filtersContainer = document.getElementById('search-categories-filters');
    categorias.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.dataset.category = cat.nombre;
        btn.textContent = cat.nombre;
        filtersContainer.appendChild(btn);
    });

    const searchIcon = document.getElementById("sidebar-search");
    const sidebar = document.getElementById("searchSidebar");
    const overlay = document.getElementById("searchOverlay");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");
    const categoryBtns = document.querySelectorAll(".category-btn");
    const containers = document.querySelectorAll(".movie-list-container");

    const savedQuery = localStorage.getItem("movieSearchQuery") || "";
    const savedCategory = localStorage.getItem("movieCategory") || "all";

    if (savedQuery || savedCategory !== "all") {
        applyFilters(savedQuery, savedCategory);
        searchInput.value = savedQuery;
        categoryBtns.forEach(b => b.classList.remove("active"));
        const activeBtn = document.querySelector(`.category-btn[data-category="${savedCategory}"]`);
        if(activeBtn) activeBtn.classList.add("active");
    }

    if(searchIcon) {
        searchIcon.addEventListener("click", () => {
            sidebar.classList.add("open");
            overlay.classList.add("active");
        });
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
    }

    if(closeSearch) closeSearch.addEventListener("click", closeSidebar);
    if(overlay) overlay.addEventListener("click", closeSidebar);

    if(searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase();
            const activeCatEl = document.querySelector(".category-btn.active");
            const activeCategory = activeCatEl ? activeCatEl.dataset.category : "all";
            applyFilters(query, activeCategory);
            localStorage.setItem("movieSearchQuery", query);
        });
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const selected = btn.dataset.category;
            const query = searchInput.value.toLowerCase();
            applyFilters(query, selected);
            localStorage.setItem("movieCategory", selected);
        });
    });

    function applyFilters(query, category) {
        const containers = document.querySelectorAll(".movie-list-container");
        containers.forEach(container => {
            const h2 = container.querySelector("h2");
            const catName = h2 ? h2.textContent.trim() : "";
            const items = container.querySelectorAll(".movie-list-item");
            let anyVisible = false;

            items.forEach(item => {
                const titleEl = item.querySelector(".movie-list-item-title");
                if(!titleEl) return;
                const title = titleEl.textContent.toLowerCase();
                const matchesQuery = title.includes(query);
                const matchesCategory = category === "all" || catName === category;
                const visible = matchesQuery && matchesCategory;
                item.style.display = visible ? "block" : "none";
                if (visible) anyVisible = true;
            });

            container.style.display = anyVisible ? "block" : "none";
        });
    }

    window.addEventListener("beforeunload", () => {
        localStorage.removeItem("movieSearchQuery");
        localStorage.removeItem("movieCategory");
    });
}
