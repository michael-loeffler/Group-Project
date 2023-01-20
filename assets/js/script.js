//-- DOM DECLARATIONS --//
var userInputEl = $('#musicInput');
var songList = $('#songList')
var recentListEl = $('#recent');
var queueListEl = $('#queue');

//-- VARIABLE INITIALIZATIONS --//
var apiKeyLyrics = "apikey=505e83WfFdaB9foGaPW7eLXwNQ1ZV1JIFPwKCXuAaGoDi0vOgXtMdIQ6";
var userSearch = "";
var lyricsArray = [];
var lyricsAPI = "";
var songData = [];
var recentCount = 0;
var queueCount = 0;
//- Builds recentObject either from scratch or with data from localStorage -//
var recentObject = JSON.parse(localStorage.getItem("recentObject"));
if (recentObject === null) {
    recentList = [];
    recentURL = [];
    recentObject = { recentList, recentURL };
}
//- Builds queueObject either from scratch or with data from localStorage -//
var queueObject = JSON.parse(localStorage.getItem("queueObject"));
if (queueObject === null) {
    queueList = [];
    queueURL = [];
    queueObject = { queueList, queueURL };
}

//-- EVENT LISTENERS --//
userInputEl.on('change', getUserInput);
//- Click listeners placed on the song list -//
songList.on("click", 'article', () => { fetchLyrics(lyricsArray) });
songList.on('click', 'i', () => { displayQueue(songData) });
songList.on('click', '#return', () => { fetchSongs(userSearch) });
//- Click listeners placed on the recent/queue lists -//
recentListEl.on('click', '.recent', () => { fetchRecentLyrics(recentObject) });
queueListEl.on('click', '.queue', () => { fetchQueueLyrics(queueObject) });
recentListEl.on('click', '.clear', clearRecentList);
queueListEl.on('click', '.clear', clearQueueList);

//-- FUNCTION CALLS TO BE RUN ON PAGE LOAD --//
renderRecentList();
renderQueueList();

//------------------------------------------------- FUNCTIONS -------------------------------------------------//
//- The getUserInput function obtains the data that the user enters into the search box and processes it (i.e., trimming extra spaces and then getting it to a state that can be concatenated into a URL) for use by the fetchSongs function, which it then calls. -//
function getUserInput() {
    userSearch = userInputEl.val().trim();
    userSearch = encodeURI(userSearch);
    userInputEl.val("");
    fetchSongs(userSearch);
};
//- The fetchSongs function takes in the user's processed search query and concatenates it into a fetch URL for the Happi Music API. The function performs the fetch and then passes the data it receives to the displaySongs function. -//
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
//- The displaySongs function manipulates the data obtained from the fetch in order to create all HTML DOM elements to  display a list of songs on screen that have lyrics data associated with them to be acted on when a user clicks on a song. -//
function displaySongs(data) {
    songList.empty(); // resets the area with a blank slate to add new song elements to //
    var songListHeader = $('<h2>');
    songListHeader.text("Select a song to see its lyrics!");
    songList.append(songListHeader);
    lyricsArray = [];
    var songArray = [];
    var lyricsCount = "";
    // goes through the JSON object provided by the fetchSongs function, obtains the pertinent information, determines which songs have lyrics, and when it finds a song it hasn't found before, it creates the HTML elements to display that song's information on the page. //
    for (i = 0; ((i < data.result.length) && (songArray.length < 10)); i++) { // this tells the app to go through (up to) the entire object to find no more than 10 unique songs. //
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
            songDivEl.attr("id", lyricsCount); // creates an "index" for this song that can be used to pull data from a stored array later when this element is clicked //
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
            iconI.attr("id", lyricsCount); // creates an "index" for this song that can be used to pull data from a stored array later when this element is clicked //
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

            var lyricsAPI = data.result[i].api_lyrics + "?" + apiKeyLyrics; // concatenates a fetch URL that is usable by the Happi Music API,
            lyricsArray.push(lyricsAPI); // and adds it to an array for later access 

        }

    }

};
//- The fetchLyrics function obtains the id of the item that was clicked on, and the uses that as an index to pull the associated lyrics api call. The function performs the fetch and then passes the data it receives to the displayLyrics function. -//
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
//- The displayLyrics function will empty the contents of the songList element, check if the user searched for anything yet (to determine whether to add a return to search button"), create all HTML DOM elements to display the song info and lyrics on the page, formats the lyrics, and displays the information found for that song on screen. -//
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
    // When a song is clicked on and this function runs, if the recent list doesn't already have that song, it creates a button (with an id that will later be used as an index) for it and adds it to the recent list. The function also adds the song info and lyrics API call to an object and sends the object to localStorage to be used by the renderRecentList function on page load. -//
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
//- The displayQueue function is passed the songData variable created by the fetchSongs function, obtains the id of the item that was clicked on, uses it as an index to pull the associated information for that song from the songData, and, if the queue list doesn't already have that song, it creates a button for it and adds it to the queue list. The function finally adds the song info and lyrics API call to an object and sends the object to localStorage to be used by the renderQueueList function on page load. -//
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
};
//- The fetchRecentLyrics function obtains the id of the item that was clicked on, and the uses that as an index to pull the associated lyrics api call from the recentObject object. The function performs the fetch and then passes the data it receives to the displayLyrics function. This allows the user to recall a lyric page of a song on the queue list. -//
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
//- The renderRecentList function obtains the information stored in the localStorage under the recentObject key, and if there is in fact information stored there, it creates a list of buttons with the information from storage. This allows the user's information to persist on page refresh. -//
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
//- The fetchQueueLyrics function obtains the id of the item that was clicked on, and the uses that as an index to pull the associated lyrics api call from the queueObject object. The function performs the fetch and then passes the data it receives to the displayLyrics function. This allows the user to recall a lyric page of a song on the queue list. -//
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
//- The renderQueueList function obtains the information stored in the localStorage under the queueObject key, and if there is in fact information stored there, it creates a list of buttons with the information from storage. This allows the user's information to persist on page refresh. -//
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
//- The clearRecentList function will empty the contents of the recentListEl, replace the heading and clear button, and clear the localStorage. This allows the user to erase the recent list and erase that data from localStorage so that it is not retained on page refresh. -//
function clearRecentList() {
    recentListEl.empty();
    recentListEl.text('Recent Selections');
    var clearBtn = $('<button class="clear">Clear</button>')
    recentListEl.append(clearBtn);
    localStorage.clear();
};
//- The clearQueueList function will empty the contents of the queueListEl, replace the heading and clear button, and clear the localStorage. This allows the user to erase the queue list and erase that data from localStorage so that it is not retained on page refresh. -//
function clearQueueList() {
    queueListEl.empty();
    queueListEl.text('Up Next');
    var clearBtn = $('<button class="clear">Clear</button>')
    queueListEl.append(clearBtn);
    localStorage.clear();
};


