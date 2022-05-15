// Elements
// TO DO: Add these id's to the actual file.
const searchBarEl = $("#searchbar-dynamic");
const dropDownTitles = $("#dropdown-menu-titles");
const dropDownContainerEl = $("#dropdown-menu");

// This fetches the titles from the IMD api for the dynamic dropdown list

// This renders all possible options
// TO DO: Make it only show 5 options.
const renderDropDownMenu = () => {
  console.log("rendering dropdown");
  const dropdownMenu = `<div class="dropdown-content" id="dropdown-menu-titles"></div>`;
  dropDownContainerEl.append(dropdownMenu);
};
const renderResults = (title) => {
  const dropDownTitles = $("#dropdown-menu-titles");
  const searchResult = `<a href="#" class="dropdown-item">
                        ${title}
                    </a>`;
  dropDownTitles.append(searchResult);
};

// Onclick function for searchbar, if enter key is presed it will send a fetch request.
searchBarEl[0].addEventListener("keypress", function (event) {
  dropDownContainerEl.empty();
  dropDownTitles.empty();
  renderDropDownMenu();
  if (event.keyCode === 13) {
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
