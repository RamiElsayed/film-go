const params = new URLSearchParams(window.location.search);
const genreId = params.get("genre-id");
const cardDeckEl = $("#cardDeck");
const trailerEl = $("#trailerVideo");
const sideBarEL = $("#mySidepanel");

const genresListApi = `https://api.themoviedb.org/3/genre/movie/list?api_key=7c7537b799513b436eb6bed714d7edcc&language=en-US`;
// Play video
window.addEventListener("load", async function () {
  const btnEl = document.querySelector("#play");

  const videoContainerEl = document.querySelector(".video-container");

  cardDeckEl.on("click", async function (event) {
    const target = event.target;

    if (target.id.toLowerCase() === "play") {
      const trailerUrl = target.attributes.trailer.nodeValue;
      trailerEl.attr("src", trailerUrl);
      videoContainerEl.classList.add("show");
    }

    if (target.id.toLowerCase() === "addtowishlist") {
      const movieTitleAttrID = target.attributes.movieid.nodeValue;
      const movieTitleAttrTitle = target.attributes.title.nodeValue;
      const movieArray = [movieTitleAttrID, movieTitleAttrTitle];
      const wishListTitlesOne = JSON.parse(localStorage.getItem("wishList"));
      console.log(wishListTitlesOne[0]);
      const containsAll = includesArray(wishListTitlesOne, movieArray);
      console.log(containsAll);
      if (!containsAll) {
        saveToLS("wishList", movieArray);
      }
    }
  });
  // trailerEl.attr("src", newTrailerLink);
  const close = document.querySelector(".close");

  // btnEl.addEventListener("click", () => {
  //   videoContainerEl.classList.add("show");
  // });

  close.addEventListener("click", () => {
    videoContainerEl.classList.remove("show");
    trailerEl.attr("src", "");
  });
});

// Renders Cards
// This renders the cards
const renderFilmCard = (imgLink, title, index, trailerLink, id) => {
  const cardEl = `<div class="custom-movie-container">
        <div class="custom-movie-card">
          <a href="./film-data.html?film-title=${title}&film-id=${id}"><img
            src="https://image.tmdb.org/t/p/original/${imgLink}"
            alt="movie card test image"
            width="300px"
            height="400px"
          /></a>
          <div class="custom-card-number">${index}</div>
          <div id="addToWishList" title="${title}" movieID=${id} class="custom-wishlist-card"><a><i class="fa-solid fa-heart"></i></a></div>
          <div id="play" trailer="https://www.youtube.com/embed/${trailerLink}" class="custom-watch-card"><a ><i class="fa-solid fa-circle-play"></i></a></div>
          <div class="custom-card-name"><h3>${title}</h3></div>
        </div>
      </div>`;
  cardDeckEl.append(cardEl);
};

const renderWishItems = (title, id) => {
  const listEl = `<a href="./film-data.html?film-title=${title}&film-id=${id}" class="wishList-Film" >${title}</a>`;
  sideBarEL.append(listEl);
};

// this one is to fetch data from any api link
const getDataFromApi = async (apiLink) => {
  const response = await fetch(apiLink);
  return response.json();
};

// this one is to get only 10 films out of tmdb
const getTop10Movies = async (genreId) => {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=7c7537b799513b436eb6bed714d7edcc&with_genres=${genreId}`;
  const movies = await getDataFromApi(url);
  return movies.results.slice(0, 3);
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
  return posters;
};

// getTop10Tmdb();
const appendFilmDataToHTML = async () => {
  const arrayMovieData = await getPosters();
  for (let i = 0; i < arrayMovieData.length; i++) {
    // const trailer = await addTrailer(arrayMovieData[i][2]);
    // const trailerVideoID = addTrailer(arrayMovieData[i].id);
    // console.log(arrayMovieData[i][2]);
    const imdbID = await convertToImdbID(arrayMovieData[i][2]);
    const trailerVideoID = await passID(arrayMovieData[i][2]);
    const index = i + 1;
    renderFilmCard(
      arrayMovieData[i][0],
      arrayMovieData[i][1],
      index,
      trailerVideoID,
      imdbID.imdb_id
    );
  }
};

const getTrailerLink = async (filmId) => {
  function getTrailerID(filmId) {
    return fetch(
      `https://imdb-api.com/en/API/YouTubeTrailer/k_voxajyfz/${filmId}`
    );
  }
  const trailer = await getTrailerID(filmId);
  return trailer.json();
};
// This converts the TMDB-ID to IMDB-ID
const convertToImdbID = async (TmdbID) => {
  function getTrailerID(TmdbID) {
    return fetch(
      `https://api.themoviedb.org/3/movie/${TmdbID}/external_ids?api_key=7c7537b799513b436eb6bed714d7edcc`
    );
  }
  const id = await getTrailerID(TmdbID);
  return id.json();
};
const addTrailer = async (filmId) => {
  const videoIDs = await convertToImdbID(filmId); //These video ids are for several websites
  const trailerID = await getTrailerLink(videoIDs.imdb_id);
  return trailerID.videoId;
};

const passID = async (tmbdID) => {
  const trailerVideoID = await addTrailer(tmbdID);
  return trailerVideoID;
};

// Here ends fabian's code

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

// This functions are on page loaded
appendFilmDataToHTML();

/* Set the width of the sidebar to 250px (show it) */
function openNav() {
  document.getElementById("mySidepanel").style.width = "250px";
  document.getElementById("mySidepanel").style.height = "100%";
  loadWishList();
}

/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
  document.getElementById("mySidepanel").style.height = "0";
  const wishListItems = document.querySelectorAll(".wishList-Film");
  wishListItems.forEach((element) => {
    element.remove();
  });
}

// This is for the wishList

//to do wish list
// Initialise local storage.
const initializeLS = () => {
  // Calling the schedule array from the local storage
  const scheduleFromLS = JSON.parse(localStorage.getItem("wishList"));

  // If the array is undefined, we create an empty array and push it to the local storage
  if (!scheduleFromLS) {
    localStorage.setItem("wishList", JSON.stringify([]));
  }
};

// wish list local storage function
const saveToLS = (location, value) => {
  // Calls the local storage object.
  let arrayFromLS = JSON.parse(localStorage.getItem(location));

  // Adds a new value to the object .
  arrayFromLS.push(value);

  // Saves the new object to the local storage
  localStorage.setItem(location, JSON.stringify(arrayFromLS));
};

// This loads the array from the local storage for wish list
const loadFromLS = (LSName) => {
  // Getting the object from local storage.
  const arrayFromLS = Object.entries(JSON.parse(localStorage.getItem(LSName)));
  return arrayFromLS;
};

const loadWishList = () => {
  const wishListTitles = loadFromLS("wishList");
  wishListTitles.forEach((element) =>
    renderWishItems(element[1][1], element[1][0])
  );
};

window.onload = function () {
  initializeLS();
};

// Utility functions
const includesArray = (data, arr) => {
  return data.some(
    (e) => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o))
  );
};
