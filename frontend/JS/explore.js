const API_URL = "http://127.0.0.1:5000";

let movies = [];

async function getExploreMovies() {
    try {
        const response = await fetch(`${API_URL}/api/movies/popular`);
        const result = await response.json();

        console.log(result);

        if (!result.success) {
            console.error(result.message);
            return;
        }

        // BACKGROUND
        const heroMovie = result.data.find(
            movie => movie.title === "Spider-Man: Brand New Day"
        );

        if (heroMovie) {

            const app = document.querySelector(".app");

            app.style.setProperty(
                "--app-background",
                `url("${heroMovie.backdrop_url}")`
            );
        }

        movies = result.data;

        displayMovies(movies);
        populateYears();
        populateRating();

    } catch (error) {
        console.error("Explore API error:", error);
    }
}


// DISPLAY MOVIES

function displayMovies(movieList) {

    const exploreMovies = document.getElementById("explore-movies");

    exploreMovies.innerHTML = "";

    movieList.slice(0, 10).forEach(movie => {

        const card = document.createElement("div");

        card.classList.add("movie-card");

        card.innerHTML = `
            <img 
                src="${movie.poster_url}" 
                alt="${movie.title}"
            >
        `;

        exploreMovies.appendChild(card);
    });
}


// FILTER BUTTONS

const allBtn = document.getElementById("all-btn");
const moviesBtn = document.getElementById("movies-btn");
const seriesBtn = document.getElementById("series-btn");
const searchInput = document.getElementById("movie-search");
const searchButton = document.querySelector(".search-box button");


allBtn.addEventListener("click", () => {
    displayMovies(movies);
});


moviesBtn.addEventListener("click", () => {
    const filteredMovies = movies.filter(movie => movie.type === "movie");

    displayMovies(filteredMovies);
});


seriesBtn.addEventListener("click", () => {
    const filteredSeries = movies.filter(movie => movie.type === "series");

    displayMovies(filteredSeries);
});

//GET GENRES 

async function getGenres() {
    try {
        const response = await fetch(`${API_URL}/api/genres`);

        const result = await response.json();

        console.log("genres:", result);

        const genreDropdown = document.getElementById("genre-dropdown");

        result.data.forEach(genre => {
            const option = document.createElement("option");

            option.value = genre.name;
            option.textContent = genre.name;

            genreDropdown.appendChild(option);
        });

    } catch (error) {
        console.error("Genre API error:", error);
    }

}

// GET MOVIES BY GENRE

async function getMoviesByGenre(genreId) {
    try {
        const response = await fetch(
            `${API_URL}/api/genres/${genreId}/movies`
        );

        const result = await response.json();

        console.log("Genre movies:", result);

        if (!result.success) {
            console.error(result.message);
            return;
        }

        displayMovies(result.data);

    } catch (error) {
        console.error("Genre movies API error:", error);
    }
}


//GET YEARS

function populateYears() {
    const yearsDropdown = document.getElementById("years-dropdown");

    const years = [...new Set(  //Remove duplicate years
        movies
            //Extract release years
            .map(function (movie) {
                return movie.release_date?.slice(0, 4);
            })
            //Remove missing years
            .filter(function (year) {
                return Boolean(year);
            })
    )].sort((a, b) => b - a);  // newest to oldest

    years.forEach(year => {
        const option = document.createElement("option");

        option.value = year;
        option.textContent = year;

        yearsDropdown.appendChild(option);
    });

}

// GET RATING

function populateRating() {
    const ratingDropdown = document.getElementById("rating-dropdown");

    for (let rating = 9; rating >= 1; rating--) {
        const option = document.createElement("option");

        option.value = rating;
        option.textContent = `${rating}+`;

        ratingDropdown.appendChild(option);
    }
}

// SEARCH MOVIES 

async function searchMovies() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (!searchTerm) {
        displayMovies(movies);
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/api/movies/search?query=${encodeURIComponent(searchTerm)}`
        );

        const result = await response.json();

        console.log("Search results:", result);

        if (!result.success) {
            console.error(result.message);
            return;
        }

        displayMovies(result.data);

    } catch (error) {
        console.error("Search error:", error);
    }
}

searchButton.addEventListener("click", searchMovies);

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchMovies();
    }
});

// ALL FILTERS

const genreDropdown = document.getElementById("genre-dropdown");
const yearsDropdown = document.getElementById("years-dropdown");
const ratingDropdown = document.getElementById("rating-dropdown");

function applyFilters() {
    let filteredMovies = movies;

    // Genre
    if (genreDropdown.value) {
        filteredMovies = filteredMovies.filter(movie =>
            movie.genres.includes(genreDropdown.value)
            
        );
    }

    // Year
    if (yearsDropdown.value) {
        filteredMovies = filteredMovies.filter(movie =>
            movie.release_date?.startsWith(yearsDropdown.value)
        );
    }

    // Rating
    if (ratingDropdown.value) {
        filteredMovies = filteredMovies.filter(movie =>
            movie.rating >= Number(ratingDropdown.value)
        );
    }

    displayMovies(filteredMovies);
}

genreDropdown.addEventListener("change", applyFilters);
yearsDropdown.addEventListener("change", applyFilters);
ratingDropdown.addEventListener("change", applyFilters);

getExploreMovies();
getGenres();
