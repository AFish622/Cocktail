const drinksUrl = "http://www.thecocktaildb.com/api/json/v1/1/search.php";
const listingTemplate = '<a class="listing-template" href=""></a>'

$(function(){
	waitForSubmit();
})

//Function waiting for user to click submit button.
function waitForSubmit(){
	$('.search-form').submit(function(event){
		event.preventDefault();
		$('.search-results').find('.results').html('<p></p>');
		const queryTarget = $(this).find('.main-search').val();
		let searchword = queryTarget
		$(this).find('.main-search').val('')
		getDatafromApi(searchword);
		})
}

//Function to take user input and search API for drink by ID
function getDatafromApi(searchwords){
	$.getJSON('http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + searchwords, function(data) {
			data.drinks.forEach(function(drink){
				let drinkNumber = drink.idDrink;
				getCocktail(drinkNumber);
				//console.log(drink.idDrink);
				//$('.results').append(drink.idDrink);
			})
	})
}

function getCocktail(drinkId) {
	$.getJSON('http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + drinkId, function(id){
		id.drinks.forEach(function(drink){
			let cocktailName = drink.strDrink
			$('.results').append('<li class="appendCocktail">' + cocktailName + '</li>')
			getCocktailDetails(cocktailName);
		})
	})
}

function getCocktailDetails(specificDrink) {
	$.getJSON('http://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + specificDrink, function(drink){
		console.log(drink)
	})
}
 
