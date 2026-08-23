const API_URL = "http://127.0.0.1:5000";


//  GET POPULAR MOVIES
async function getPopularMovies() {
    const response = await fetch(`${API_URL}/api/movies/popular`);

    const result = await response.json();

    //  FOR HERO BANNER
    const heroMovie = result.data.find(
        movie => movie.title === "Spider-Man: Brand New Day"
    );

    if (heroMovie) {

        const app = document.querySelector(".app");

        app.style.setProperty(
            "--app-background",
            `url("${heroMovie.backdrop_url}")`
        );

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

        card.innerHTML = `
    <img src="${movie.poster_url}" alt="${movie.title}">
    `;

        popularMovies.appendChild(card);
    });

}

// GET LATEST MOVIES 

async function getLatestMovies() {
    const response = await fetch(`${API_URL}/api/movies/latest`);

    const result = await response.json();

    const latestMovies = document.getElementById("latest-movies")

     result.data.slice(0, 5).forEach(movie => {
        const card = document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `
    <img src="${movie.poster_url}" alt="${movie.title}">
    `;

        latestMovies.appendChild(card);
    });


}

getPopularMovies();

getLatestMovies();