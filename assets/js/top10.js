const params = new URLSearchParams(window.location.search);
const genreId = params.get("genre-id");
const cardDeckEl = $("#cardDeck");

const genresListApi = `https://api.themoviedb.org/3/genre/movie/list?api_key=7c7537b799513b436eb6bed714d7edcc&language=en-US`;

// this one is to fetch data from any api link
const getDataFromApi = async (apiLink) => {
  const response = await fetch(apiLink);
  return response.json();
};

// this one is to get only 10 films out of tmdb
const getTop10Movies = async (genreId) => {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=7c7537b799513b436eb6bed714d7edcc&with_genres=${genreId}`;
  const movies = await getDataFromApi(url);
  console.log(movies);
  return movies.results.slice(0, 10);
};

// on load we get 10 films
const getTop10Tmdb = async () => {
  const topMovies = await getTop10Movies(genreId);
  for (let index = 0; index < topMovies.length; index++) {
    topMovies[index] = topMovies[index].id;
  }
  return topMovies;
};

// This is my code Fabian
const getPosters = async () => {
  const posters = await getTop10Movies(genreId);
  for (let index = 0; index < posters.length; index++) {
    posters[index] = [
      posters[index].poster_path,
      posters[index].title,
      posters[index].id,
    ];
  }
  console.log(posters);

  return posters;
};

// getTop10Tmdb();

const appendFilmDataToHTML = async () => {
  const arrayMovieData = await getPosters();
  for (let i = 0; i < arrayMovieData.length; i++) {
    console.log(arrayMovieData[i][2]);
    const index = i + 1;
    renderFilmCard(arrayMovieData[i][0], arrayMovieData[i][1], index);
  }
};

appendFilmDataToHTML();
// This renders the cards
const renderFilmCard = (imgLink, title, index) => {
  const cardEl = `<div class="custom-movie-container">
        <div class="custom-movie-card">
          <img
            src="https://image.tmdb.org/t/p/original/${imgLink}"
            alt="movie card test image"
            width="300px"
            height="400px"
          />
          <div class="custom-card-number">${index}</div>
          <div class="custom-wishlist-card"><a><i class="fa-solid fa-heart"></i></a></div>
          <div class="custom-watch-card"><a><i class="fa-solid fa-circle-play"></i></a></div>
          <div class="custom-card-name"><h3>${title}</h3></div>
        </div>
      </div>`;
  cardDeckEl.append(cardEl);
  console.log("hi");
};

// /* function 1 matching genre to id*/
// const matchGenreId = (genre) => {
//     const data = getDataFromApi(genresListApi);
//     for (let index = 0; index < data.length; index++) {
//        if (data[index].name === genre) {
//            return data[index].id;
//        }
//     }
// }

/* function 2 get the IMDB id from comparing to TMDB id*/

//This function is supposed to take a single tmdb id and return a single imdb id. 6977 --> tt423440

const getImdbIds = async () => {
  const tmdbIds = await getTop10Tmdb();
  const imdbIds = (
    await Promise.all(
      tmdbIds.map(async (x) => {
        const current = await getDataFromApi(
          `https://api.themoviedb.org/3/movie/${x}/external_ids?api_key=7c7537b799513b436eb6bed714d7edcc`
        );
        return current.imdb_id;
      })
    )
  ).filter((x) => x);
  console.log(imdbIds);
};
// getImdbIds();

/*select the table div*/
const table = document.getElementsByClassName("table")[0];
console.log(table);

/*Create Card Div JS*/
// function createCard(number) {
//   const card = document.createElement("div");
//   card.className = "card";
//   const topNumber = document.createElement("div");
//   topNumber.innerText = number;
//   const bottomNumber = document.createElement("div");
//   bottomNumber.className = "right";
//   bottomNumber.innerText = number;
//   card.append(topNumber);
//   card.append(bottomNumber);
//   return card;
// }

// table.appendChild(createCard(5));

/* Set the width of the sidebar to 250px (show it) */
function openNav() {
  document.getElementById("mySidepanel").style.width = "250px";
  document.getElementById("mySidepanel").style.height = "100%";
}

/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
  document.getElementById("mySidepanel").style.height = "0";
}
