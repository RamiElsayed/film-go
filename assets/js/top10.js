
const params = new URLSearchParams(window.location.search)
const genreId = params.get('genre-id');



const genresListApi = `https://api.themoviedb.org/3/genre/movie/list?api_key=7c7537b799513b436eb6bed714d7edcc&language=en-US`;


// this one is to fetch data from any api link
const getDataFromApi = async (apiLink) => {
    const response = await fetch(apiLink);
    return response.json();
}


// this one is to get only 10 films out of tmdb
const getTop10Movies = async (genreId) => {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=7c7537b799513b436eb6bed714d7edcc&with_genres=${genreId}`;
    const movies = await getDataFromApi(url);
    return movies.results.slice(0, 10);
}

// on load we get 10 films
const getTop10Tmdb = async () => {
    const topMovies = await getTop10Movies(genreId);
    for (let index = 0; index < topMovies.length; index++) {
        topMovies[index] = topMovies[index].id;
    }
    console.log(topMovies);
    return topMovies
}

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
    const tmdbIds = (await getTop10Tmdb());
    const imdbIds = (await Promise.all(tmdbIds.map(async x => {
        const current = await getDataFromApi(`https://api.themoviedb.org/3/movie/${x}/external_ids?api_key=7c7537b799513b436eb6bed714d7edcc`);
        return current.imdb_id;
    }))).filter(x => x);
    console.log(imdbIds);
}
getTop10Tmdb();
getImdbIds();


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
  

