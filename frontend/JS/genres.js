const API_URL = "http://127.0.0.1:5000";


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

      appBackground.style.backgroundImage =
        `url("${heroMovie.backdrop_url}")`;
    }
  } catch (error) {
    console.error("Genre background API error:", error);
  }
}

// SEARCH MOVIES 

const genreSearch = document.getElementById("genre-search");
const genreSearchBtn = document.getElementById("genre-search-btn");

function search() {
    const query = genreSearch.value.trim();

    if (!query) return;

    window.location.href =
        `explore.html?search=${encodeURIComponent(query)}`;
}

genreSearchBtn.addEventListener("click", search);

genreSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        search();
    }
});


async function getGenres() {
    try {
        const response = await fetch(`${API_URL}/api/genres`);
        const result = await response.json();

        console.log("Genres:", result);

        if (!result.success) {
            console.error(result.message);
            return;
        }

        connectGenres(result.data);

    } catch (error) {
        console.error("Genres API error:", error);
    }
}

function connectGenres(genreList) {
    const genreBoxes = document.querySelectorAll(".genre-box");

    const genreNameMap = {
        "Sci-Fi": "Science Fiction",
        "Historical": "History",
    };

    genreBoxes.forEach(box => {
        const genreName = box.querySelector("p").textContent.trim();

        // Convert frontend name to backend name if needed
        const backendGenreName = genreNameMap[genreName] || genreName;

        const genre = genreList.find(
            item =>
                item.name.toLowerCase() ===
                backendGenreName.toLowerCase()
        );

        if (!genre) {
            console.warn(`Genre not found: ${genreName}`);
            return;
        }

        box.addEventListener("click", () => {
            window.location.href = `explore.html?genre=${genre.id}`;
        });

        box.style.cursor = "pointer";
    });
}

getBackground();
getGenres();