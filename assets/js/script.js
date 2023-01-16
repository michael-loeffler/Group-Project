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



