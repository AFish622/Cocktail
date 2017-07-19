
var getDataFromApi = function(endpoint, query, callback) {
	$.getJSON('http://www.thecocktaildb.com/api/json/v1/1/' + endpoint + query, function(data){
		const hasData = data.drinks === null ? noData() : callback(data);
	})
}

var noData = function(){
	$('.results').text('No drinks were found, please try search again');
}

var renderIngredients = function(data) {
	data.drinks.forEach(function(ingredient){
		$('.results').append('<li class="appendCocktail"><a class="cocktailLink" href="">' + ingredient.strDrink + '</a></li>')
	})
}

const renderDrink = data => {
	const toAppend = data.drinks.map(function(drink){
		return '<li class="appendCocktail"><a class="cocktailLink" href="">' + drink.strDrink + '</a></li>';
	})
	$('.results').append(toAppend)
}

var renderIndividualCocktail = function(data){
	$('.drink-thumbnail, .drink-name, .drink-glass, .drink-instructions').text('');
	$('.drink-ingredients').text('');
	$('.drink-template').removeClass('hidden');

	const obj = data.drinks[0];

	console.log(obj)

	const filteredKeys = Object.keys(obj)
							.filter(key => obj[key]);

	const ingredients = filteredKeys
							.filter(key => key.includes('strIngredient'))
							.map(key => obj[key]);

	const measurements = filteredKeys
	 						.filter(key => key.includes('strMeasure'))
	 						.map(key => obj[key]);

	const thumbnail = obj.strDrinkThumb
	const name = obj.strDrink;
	const glassware = obj.strGlass;
	const howTo = obj.strInstructions;

	ingredients.forEach((ingredient, i) => {
		$('.drink-ingredients').append(`<p class="detailed-list">${measurements[i]} ${ingredients[i]}</p>`)
	})
	
	var drinkThumbnail = thumbnail === null ? $('.drink-thumbnail').attr('src', 'https://tabatavaleria.files.wordpress.com/2011/03/bartender02.gif') : $('.drink-thumbnail').attr('src', thumbnail);
	$('.drink-name').append(name);
	$('.drink-glass').append(glassware);
	$('.drink-instructions').append(howTo);
}

var waitForClickOnSubmit = function() {
	$('.search-form').submit(function(event){
		event.preventDefault();
		const cocktailTarget = $('.main-search').val();
		$('.drink-template').addClass('hidden');
		$('.search-results').removeClass('hidden');
		$('.main-search').val('');
		const queryType = $('select').find(':selected').val();
		const callback = queryType == 'Ingredients' ? renderIngredients : renderDrink
		const endpoint = queryType == 'Ingredients' ? 'filter.php?i=' : 'search.php?s='
		$('.results').text('');
		$('drink-template').text('');
		getDataFromApi(endpoint, cocktailTarget, callback);
	})
}

var getIdOfChosenDrink = function(){
	$('body').on('click', '.cocktailLink', function(event){
		event.preventDefault();
		$('.appendCocktail').addClass('hidden');
		let chosenCocktail = $(this).text();
		getDataFromApi('search.php?s=', chosenCocktail, renderIndividualCocktail);

	})
}

$(function(){
	waitForClickOnSubmit();
	getIdOfChosenDrink();
})
