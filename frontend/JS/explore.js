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

async function getYears() {
    try {
        const response = await fetch(`${API_URL}/api/years`);

        const result = await response.json();

        console.log("years:", result);

        const yearDropdown = document.getElementById("years-dropdown");

        result.data.forEach(year => {
            const option = document.createElement("option");

            option.value = year.id;
            option.textContent = year.name;

            yearDropdown.appendChild(option);
        });

    } catch (error) {
        console.error("Years API error:", error);
    }

}


//GET MOVIES BY YEARS 
async function getMoviesByYears(yearId) {
    try {
    const response = await fetch(`
        ${API_URL}/api/years/${yearId}/movies`
    );

    const result = response.json();

    console.log("Years Movies:", result);

    if(!result.success){
        console.error("error.message");
        return;
    }

    displayMovies(result.data);
    }
    catch(error){
         console.error("Years movies API error:", error);
    }
}

const yearsDropdown = document.getElementById("years-dropdown");

yearsDropdown.addEventListener("change", () =>{
   const yearId = yearsDropdown.value;

    if (!yearId) {
        displayMovies(movies);
        return;
    }

    getMoviesByYear(yearId);
})

getExploreMovies();
getGenres();
getYears();