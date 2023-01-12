// var apiKey = "505e83WfFdaB9foGaPW7eLXwNQ1ZV1JIFPwKCXuAaGoDi0vOgXtMdIQ6";

var song = "Thriller";
fetchSong(song);

function fetchSong(song) {
    var songAPI = "https://api.happi.dev/v1/music?q=" + song + "&limit=&apikey=505e83WfFdaB9foGaPW7eLXwNQ1ZV1JIFPwKCXuAaGoDi0vOgXtMdIQ6&type=:type&lyrics=1"
    
    fetch(songAPI)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    fetchLyrics(data);
                });
            }
        })
};


function fetchLyrics(data) {
    var lyricsAPI = data.result[3].api_lyrics + "?apikey=505e83WfFdaB9foGaPW7eLXwNQ1ZV1JIFPwKCXuAaGoDi0vOgXtMdIQ6";
    console.log(lyricsAPI);
    
    fetch(lyricsAPI)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayLyrics(data);
                });
            }
        })
};

function displayLyrics(data) {
    var lyrics = data.result.lyrics;
    console.log(lyrics)
};
