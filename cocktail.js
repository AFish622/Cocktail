const drinksUrl = "http://www.thecocktaildb.com/api/json/v1/1/search.php"


$(function(){
	waitForSubmit();
})

//Function waiting for user to click submit button.
function waitForSubmit(){
	$('.search-form').submit(function(event){
		event.preventDefault();
		const queryTarget = $(this).find('.main-search').val();
		let searchword = queryTarget
		$(this).find('.main-search').val('')
		getDatafromApi(searchword);
		})
}

function getDatafromApi(searchwords){
	$.getJSON('http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + searchwords, function(data) {
			data.drinks.forEach(function(drink){
				let drinkNumbers = drink.idDrink;
				getCocktail(drinkNumbers);
				//console.log(drink.idDrink);
				//$('.results').append(drink.idDrink);
			})
	})
}

function getCocktail(drinkId) {
	$.getJSON('http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + drinkId, function(id){
		console.log(id);
	})
}
