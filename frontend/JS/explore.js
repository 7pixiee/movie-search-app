const API_URL = "https://nyxflix-api.vercel.app";

const urlParams = new URLSearchParams(window.location.search);
const selectedGenre = urlParams.get("genre");
const searchQuery = urlParams.get("search");

let sessionId = localStorage.getItem("sessionId");

if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("sessionId", sessionId);
}

let movies = [];
let favouriteMovies = new Set();
let currentPage = 1;
let totalPages = 1;

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
      (movie) => movie.title === "Spider-Man: Brand New Day",
    );

    if (heroMovie) {
      const appBackground = document.querySelector(".app-background");

     appBackground.style.backgroundImage = `url("${heroMovie.backdrop_url}")`;
    }

    currentPage = result.page;
    totalPages = result.total_pages;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    movies = result.data;

    displayMovies(movies);
  } catch (error) {
    console.error("Explore API error:", error);
  }
}

// GET FAVORITES

async function getFavourites() {
    try {
        const response = await fetch(
            `${API_URL}/api/favourites`,
            {
                headers: {
                    "X-Session-Id": sessionId
                }
            }
        );

        const result = await response.json();

        console.log("Favourites:", result);

        if (!result.success) {
            console.error(result.message);
            return;
        }

        result.data.forEach(movie => {
            favouriteMovies.add(movie.tmdb_id);
        });

    } catch (error) {
        console.error("Favourites API error:", error);
    }
}

// DISPLAY MOVIES

function displayMovies(movieList) {
  const exploreMovies = document.getElementById("explore-movies");

  exploreMovies.innerHTML = "";

  movieList.forEach((movie) => {
    const card = document.createElement("div");

    card.classList.add("movie-card");

    card.innerHTML = `
    <img 
        src="${movie.poster_url}" 
        alt="${movie.title}"
    >
    <button class="favorite-btn" data-movie-id="${movie.tmdb_id}">
      ${favouriteMovies.has(movie.tmdb_id) ? "❤️" : "❤"}
    </button>
`;

    exploreMovies.appendChild(card);

    const favoriteBtn = card.querySelector(".favorite-btn");

    favoriteBtn.addEventListener("click", async () => {
      const movieId = movie.tmdb_id;

      if (favouriteMovies.has(movieId)) {
        await removeFavourite(movieId);
        favouriteMovies.delete(movieId);
        favoriteBtn.textContent = "❤";
      } else {
        await addFavourite(movieId);
        favouriteMovies.add(movieId);
        favoriteBtn.textContent = "❤️";
      }
    });
  });
}

// FAVORITES

async function addFavourite(movieId) {
  try {
    const response = await fetch(`${API_URL}/api/favourites/${movieId}`, {
      method: "POST",
      headers: {
        "X-Session-Id": sessionId,
      },
    });

    const result = await response.json();

    console.log("Add favourite:", result);
  } catch (error) {
    console.error("Favourite error:", error);
  }
}

async function removeFavourite(movieId) {
  try {
    const response = await fetch(`${API_URL}/api/favourites/${movieId}`, {
      method: "DELETE",
      headers: {
        "X-Session-Id": sessionId,
      },
    });

    const result = await response.json();

    console.log("Remove favourite:", result);
  } catch (error) {
    console.error("Remove favourite error:", error);
  }
}

// FILTER BUTTONS

const allBtn = document.getElementById("all-btn");
const moviesBtn = document.getElementById("movies-btn");
const seriesBtn = document.getElementById("series-btn");
const searchInput = document.getElementById("movie-search");
const searchButton = document.querySelector(".search-box button");

function setActiveButton(button) {
    document.querySelectorAll(".type .btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");
}

allBtn.classList.add("active");

allBtn.addEventListener("click", () => {
    setActiveButton(allBtn);
    displayMovies(movies);
});

moviesBtn.addEventListener("click", () => {
    setActiveButton(moviesBtn);

    const filteredMovies = movies.filter(movie => movie.type === "movie");
    displayMovies(filteredMovies);
});

seriesBtn.addEventListener("click", () => {
    setActiveButton(seriesBtn);

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

    result.data.forEach((genre) => {
      const option = document.createElement("option");

      option.value = genre.id;
      option.textContent = genre.name;

      genreDropdown.appendChild(option);
    });

    // Select genre coming from Genres page
    if (selectedGenre) {
        genreDropdown.value = selectedGenre;
        updateFilterStyle(genreDropdown);
    }
  } catch (error) {
    console.error("Genre API error:", error);
  }
}

// GET MOVIES BY GENRE

async function getMoviesByGenre(genreId) {
  try {
    const response = await fetch(`${API_URL}/api/genres/${genreId}/movies`);

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

  const currentYear = new Date().getFullYear();

  for (let year = currentYear; year >= 1950; year--) {
    const option = document.createElement("option");

    option.value = year;
    option.textContent = year;

    yearsDropdown.appendChild(option);
  }
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
      `${API_URL}/api/movies/search?query=${encodeURIComponent(searchTerm)}`,
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

async function applyFilters() {
  const genre = genreDropdown.value || selectedGenre;
  const year = yearsDropdown.value;
  const rating = ratingDropdown.value;

  const params = new URLSearchParams();

  params.append("page", currentPage);

  if (genre) {
    params.append("genre", genre);
  }

  if (year) {
    params.append("year", year);
  }

  if (rating) {
    params.append("rating", rating);
  }

  try {
    const response = await fetch(
      `${API_URL}/api/movies/popular?${params.toString()}`,
    );

    const result = await response.json();

    console.log("Filtered results:", result);

    if (!result.success) {
      console.error(result.message);
      return;
    }

    currentPage = result.page;
    totalPages = result.total_pages;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    previousBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    movies = result.data;
    displayMovies(movies);
  } catch (error) {
    console.error("Filter error:", error);
  }
}

function updateFilterStyle(select) {
    const container = select.closest(".btn");

    if (select.value) {
        container.classList.add("filter-active");
    } else {
        container.classList.remove("filter-active");
    }
}

genreDropdown.addEventListener("change", () => {
    currentPage = 1;
    updateFilterStyle(genreDropdown);
    applyFilters();
});

yearsDropdown.addEventListener("change", () => {
    currentPage = 1;
    updateFilterStyle(yearsDropdown);
    applyFilters();
});

ratingDropdown.addEventListener("change", () => {
    currentPage = 1;
    updateFilterStyle(ratingDropdown);
    applyFilters();
});


// PAGINATION

const previousBtn = document.querySelector(".previous");
const nextBtn = document.querySelector(".next");
const pageInfo = document.getElementById("page-info");

previousBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    applyFilters();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    applyFilters();
  }
});

async function initializeExplore() {
    await getFavourites();

    getGenres();
    populateYears();
    populateRating();

    if (searchQuery) {
        searchInput.value = searchQuery;
        await searchMovies();
    } else {
        await getExploreMovies();
    }
}

initializeExplore();