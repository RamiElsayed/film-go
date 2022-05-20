const genresListApi = `https://api.themoviedb.org/3/genre/movie/list?api_key=7c7537b799513b436eb6bed714d7edcc&language=en-US`;

const getGenreId= async (genresListApi) => {
    const response = await fetch(genresListApi);
    const data = await (response.json());
    return data;
}

const matchGenreId = (genre) => {
    const data = getGenreId(genresListApi);
    for (let index = 0; index < data.length; index++) {
       if (data[index].name === genre) {
           return data[index].id;
       }
    }
}