// var cocktail;
// api = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";


// function setUp() {
// var drinkButton = select('#drinkBtn');
// drinkButton.mousePressed(cocktailType);

// drinkInputEl = $("#drinkInput");
// }

// function cocktailType() {
//     var cocktailNameURL = api + drinkInputEl.value();
//     loadJSON(cocktailNameURL, getCocktail);
// }

// function getCocktail(data) {
//     coccktail = data;
// }


var drinkInputEl = $('#drinkInput');
var ingredientInputEl = $('#ingredientInput');

var cocktailList = $('#cocktailList');
var drinkSearch = "";
var randomURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php"
var randomBtnEl = $('#randomBtn');
var ingredientURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?i=" + ingredientSearch;
var cocktailName = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + drinkSearch;
var ingredientSearch = "";
var drinkBtnEl = $("#drinkBtn");
var mainIngredientBtnEl = $('#mainIngredientBtn');
var cocktailsArray = [];
var cocktailData = [];



$("#randomBtn").on("click", displayrandomCocktail);

fetch(randomURL)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("NETWORK RESPONSE ERROR");
    }
  })
  .then(data => {
    console.log(data);
    displayrandomCocktail(data)
  })
  .catch((error) => console.error("FETCH ERROR:", error));


  function displayrandomCocktail(data) {
    var randomCocktail = data.drinks[0];
    var randomCocktailDiv = document.getElementById("randomDrink");
    
    var randomCocktailName = randomCocktail.strDrink;
    var heading = document.createElement("h1");
    heading.innerHTML = randomCocktailName;
    randomCocktailDiv.appendChild(heading);

    var randomCocktailImg = document.createElement("img");
    randomCocktailImg.src = randomCocktail.strDrinkThumb;
    randomCocktailDiv.appendChild(randomCocktailImg);

    var randomCocktailIngredients = document.createElement("ul");
    randomCocktailDiv.appendChild(randomCocktailIngredients);  
  
    var getIngredients = Object.keys(randomCocktail)
    .filter(function (ingredient) {
      return ingredient.indexOf("strIngredient") == 0;
    })
    .reduce(function (ingredients, ingredient) {
      if (randomCocktail[ingredient] != null) {
        ingredients[ingredient] = randomCocktail[ingredient];
      }
      return ingredients;
    }, {});

    for (let key in getIngredients) {
        let value = getIngredients[key];
        listItem = document.createElement("li");
        listItem.innerHTML = value;
        randomCocktailIngredients.appendChild(listItem);
  }
        var randomCocktailName = randomCocktail.strInstructions;
        var heading = document.createElement("h2");
        heading.innerHTML = randomCocktailName;
        randomCocktailDiv.appendChild(heading);

        fetch(randomURL);
        };

       

