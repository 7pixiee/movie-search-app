const API_URL = "https://nyxflix-api.vercel.app";

// SEARCH MOVIES 

const homeSearch = document.getElementById("home-search");
const homeSearchBtn = document.getElementById("home-search-btn");

function searchFromHome() {
    const query = homeSearch.value.trim();

    if (!query) return;

    window.location.href =
        `explore.html?search=${encodeURIComponent(query)}`;
}

homeSearchBtn.addEventListener("click", searchFromHome);

homeSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchFromHome();
    }
});

//  GET POPULAR MOVIES
async function getPopularMovies() {
    const response = await fetch(`${API_URL}/api/movies/popular`);

    const result = await response.json();

    //  FOR HERO BANNER
    const heroMovie = result.data.find(
        movie => movie.title === "Spider-Man: Brand New Day"
    );

    if (heroMovie) {

        const appBackground = document.querySelector(".app-background");

       appBackground.style.backgroundImage = `url("${heroMovie.backdrop_url}")`;

        const heroImage = document.querySelector(".hero-img");
        const heroName = document.querySelector(".movie-name");
        const heroGenre = document.querySelector(".movie-genre");

        heroImage.style.backgroundImage = `url("${heroMovie.backdrop_url}")`;
        heroName.textContent = heroMovie.title;
        heroGenre.textContent = heroMovie.genres.join(" • ");
    }

    const popularMovies = document.getElementById("popular-movies")

    // MOVIE CARDS
result.data.slice(0, 5).forEach(movie => {

    const card = document.createElement("div");
    card.classList.add("movie-card");

    if (movie.poster_url) {
        card.innerHTML = `
            <img src="${movie.poster_url}" alt="${movie.title}">
        `;
    } else {
        card.innerHTML = `
            <div class="no-poster">
                <span>🎬</span>
                <p>No Poster Available</p>
            </div>
        `;
    }

    popularMovies.appendChild(card);
});

}

// GET LATEST MOVIES 

async function getLatestMovies() {
    const response = await fetch(`${API_URL}/api/movies/latest`);

    const result = await response.json();

    const latestMovies = document.getElementById("latest-movies")

     result.data.slice(0, 5).forEach(movie=> {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    if (movie.poster_url) {
        card.innerHTML = `
            <img src="${movie.poster_url}" alt="${movie.title}">
        `;
    } else {
        card.innerHTML = `
            <div class="no-poster">
                <span>🎬</span>
                <p>No Poster Available</p>
            </div>
        `;
    }

    latestMovies.appendChild(card);
});

}

getPopularMovies();

getLatestMovies();