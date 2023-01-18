var userInputEl = $('#musicInput');
var songList = $('#songList')
var recentListEl = $('#recent');
var queueListEl = $('#queue');

var apiKeyLyrics = "apikey=505e83WfFdaB9foGaPW7eLXwNQ1ZV1JIFPwKCXuAaGoDi0vOgXtMdIQ6";
var userSearch = "";
var lyricsArray = [];
var recentObject = JSON.parse(localStorage.getItem("recentObject"));
if (recentObject === null) {
    recentList = [];
    recentURL = [];
    recentObject = { recentList, recentURL };
}
var recentCount = 0;

var queueObject = JSON.parse(localStorage.getItem("queueObject"));
if (queueObject === null) {
    queueList = [];
    queueURL = [];
    queueObject = { queueList, queueURL };
}
var queueCount = 0;

var lyricsAPI = "";
var songData = [];

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
                    songData = data;
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
            iconI.attr("id", lyricsCount);
            lyricsCount++;
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

};




function fetchLyrics(lyricsArray) {
    var songIndex = event.target.getAttribute('id');
    if (songIndex != null) {
        songIndex = Number(songIndex);
        lyricsAPI = lyricsArray[songIndex];
        
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
    
    if (userSearch != "") {
        var backBtn = $('<button id="return">');
        backBtn.text('Return to search')
        songList.append(backBtn);
    }
    var songP = $('<p>');
    var songHeaderEl = $('<strong>');
    var br = $('<br>');
    var songInfoEl = $('<small>')
    songP.append(songHeaderEl);
    songP.append(br);
    songP.append(songInfoEl);
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
    lyricsP.text("\n" + lyrics);
    var recentInfo = song + " - " + artist;
    
    if ((!recentObject.recentList.includes(recentInfo)) || (recentObject.recentList.length === 0)) {
        recentObject.recentList.push(recentInfo);
        recentObject.recentURL.push(lyricsAPI);

        localStorage.setItem("recentObject", JSON.stringify(recentObject));
        var newRecent = $('<button class="recent">');
        newRecent.attr("id", recentCount);
        recentCount++;
        newRecent.text(recentInfo);
        recentListEl.append(newRecent);
        
    }
};

function displayQueue(songData) {
    event.stopPropagation();
    var songIndex = event.target.getAttribute('id');
    if (songIndex != null) {
        songIndex = Number(songIndex);
        
        var song = songData.result[songIndex].track;
        var artist = songData.result[songIndex].artist;
        var queueInfo = song + " - " + artist;
        var lyricsAPI = songData.result[songIndex].api_lyrics + "?" + apiKeyLyrics;
        
        if ((!queueObject.queueList.includes(queueInfo)) || (queueObject.queueList.length === 0)) {
            queueObject.queueList.push(queueInfo);
            queueObject.queueURL.push(lyricsAPI);
            
            localStorage.setItem("queueObject", JSON.stringify(queueObject));
            var newQueue = $('<button class="queue">');
            newQueue.attr("id", queueCount);
            queueCount++;
            newQueue.text(queueInfo);
            queueListEl.append(newQueue);
            
        }
    }
}

function fetchRecentLyrics(recentObject) {
    var songIndex = event.target.getAttribute('id');
    if (songIndex != null) {
        songIndex = Number(songIndex);
        lyricsAPI = [recentObject.recentURL[songIndex]];
        
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

function renderRecentList() {
    var storedRecentObject = JSON.parse(localStorage.getItem("recentObject"));
    if (storedRecentObject != null) {
        for (i = 0; i < storedRecentObject.recentList.length; i++) {
            var newRecent = $('<button class="recent">');
            newRecent.attr("id", i);
            newRecent.text(storedRecentObject.recentList[i]);
            recentListEl.append(newRecent);
        }
    }
};

function fetchQueueLyrics(queueObject) {
    var songIndex = event.target.getAttribute('id');
    if (songIndex != null) {
        songIndex = Number(songIndex);
        lyricsAPI = [queueObject.queueURL[songIndex]];
        
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

function renderQueueList() {
    var storedQueueObject = JSON.parse(localStorage.getItem("queueObject"));
    if (storedQueueObject != null) {
        for (i = 0; i < storedQueueObject.queueList.length; i++) {
            var newQueue = $('<button class="queue">');
            newQueue.attr("id", i);
            newQueue.text(storedQueueObject.queueList[i]);
            queueListEl.append(newQueue);
        }
    }
};

function clearRecentList() {
    recentListEl.empty();
    recentListEl.text('Recent Selections');
    var clearBtn = $('<button class="clear">Clear</button>')
    recentListEl.append(clearBtn);
    localStorage.clear();
}

function clearQueueList() {
    queueListEl.empty();
    queueListEl.text('Up Next');
    var clearBtn = $('<button class="clear">Clear</button>')
    queueListEl.append(clearBtn);
    localStorage.clear();
}

songList.on("click", 'article', () => { fetchLyrics(lyricsArray) });
songList.on('click', 'i', () => { displayQueue(songData) });
songList.on('click', '#return', () => { fetchSongs(userSearch) });


recentListEl.on('click', '.recent', () => { fetchRecentLyrics(recentObject) });
renderRecentList();
queueListEl.on('click', '.queue', () => { fetchQueueLyrics(queueObject) });
renderQueueList();
recentListEl.on('click', '.clear', clearRecentList);
queueListEl.on('click', '.clear', clearQueueList);
