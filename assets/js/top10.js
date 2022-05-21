
const params = new URLSearchParams(window.location.search)
const genreId = params.get('genre-id');
console.log(genreId);
const genresListApi = `https://api.themoviedb.org/3/genre/movie/list?api_key=7c7537b799513b436eb6bed714d7edcc&language=en-US`;

const getDataFromApi = async (apiLink) => {
    const response = await fetch(apiLink);
    return response.json();
}

const getTop10Movies = async (genreId) => {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=7c7537b799513b436eb6bed714d7edcc&with_genres=${genreId}`;
    const movies = await getDataFromApi(url);
    return movies.results.slice(0, 10);
}

loadData = async () => {
    const topMovies = await getTop10Movies(genreId);
    console.log(topMovies);
}

loadData();





/* function 1 matching genre to id*/
const matchGenreId = (genre) => {
    const data = getDataFromApi(genresListApi);
    for (let index = 0; index < data.length; index++) {
       if (data[index].name === genre) {
           return data[index].id;
       }
    }
}



/* function 2 get the IMDB id from comparing to TMDB id*/


//This function is supposed to take a single tmdb id and return a single imdb id. 6977 --> tt423440


// const loadData = async () => {
//     const tmdbGenres = (await getDataFromApi(genresListApi)).genres;
//     const imdbGenreIds = (await Promise.all(tmdbGenres.map(async x => {
//         const current = await getDataFromApi(`https://api.themoviedb.org/3/movie/${x.id}/external_ids?api_key=7c7537b799513b436eb6bed714d7edcc`);
//         return current.imdb_id;
//     }))).filter(x => x);
//     console.log(imdbGenreIds);
// }
loadData();


/*select the table div*/
const table = document.getElementsByClassName("table")[0];
console.log(table);

/*Create Card Div  JS*/
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

