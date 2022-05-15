const youtubeApi = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=avatar&key=AIzaSyBhTjmkiNU9nfU2EIRNhCQl6R9RYNSf8wc";

fetch(youtubeApi)
.then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log('youtube data');
    for (let i = 0; i < 5; i++) {
     const videoId = data.items[i].id.videoId;

     const filmYoutubeVideo = document.createElement("iframe");
     filmYoutubeVideo.src = `https://www.youtube.com/embed/${videoId}?auroplay=0`;
    }
  });