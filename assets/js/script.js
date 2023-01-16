var userInputEl = $('#artistSearch');
var songList = $('#songList')

var apiKeyLyrics = "apikey=505e83WfFdaB9foGaPW7eLXwNQ1ZV1JIFPwKCXuAaGoDi0vOgXtMdIQ6";
var userSearch = "";
var lyricsArray = [];

userInputEl.on('change', getUserInput);

function getUserInput () {
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
                    console.log(data);
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


songList.on("click", () => { fetchLyrics(lyricsArray) });


function fetchLyrics(lyricsArray) {
    var songIndex = event.target.getAttribute('id'); 
    songIndex = Number(songIndex);
    var lyricsAPI = lyricsArray[songIndex];
    
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
    songList.empty();

    var songP = $('<p>');
    var songHeaderEl = $('<strong>');
    var br = $('<br>');
    var songInfoEl = $('<small>')
    songP.append(songHeaderEl);
    songP.append(br);
    songP.append(songInfoEl);
    songList.append(songP)

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
// var apiKey = 1
var drinkName = "Margarita";
var drinkIngredient = "vodka";
var drinkRandom = '';
var data = '';

function fetchCocktail (drinkName) {
    var cocktailName = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + drinkName;
    console.log(cocktailName);
    fetch(cocktailName)
    .then(function (response) {
        // console.log(response);
        if(response.ok) {
        response.json().then(function(data){
            console.log(data);
            });
        }
    })
};

// fetchCocktail(drinkName);
// console.log(drinkName.length);

async function getapi(url) {
    var response = await fetch (drinkName);

    var data = await response.json();
    console.log(data);
    show (data); 
}

fetchCocktail(drinkName);

function show(data) {
    let tab = 
        `<tr>
          <th>strDrink</th>
          <th>strDrinkThumb</th>
          <th>strInstructions</th>
         </tr>`;
}

for (let r of data.drinks) {
    tab += `<tr> 
<td>${r.strDrink} </td>
<td>${r.office}</td>
<td>${r.position}</td> 
<td>${r.salary}</td>          
</tr>`;
}



// function fetchCocktail (drinkIngredient) {
//     var cocktailIngredient = "https://www.thecocktaildb.com/api/json/v1/1/search.php?i=" + drinkIngredient;
//     console.log(cocktailIngredient);
//     fetch(cocktailIngredient)
//     .then(function (response) {
//         // console.log(response);
//         if(response.ok) {
//         response.json().then(function(data){
//             console.log(data);
//             });
//         }
//     })
// };

// fetchCocktail(drinkIngredient);

// function fetchCocktail (drinkRandom) {
//     var cocktailRandom = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
//     console.log(cocktailRandom);
//     fetch(cocktailRandom)
//     .then(function (response) {
//         // console.log(response);
//         if(response.ok) {
//         response.json().then(function(data){
//             console.log(data);
//             });
//         }
//     })
// };

// fetchCocktail(drinkRandom);



