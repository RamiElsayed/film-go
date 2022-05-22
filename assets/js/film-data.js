const params = new URLSearchParams(window.location.search);
const filmId = params.get("film-id");
const filmTitle = params.get("film-title");

const mainElem = document.querySelector("main");
const videosListElem = document.getElementById("videos-container");

// This variables are for replacing the text.
const htmlMovieTitle = $("#movieTitle");
const htmlMovieDirector = $("#movieDirector");
const htmlMovieGenres = $("#movieGenres");
const htmlMovieStoryline = $("#storyLine");
const htmlMovieBackdrop = $("#backdrop");
const htmlMovieTrailer = $("#trailerContainer");

const embedYoutubeVideos = (searchTerm) => {
  function searchYoutubeVideos(searchTerm) {
    return fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${searchTerm}&key=AIzaSyAWgu9o-CD36HzXYrRVsgjkJsvogQ4kCWw`
    );
  }

  function linkYouTubeVideo(videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  searchYoutubeVideos(searchTerm)
    .then((response) => response.json())
    .then((data) => {
      console.log(`youtube data: ${data.items.length}`);
      for (let i = 0; i < 3; i++) {
        const videoId = data.items[i].id.videoId;
        const filmYoutubeVideo = document.createElement("a");
        filmYoutubeVideo.setAttribute("target", "_blank");
        filmYoutubeVideo.setAttribute("class", "thumbnail-sizing");

        filmYoutubeVideo.href = linkYouTubeVideo(videoId);

        const filmImage = document.createElement("img");
        filmImage.src = data.items[i].snippet.thumbnails.medium.url;

        filmYoutubeVideo.appendChild(filmImage);
        videosListElem.append(filmYoutubeVideo);
      }
    });
};

// embedYoutubeVideos(filmTitle);

// This function gets the movie description based on its imdb-ID
const getDescription = (filmId) => {
  function getMovieData(filmId) {
    return fetch(
      `https://imdb-api.com/en/API/Title/k_voxajyfz/${filmId}/Trailer,Ratings,`
    );
  }
  getMovieData(filmId)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Here
      console.log(data);
      htmlMovieTitle.text(data.fullTitle);
      htmlMovieGenres.text(data.genres);
      htmlMovieStoryline.text(data.plot);
      htmlMovieBackdrop.attr("src", data.image);
      htmlMovieDirector.text(data.directors);
    });
};

const getTrailerLink = (filmId) => {
  function getTrailerID(filmId) {
    return fetch(
      `https://imdb-api.com/en/API/YouTubeTrailer/k_voxajyfz/${filmId}`
    );
  }
  getTrailerID(filmId)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.videoId);
      htmlMovieTrailer.attr(
        "src",
        `https://www.youtube.com/embed/${data.videoId}`
      );
    });
};

getDescription(filmId);
getTrailerLink(filmId);

// console.log(data.genres.length);
// var arr = [];
// for (let i = 0; i < data.genres.length; i++) {
//   arr.push(data.genres[i].name);
// }
// const genresListString = arr.toString();
// console.log(genresListString);
// const movieDataObject = {
//   title: data.original_title,
//   backdrop: `https://image.tmdb.org/t/p/original${data.poster_path}`,
//   storyLine: data.overview,
//   genres: genresListString,
// };
