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



var drinkInputEl = $('#drinkSearch');
var drinkList = $('#drinkList')
var drinkURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s="
var drinkSearch = "";
var cocktailName = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + drinkSearch;
var randomURL = "https://www.thecocktaildb.com/api/json/v1/1/random.php"
var randomBtnEl = $('#randomBtn');
var ingredientSearch = "https://www.thecocktaildb.com/api/json/v1/1/search.php?i=" + drinkIngredient;
var drinkIngredient = "";
var drinkBtnEl = $("#drinkBtn");
var mainIngredientBtnEl = $('#mainIngredientBtn');


fetch(cocktailName)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("NETWORK RESPONSE ERROR");
    }
  })
  .then(data => {
    console.log(data);
    displaydrinkInput(data)
  })
  .catch((error) => console.error("FETCH ERROR:", error));

  drinkBtnEl.on("click", displaydrinkInput);

  function displaydrinkInput(data) {
    var cocktail = data.drinks[0];
    var userCocktailDiv = document.getElementById("drinkSearch");
    
    var cocktailName = cocktail.strDrink;
    var heading = document.createElement("h1");
    heading.innerHTML = cocktailName;
    userCocktailDiv.appendChild(heading);

    var cocktailImg = document.createElement("img");
    cocktailImg.src = cocktail.strDrinkThumb;
    userCocktailDiv.appendChild(cocktailImg);

    var cocktailIngredients = document.createElement("ul");
    userCocktailDiv.appendChild(cocktailIngredients);  
  
    var getIngredients = Object.keys(cocktail)
    .filter(function (ingredient) {
      return ingredient.indexOf("strIngredient") == 0;
    })
    .reduce(function (ingredients, ingredient) {
      if (cocktail[ingredient] != null) {
        ingredients[ingredient] = cocktail[ingredient];
      }
      return ingredients;
    }, {});

    for (let key in getIngredients) {
        let value = getIngredients[key];
        listItem = document.createElement("li");
        listItem.innerHTML = value;
        cocktailIngredients.appendChild(listItem);
  }

        var cocktailName = cocktail.strInstructions;
        var heading = document.createElement("h2");
        heading.innerHTML = cocktailName;
        userCocktailDiv.appendChild(heading);
    };


  fetch(ingredientSearch)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("NETWORK RESPONSE ERROR");
    }
  })
  .then(data => {
    console.log(data);
    displayCocktailIngredient(data)
  })
  .catch((error) => console.error("FETCH ERROR:", error));

  mainIngredientBtnEl.on("click", displayCocktailIngredient);

  function displayCocktailIngredient(data) {
    var cocktailByIngredient = data.drinks[0];
    var ingredientCocktailDiv = document.getElementById("ingredientSearch");
    
    var cocktailMainIngredient = cocktailByIngredient.strDrink;
    var heading = document.createElement("h1");
    heading.innerHTML = cocktailMainIngredient;
    ingredientCocktailDiv.appendChild(heading);

    var cocktailByIngredientImg = document.createElement("img");
    cocktailByIngredientImg.src = cocktailByIngredient.strDrinkThumb;
    ingredientCocktailDiv.appendChild(cocktailImg);

    var mainCocktailIngredients = document.createElement("ul");
    ingredientCocktailDiv.appendChild(mainCocktailIngredients);  
  
    var getIngredients = Object.keys(cocktailByIngredientl)
    .filter(function (ingredient) {
      return ingredient.indexOf("strIngredient") == 0;
    })
    .reduce(function (ingredients, ingredient) {
      if (cocktailMainIngredient[ingredient] != null) {
        ingredients[ingredient] = ccocktailMainIngredient[ingredient];
      }
      return ingredients;
    }, {});

    for (let key in getIngredients) {
        let value = getIngredients[key];
        listItem = document.createElement("li");
        listItem.innerHTML = value;
        cocktailIngredientsSearch.appendChild(listItem);
  }
    
        var cocktailMainIngredient = cocktailByIngredient.strInstructions;
        var heading = document.createElement("h2");
        heading.innerHTML = cocktailMainIngredient;
        ingredientCocktailDiv.appendChild(heading);
  };





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

  randomBtnEl.on("click", displayrandomCocktail);

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
        };

