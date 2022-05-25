/* APIS*/
const genresListApi = `https://api.themoviedb.org/3/genre/movie/list?api_key=7c7537b799513b436eb6bed714d7edcc&language=en-US`;

/*Variables */
const params = new URLSearchParams(window.location.search);
const genreId = params.get("genre-id");
const cardDeckEl = $("#cardDeck");
const trailerEl = $("#trailerVideo");
const sideBarEL = $("#mySidepanel");

/*Render Functions*/
// Movie card renderer function
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

/*Wish list's items renderer function */
const renderWishItems = (title, id) => {
  const listEl = `<a href="./film-data.html?film-title=${title}&film-id=${id}" class="wishList-Film" >${title}</a>`;
  sideBarEL.append(listEl);
};

// Play video and add to wishList
window.addEventListener("load", async function () {
  // const btnEl = document.querySelector("#play");

  const videoContainerEl = document.querySelector(".video-container");
  const close = document.querySelector(".close");

  cardDeckEl.on("click", async function (event) {
    const target = event.target;
    /* Upon clicking on the playbutton, the iframe html code will update its src attribute file to that of the official trailer.*/
    /* It will also add the class show to the video container to make it pop up*/
    if (target.id.toLowerCase() === "play") {
      const trailerUrl = target.attributes.trailer.nodeValue;
      trailerEl.attr("src", trailerUrl);
      videoContainerEl.classList.add("show");
    }
    /*When the X (close button) is clicked it will remove the class show from the video container to make it dissapear,
    it will also set the SRC attribute of iframe to " " to stop the video */
    close.addEventListener("click", () => {
      videoContainerEl.classList.remove("show");
      trailerEl.attr("src", "");
    });

    /* Upon clicking on the wishlist button, the movieID and MovieTitle attributes will be saved into an array.*/
    /*Then, the wishlist from local storage is pull and checked to see if it includes the  current movieHTMLAttributes
    if true, the value is not save to LS. If false, it will save the current movieHTMLAttrArr to LS */
    if (target.id.toLowerCase() === "addtowishlist") {
      const movieTitleIDAttr = target.attributes.movieid.nodeValue;
      const movieTitleAttr = target.attributes.title.nodeValue;
      const movieHTMLAttrArr = [movieTitleIDAttr, movieTitleAttr];
      const wishListLS = JSON.parse(localStorage.getItem("wishList"));
      const containsAll = includesArray(wishListLS, movieHTMLAttrArr);
      if (!containsAll) {
        saveToLS("wishList", movieHTMLAttrArr);
      }
    }
  });
});

// this one is to fetch data from any api link
const getDataFromApi = async (apiLink) => {
  const response = await fetch(apiLink);
  return response.json();
};

// this one is to get only 10 films out of tmdb
const getTop10Movies = async (genreId) => {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=7c7537b799513b436eb6bed714d7edcc&with_genres=${genreId}`;
  const movies = await getDataFromApi(url);
  return movies.results.slice(0, 10);
  // return movies.results.slice(0, 10);
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
const getMoviesDetails = async () => {
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
  const arrayMovieData = await getMoviesDetails();
  for (let i = 0; i < arrayMovieData.length; i++) {
    const imdbID = await convertToImdbID(arrayMovieData[i][2]);
    const trailerVideoID = await getTrailerID(arrayMovieData[i][2]);
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

// This gets the youtube trailer ID e.g. awHyqJv3WKE
const getTrailerLink = async (imdbID) => {
  const ApiTrailerID = `https://imdb-api.com/en/API/YouTubeTrailer/k_voxajyfz/${imdbID}`;
  const trailerID = await getDataFromApi(ApiTrailerID);
  return trailerID;
};
// This converts the movieID from TMDB-ID to IMDB-ID
const convertToImdbID = async (TmdbID) => {
  const ApiToImdbID = `https://api.themoviedb.org/3/movie/${TmdbID}/external_ids?api_key=7c7537b799513b436eb6bed714d7edcc`;
  const imdbId = await getDataFromApi(ApiToImdbID);
  return imdbId;
};

/*After the TMDB-ID is converted to a IMDB-ID, it gets used to get the trailer ID from the API*/
const getTrailerID = async (tmbdID) => {
  const videoIDs = await convertToImdbID(tmbdID); //These video ids are for several websites
  const trailerID = await getTrailerLink(videoIDs.imdb_id);
  return trailerID.videoId;
};

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

/*--------------------------------Wish List---------------------------------- */
/* Set the width of the sidebar wishList to 250px (show it) */
let view = false;

function openNav() {
  if (!view) {
    document.getElementById("mySidepanel").style.width = "25rem";
    document.getElementById("mySidepanel").style.height = "fit-content";
    loadWishList();
    view = true;
  } else if (view) {
    closeNav();
  }
}

/* Set the width of the sidebar wishList to 0 (hide it) */
function closeNav() {
  if (view) {
    view = false;
    document.getElementById("mySidepanel").style.width = "0";
    document.getElementById("mySidepanel").style.height = "0";
    const wishListItems = document.querySelectorAll(".wishList-Film");
    wishListItems.forEach((element) => {
      element.remove();
    });
  }
}

// Initialises wishList in local storage.
const initializeLS = () => {
  // Calling the schedule array from the local storage
  const scheduleFromLS = JSON.parse(localStorage.getItem("wishList"));

  // If the array is undefined, we create an empty array and push it to the local storage
  if (!scheduleFromLS) {
    localStorage.setItem("wishList", JSON.stringify([]));
  }
};

// This pushes a value to a array (location) in the LS
const saveToLS = (location, value) => {
  // Calls the local storage object.
  let arrayFromLS = JSON.parse(localStorage.getItem(location));

  // Adds a new value to the array .
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

/* This loads the wishList from LS and passes the value to the renderWishItems function to 
render them in the wishlist*/
const loadWishList = () => {
  const wishListTitles = loadFromLS("wishList");
  wishListTitles.forEach((element) =>
    renderWishItems(element[1][1], element[1][0])
  );
};

// This functions are on page loaded
window.onload = function () {
  initializeLS();
  appendFilmDataToHTML();
};

/*--------------------------------Utility functions---------------------------------- */
// This checks if an array of arrays contains an smaller array's values.
const includesArray = (data, arr) => {
  return data.some(
    (e) => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o))
  );
};
const top10Link = (id) => {
  window.location.href = `./top10.html?genre-id=${id}`;
};
