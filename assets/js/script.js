// Elements
// TO DO: Add these id's to the actual file.
const searchBarEl = $("#searchbar-dynamic");
const dropDownTitles = $("#dropdown-menu-titles");
const dropDownContainerEl = $("#dropdown-menu");
const sideBarEL = $("#mySidepanel");

// This fetches the titles from the IMD api for the dynamic dropdown list

// This renders all possible options
// TO DO: Make it only show 5 options.
const renderDropDownMenu = () => {
  console.log("rendering dropdown");
  const dropdownMenu = `<div class="dropdown-content" id="dropdown-menu-titles"></div>`;
  dropDownContainerEl.append(dropdownMenu);
};

const renderResults = (title, id) => {
  const dropDownTitles = $("#dropdown-menu-titles");
  const searchResult = `<a href='./film-data.html?film-title=${title}&film-id=${id}' class="dropdown-item" movieTitle="${title}"movieId="${id}">
                        ${title}
                    </a>`;
  dropDownTitles.append(searchResult);
};

//Onclick function for searchbar, if enter key is presed it will send a fetch request.
searchBarEl[0].addEventListener("keypress", function (event) {
  dropDownContainerEl.empty();
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
          dataArray = data.results;
          renderResults(element.title, element.id);
        });
      });
  }
});

// This gets the movie Id and saves it into the local storage.
dropDownContainerEl[0].addEventListener("click", function (event) {
  let target = event.target;
  const dropDownTitles = $("#dropdown-menu-titles");
  if (target.tagName === "A") {
    const movieID = target.getAttribute("movieID");
    const movieTitle = target.getAttribute("movietitle");
    saveToLS("movieID", movieID);
    saveToLS("movietitle", movieTitle);
    dropDownTitles.remove();
  }
});

//to do wish list

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
/*Wish list's items renderer function */
const renderWishItems = (title, id) => {
  const listEl = `<a href="./film-data.html?film-title=${title}&film-id=${id}" class="wishList-Film" >${title}</a>`;
  sideBarEL.append(listEl);
};
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
};

const genreButtonClick = (id) => {
  const top10Url = `./top10.html?genre-id=${id}`;
  window.location.href = top10Url;
};

const genresList = () => {
  const genreButtons = document.querySelectorAll(".genreButton");
  const apiUrl =
    "https://api.themoviedb.org/3/genre/movie/list?api_key=7c7537b799513b436eb6bed714d7edcc&language=en-US";

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.genres.forEach((genre) => {
        genreButtons.forEach((genreButton) => {
          if (genreButton.textContent === genre.name) {
            genreButton.addEventListener("click", () => {
              genreButtonClick(genre.id);
            });
          }
        });
      });
    });
};
genresList();
