const API_URL = "http://127.0.0.1:5000";

let sessionId = localStorage.getItem("sessionId");
let favouriteMovies = [];

if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("sessionId", sessionId);
}

// BACKGROUND

async function getBackground() {
  try {
    const response = await fetch(`${API_URL}/api/movies/popular`);
    const result = await response.json();

    console.log(result);

    if (!result.success) {
      console.error(result.message);
      return;
    }

    const heroMovie = result.data.find(
      (movie) => movie.title === "Spider-Man: Brand New Day",
    );

    if (heroMovie) {
      const appBackground = document.querySelector(".app-background");

      appBackground.style.backgroundImage = `url("${heroMovie.backdrop_url}")`;
    }
  } catch (error) {
    console.error("Explore API error:", error);
  }
}


// SEARCH MOVIES 

const favSearch = document.getElementById("fav-search");
const favSearchBtn = document.getElementById("fav-search-btn");

function search() {
    const query = favSearch.value.trim();

    if (!query) return;

    window.location.href =
        `explore.html?search=${encodeURIComponent(query)}`;
}

favSearchBtn.addEventListener("click", search);

favSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        search();
    }
});


async function getFavourites() {
  try {
    const response = await fetch(`${API_URL}/api/favourites`, {
      headers: {
        "X-Session-Id": sessionId,
      },
    });

    const result = await response.json();

    console.log("Favourites:", result);

    if (!result.success) {
      console.error(result.message);
      return;
    }

    favouriteMovies = result.data;
    displayFavourites(favouriteMovies);
  } catch (error) {
    console.error("Favourites API error:", error);
  }
}

function displayFavourites(movieList) {
  const movieGrid = document.querySelector(".movie-grid");

  movieGrid.innerHTML = "";

  movieList.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
        <img src="${movie.poster_url}" alt="${movie.title}">
        <button class="favorite-btn" data-movie-id="${movie.tmdb_id}">❤️</button>
    `;

    movieGrid.appendChild(card);

    const favoriteBtn = card.querySelector(".favorite-btn");

    favoriteBtn.addEventListener("click", () => {
      removeFavourite(movie.tmdb_id);
    });
  });
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

    if (!result.success) {
      console.error(result.message);
      return;
    }

    getFavourites();
  } catch (error) {
    console.error("Remove favourite error:", error);
  }
}

const allBtn = document.querySelector(".fav-all");
const moviesBtn = document.querySelector(".fav-movies");
const seriesBtn = document.querySelector(".fav-series");
allBtn.classList.add("active");

function setActiveButton(button) {
  document.querySelectorAll(".type .btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  button.classList.add("active");
}

allBtn.addEventListener("click", () => {
  setActiveButton(allBtn);
  displayFavourites(favouriteMovies);
});

moviesBtn.addEventListener("click", () => {
  setActiveButton(moviesBtn);

  const movies = favouriteMovies.filter((movie) => movie.type === "movie");
  displayFavourites(movies);
});

seriesBtn.addEventListener("click", () => {
  setActiveButton(seriesBtn);

  const series = favouriteMovies.filter((movie) => movie.type === "series");
  displayFavourites(series);
});

getBackground();
getFavourites();
