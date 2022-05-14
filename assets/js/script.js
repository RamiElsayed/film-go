// Elements
const searchBarEl = $("#searchbar-dynamic");
const dropDownTitles = $("#dropdown-menu-titles");

// This fetches the titles from the IMD api for the dynamic dropdown list

// Render options
const renderResults = (title) => {
  const searchResult = `<a href="#" class="dropdown-item">
                        ${title}
                    </a>`;
  dropDownTitles.append(searchResult);
};

// Onclick button
searchBarEl[0].addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    dropDownTitles.empty();

    const title = searchBarEl.val();
    const url = `https://imdb-api.com/en/API/SearchMovie/k_voxajyfz/${title}`;
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        dataArray = data.results;
        dataArray.forEach((element) => {
          console.log(element.title);
          renderResults(element.title);
        });
      });
  }
});
