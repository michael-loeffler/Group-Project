# Karaoke Knights

## Description

Karaoke Knights is an interactive application that combines music and cocktails to create fun-filled, shared experiences with family or friends. Our application houses all the tools necessary to create a successful Karaoke Night: the ability to search for songs, view lyrics, as well as find fun cocktail recipes to enjoy throughout the night.

Our team wanted to create this tool because we all enjoy karaoke and spending time with friends/family, and having a way to easily recreate a karaoke experience at home would be a great way to gather and connect with loved ones. Karaoke is a simple concept; all you need are lyrics, music, and people looking to have a good time! No need for expensive karaoke machines or crowded bar karaoke nights; with the Karaoke Knights app you and your best friends can create memorable and fun experiences in your living room, paired with delicious new cocktail recipes to try out.

Through working on this project, we learned a lot about utilizing and manipulating the data fetched from Server-Side APIs to display pertinent information for users. Some of the biggest points of learning include:

* Using logic to find out if a user has any data stored in localStorage to determine what to populate the page with (if anything)
* Processing user input into the desired format (e.g., trimming, encodeURI, etc.)
* Passing user input into a URL to be fetched
* Retrieving pertinent data from the API call and formatting/displaying it for the user using JavaScript to create HTML elements
* Figuring out how to dynamically add information to arrays, add those arrays to an object, and pass that object into localStorage for later retrieval
	* Simultaneously using a count variable to set the id attribute of HTML elements to later be used as an index to reference the correct information for that element as stored in the objects in localStorage
* Using the localStorage.removeItem method to clear out specific parts of the localStorage
* When to use arrow functions to call functions with parameters during click events
* Leveraging the .empty() jQuery method to clear out an HTML element of all children elements to reset a portion of the page for restyling
* Learning how to use a new CSS Framework (Bulma) to easily format and style a web page to desired criteria

## User Story
```
AS A group of friends
WE WANT to find the lyrics to our favorite songs and recipes for fun cocktails
SO THAT we can easily host a Karaoke Night
```

## Acceptance Criteria
```
GIVEN a karaoke tool with form inputs
WHEN I search for an artist or a song title
THEN I am presented with a list of song titles relating to that artist or song title
WHEN I view the list of songs
THEN I am presented with song titles, the artist name, the album it is on, album art, as well as a heart icon to "Add to Up Next"
WHEN I click on a song
THEN the page clears and I am presented with that song's lyrics
WHEN I view the lyrics page
THEN I am presented with a "Return to Search" button, the song title, artist name, and album title at the top of the page, followed by the lyrics
WHEN I click on the "Return to Search" button
THEN I am brought back to the list of songs rendered from the previous search
WHEN I view a song’s lyric page
THEN the song information is stored in localStorage and displayed in a list of "Recent Selections"
WHEN I click on the "Add to Up Next" button for a particular song
THEN the song information is stored in localStorage and displayed in an "Up Next" list
WHEN I reload the page
THEN all songs stored in the "Recent Selections" and "Up Next" lists remain on the page
WHEN I click on the "Clear" button for either "Recent Selections" or "Up Next", then those songs are erased from the screen and from localStorage
WHEN I click on the random drink button
THEN I am presented with a random drink 
WHEN I view the random drink
THEN I am presented with the cocktail name, a cocktail image, the cocktail ingredients, and instructions to make the cocktail
```

## Installation

N/A

## Usage

Karaoke Knights functions by first accepting user input. A user can input data into one main area: Artist and Song search. The application processes and formats user input, and then passes it as a query parameter to the associated API fetch. Then the desired data is retrieved from the JSON response of the API call to then be formatted and added to the page dynamically using JavaScript to create new HTML elements. 

For an artist/song search, the user is presented with a list of songs related to the search with song name, artist name, and album name displayed along with album art. As these elements are created, some are assigned a number as an id which will serve as an index for an array that is simultaneously being built containing the associated lyrics API urls. When a user clicks on a song, the id of the song that was clicked on is obtained and used to locate the associated lyrics API url. Another fetch is performed and the user is now shown the lyrics for that song. When a user chooses to view the lyrics for a song, the song info is added to the "Recent Selections" list. The HTML elements are created to display the song on the list, and the song info and lyrics API url is added to an object that is passed into localStorage. That way, if the user clicks on that song in the "Recent Selections" list, they are again shown the lyrics of that song, and this "Recent Selections" list persists on page reload. A similar process is executed when a user clicks the heart icon next to a song to add it to the "Up Next" list (queue). Users are able to clear their "Recent Selections" and "Up Next" list (this process also clears that data from localStorage). Finally, when viewing a lyrics page, a user can click “Return to Search” and will be presented again with the song results from their most recent search.

A user can choose to click a button to view a random cocktail. Any time a cocktail is displayed, the page features the name of the cocktail, an image, a list of ingredients, and instructions on how to make the drink. For each of these scenarios, the desired data is formatted and added to the page dynamically using JavaScript to create new HTML elements. 


## Link to deployed application:
[https://michael-loeffler.github.io/Karaoke-Knights/](https://michael-loeffler.github.io/Karaoke-Knights/)

## Preview of application and demonstration of features

![Preview of application and demonstration of features](./assets/images/KaraokeKnightsDemo.jpeg)

## Credits

* Bulma CSS Framework
* Happi Music API
* The Cocktail DB API
* Fontawesome icons
* jQuery

## Names of contributing developers
* Michael Loeffler (michael-loeffler)
* Maria Rodriguez (mariadolores06)
* Muna Zeki (MunaZekia)

