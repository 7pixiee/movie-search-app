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

            option.value = genre.id;
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

const genreDropdown = document.getElementById("genre-dropdown");

genreDropdown.addEventListener("change", () => {
    const genreId = genreDropdown.value;

    if (!genreId) {
        displayMovies(movies);
        return;
    }

    getMoviesByGenre(genreId);
});

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

//GET MOVIES BY YEARS 

const yearsDropdown = document.getElementById("years-dropdown");

yearsDropdown.addEventListener("change", () => {
    const selectedYear = yearsDropdown.value;

    if (!selectedYear) {
        displayMovies(movies);
        return;
    }

    const filteredMovies = movies.filter(movie =>
        movie.release_date?.startsWith(selectedYear)
    );

    displayMovies(filteredMovies);
})

// GET RATING

function populateRating() {
    const ratingDropdown = document.getElementById("rating-dropdown");

    for(let rating = 9; rating >= 1; rating--){
        const option = document.createElement("option");

        option.value = rating;
        option.textContent = `${rating}+`;

        ratingDropdown.appendChild(option);
    }
}

//GET MOVIES BY RATING

const ratingDropdown = document.getElementById("rating-dropdown");

ratingDropdown.addEventListener("change", ()=> {
    const selectRating = ratingDropdown.value;

    if(!selectRating) {
       displayMovies(movies);
       return;
    }

    const filteredMovies = movies.filter(movie =>
         movie.rating >= Number(selectRating)
    );

    displayMovies(filteredMovies)
})

getExploreMovies();
getGenres();
