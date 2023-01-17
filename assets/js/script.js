var userInputEl = $('#musicInput');
var songList = $('#songList')

var apiKeyLyrics = "apikey=505e83WfFdaB9foGaPW7eLXwNQ1ZV1JIFPwKCXuAaGoDi0vOgXtMdIQ6";
var userSearch = "";
var lyricsArray = [];

userInputEl.on('change', getUserInput);

function getUserInput() {
    userSearch = userInputEl.val().trim();
    userSearch = encodeURI(userSearch);
    userInputEl.val("");
    fetchSongs(userSearch);
};

function fetchSongs(userSearch) {
    var songAPI = "https://api.happi.dev/v1/music?q=" + userSearch + "&limit=20&type=:type&lyrics=1&" + apiKeyLyrics

    fetch(songAPI)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displaySongs(data);
                });
            }
        })
};

function displaySongs(data) {
    songList.empty();
    var songListHeader = $('<h2>');
    songListHeader.text("Select a song to see its lyrics!");
    songList.append(songListHeader);
    lyricsArray = [];
    var songArray = [];
    var lyricsCount = "";

    for (i = 0; ((i < data.result.length) && (songArray.length < 10)); i++) {
        var song = data.result[i].track;
        var artist = data.result[i].artist;
        var album = data.result[i].album;
        var icon = data.result[i].cover;
        var albumIconURL = icon + "?" + apiKeyLyrics;
        var hasLyrics = data.result[i].haslyrics;

        if (hasLyrics && (!songArray.includes(song))) {
            songArray.push(song);
            var songDivEl = $('<article>');
            songDivEl.attr("class", "media level-left");
            songDivEl.attr("id", lyricsCount);
            lyricsCount++;
            var figureEl = $('<figure>');
            figureEl.attr("class", "media-left");
            var pEl = $('<p>');
            pEl.attr("class", "image is-64x64");
            var albumIcon = $('<img>');
            pEl.append(albumIcon);
            figureEl.append(pEl);

            var mediaContainerEl = $('<div>');
            mediaContainerEl.attr("class", "media-content");
            var mediaContentEl = $('<div>');
            mediaContentEl.attr("class", "content");
            var songP = $('<p>');
            var songHeaderEl = $('<strong>');
            var br = $('<br>');
            var songInfoEl = $('<small>')
            songP.append(songHeaderEl);
            songP.append(br);
            songP.append(songInfoEl);
            mediaContentEl.append(songP);
            mediaContainerEl.append(mediaContentEl)

            var iconContainerEl = $('<div>');
            iconContainerEl.attr("class", "level-right");
            var iconA = $('<a>');
            var iconSpan = $('<span>');
            iconSpan.attr("class", "icon is-large");
            var iconI = $('<i>');
            iconI.attr("class", "fa-solid fa-heart-circle-plus");
            iconSpan.append(iconI);
            iconA.append(iconI);
            iconContainerEl.append(iconA);

            songDivEl.append(figureEl);
            songDivEl.append(mediaContainerEl);
            songDivEl.append(iconContainerEl);
            songList.append(songDivEl);

            albumIcon.attr("src", albumIconURL);
            songHeaderEl.text(song);
            songInfoEl.text(artist + ", " + album);

            var lyricsAPI = data.result[i].api_lyrics + "?" + apiKeyLyrics;
            lyricsArray.push(lyricsAPI);

        }

    }

}


songList.on("click", 'article', () => { fetchLyrics(lyricsArray) });


function fetchLyrics(lyricsArray) {
    var songIndex = event.target.getAttribute('id');
    if (songIndex != null) {
        songIndex = Number(songIndex);
        var lyricsAPI = lyricsArray[songIndex];

        fetch(lyricsAPI)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        displayLyrics(data);
                    });
                }
            })
    }
};

function displayLyrics(data) {
    songList.empty();

    var backBtn = $('<button id="return">');
    backBtn.text('Return to search')
    var songP = $('<p>');
    var songHeaderEl = $('<strong>');
    var br = $('<br>');
    var songInfoEl = $('<small>')
    songP.append(songHeaderEl);
    songP.append(br);
    songP.append(songInfoEl);
    songList.append(backBtn);
    songList.append(songP);

    var lyricsP = $('<p>');
    lyricsP.css("white-space", "pre-line");
    songList.append(lyricsP);

    var song = data.result.track;
    var artist = data.result.artist;
    var album = data.result.album;
    var lyrics = data.result.lyrics;
    lyrics = lyrics.replace("\nSource", "\n\nSource");

    songHeaderEl.text(song);
    songInfoEl.text(artist + ", " + album);
    lyricsP.text(lyrics);
};

songList.on('click', '#return', () => { fetchSongs(userSearch) })