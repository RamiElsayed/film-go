const mainElem = document.querySelector("main");
const videosListElem = document.getElementById("videos-container");

const embedYoutubeVideos = (searchTerm) => {
    function searchYoutubeVideos(searchTerm) {
        return fetch(
            `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${searchTerm}&key=AIzaSyBhTjmkiNU9nfU2EIRNhCQl6R9RYNSf8wc`
        );
    };

    function linkYouTubeVideo(videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
    };

    searchYoutubeVideos(searchTerm)
    .then(response => response.json())
    .then(data => {
        console.log(`youtube data: ${data.items.length}`);
        for (let i = 0; i < 5; i++) {
        const videoId = data.items[i].id.videoId;
        const filmYoutubeVideo = document.createElement("a");
        filmYoutubeVideo.setAttribute("target","_blank");
        filmYoutubeVideo.href = linkYouTubeVideo(videoId);

        const filmImage = document.createElement("img");
        filmImage.src = data.items[i].snippet.thumbnails.medium.url;

        filmYoutubeVideo.appendChild(filmImage);
        videosListElem.append(filmYoutubeVideo);
        }
    });
}

const searchTerm = (LSName) => {
    // Getting the object from local storage.
    const arrayFromLS = Object.entries(JSON.parse(localStorage.getItem(LSName)));
    console.log(arrayFromLS);
    return arrayFromLS;
  };
embedYoutubeVideos(searchTerm("movietitle"));