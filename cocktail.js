const drinksUrl = "http://www.thecocktaildb.com/api/json/v1/1/search.php";

$(function(){
	waitForClickOnSubmit();
})

//Function waiting for user to click submit button.
function waitForClickOnSubmit() {
	$('.search-form').submit(function(event){
		event.preventDefault();
		const cocktailTarget = $('.main-search').val();
		$('.main-search').val('')
		const queryType = $('select').find(':selected').val();
		const callback = queryType == 'Ingredients' ? getIngredients : getDrink
		const endpoint = queryType == 'Ingredients' ? 'filter.php?i=' : 'search.php?s='
		getDataFromApi(endpoint, cocktailTarget, callback)
	})
}

function getDataFromApi(endpoint, query, callback) {
	$.getJSON('http://www.thecocktaildb.com/api/json/v1/1/' + endpoint + query, function(data){
		callback(data)
	})
}

function getIngredients(data) {
	data.drinks.forEach(function(ingredient){
	$('.results').append('<li class="appendCocktail">' + ingredient.strDrink + '</li>')
	})
	console.log('Hello from ingredients')
	console.log(data)
}

function getDrink(data) {
	data.drinks.forEach(function(drink){
		$('.results').append('<li class="appendCocktail">' + drink.strDrink + '</li>');
		console.log(drink.strDrink);
	})
	console.log('Hello from drinks')
	//console.log(data)
}

// function getIndDrink(obj) {
// 	const filtered = Object.keys(obj).filter(key => {
// 		return  key.includes('ingredients') && obj[key]
// 	})

// 	.map(key => obj[key])
// }



//function getIdOfChosenDrink(){
	$('body').on('click', '.cocktailLink', function(event){
		event.preventDefault();
		$('.appendCocktail').addClass('hidden');
		let chosenCocktail = $(this).text()
		$.getJSON('http://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + chosenCocktail, function(object){
			var template = $('#drink-template').html();
			var drinkItem = object.drinks[0];
			$(template).find('.drink-name').text(drinkItem.strDrink);
			$('.detailed-results').append(template);
		})
	})
//}

 


//Function to take user input and search API for drink by ID
// function getCocktailDatafromApi(searchwords) {
// 	$.getJSON('http://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchwords, function(data) {
// 			data.drinks.forEach(function(drink){
// 				var currentDrink = drink.idDrink;
// 				let drinkNumber = drink.idDrink;
// 				getCocktail(drinkNumber);
// 				//console.log(drink.idDrink);
// 				//$('.results').append(drink.idDrink);
// 			})
// 	})
// }

// function getIngredientDataFromApi(searchword) {
// 	$.getJSON('http://www.thecocktaildb.com/api/json/v1/1/search.php?i=' + searchword, function(data) {
// 		data.ingredients.forEach(function(ingredient){
// 			let searchedIngredient = ingredient.strIngredient
// 			getCocktailIngredients(searchedIngredient);
// 		})
// 	})
// }

// function getCocktail(drinkId) {
// 	$.getJSON('http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + drinkId, function(id){
// 		console.log(id);
// 		id.drinks.forEach(function(drink){
// 			let cocktailName = drink.strDrink
// 			$('.results').append('<li class="appendCocktail"><a class="cocktailLink" href="">' + cocktailName + '</a></li>')
// 		})
// 		//getIdOfChosenDrink();
// 	})
// }