const template = 
	`<div class="drink-template">
		<img class="drink-thumbnail" src="" height="200px" width="200px">
		<br/>
		<label></label>
		<span class="drink-name"></span>
		<br/>
		<label></label>
		<span class="drink-ingredients"></span>
		<br/>
		<label>Instructions: </label>
		<span class="drink-instructions"></span>
		<br/>
		<label>Glassware: </label>
		<span class="drink-glass"></span>
		<br/>
	</div>`


var getDataFromApi = function(endpoint, query, callback) {
	$.getJSON('https://www.thecocktaildb.com/api/json/v1/1/' + endpoint + query, function(data){
		!data.drinks ? noData() : callback(data);
	})

	.catch(err=> {
		noData();
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
 console.log(data);
	const $template = $(template)

	const obj = data.drinks[0];

	const filteredKeys = Object.keys(obj)
							.filter(key => obj[key]);

	const ingredients = filteredKeys
							.filter(key => key.includes('strIngredient'))
							.map(key => obj[key]);

	const measurements = filteredKeys
	 						.filter(key => key.includes('strMeasure'))
	 						.map(key => obj[key]);

	 const thumbnail = (window.location.protocol.indexOf('https') !== -1) ? obj.strDrinkThumb.replace(/http:/g,'https:') : obj.strDrinkThumb;

	// const thumbnail = obj.strDrinkThumb
	const name = obj.strDrink;
	const glassware = obj.strGlass;
	const howTo = obj.strInstructions;

	ingredients.forEach((ingredient, i) => {
		$template.find('.drink-ingredients').append(`<p>${measurements[i]} ${ingredients[i]}</p>`)
	})

	const defaultImage = 'https://tabatavaleria.files.wordpress.com/2011/03/bartender02.gif'
	const imgSrc = thumbnail || defaultImage;
	$template.find('.drink-thumbnail').attr('src', imgSrc)
	$template.find('.drink-name').append(name);
	$template.find('.drink-glass').append(glassware);
	$template.find('.drink-instructions').append(howTo);
	console.log(obj)
	$('.clone-target').append($template)
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

var getRandomDrink = function() {
	$('.random-submit').click(function(event){
		event.preventDefault();
		$('.clone-target').text('');
		$.getJSON('https://www.thecocktaildb.com/api/json/v1/1/random.php', function(data){
			const $template = $(template)
			const obj = data.drinks[0];

			const filteredKeys = Object.keys(obj)
							.filter(key => obj[key]);

			const ingredients = filteredKeys
							.filter(key => key.includes('strIngredient'))
							.map(key => obj[key]);

			const measurements = filteredKeys
	 						.filter(key => key.includes('strMeasure'))
	 						.map(key => obj[key]);

			ingredients.forEach((ingredient, i) => {
				$template.find('.drink-ingredients').append(`<p class="detailed-list">${measurements[i]} ${ingredients[i]}</p>`)
			})



			const randomThumbnail = obj.strDrinkThumb
			const randomName = obj.strDrink;
			const randonGlassware = obj.strGlass;
			const randomInstructions = obj.strInstructions
			const defaultImage = 'https://tabatavaleria.files.wordpress.com/2011/03/bartender02.gif'
			const imgSrc = randomThumbnail || defaultImage;

			$template.find('.drink-thumbnail').attr('src', imgSrc)
			$template.find('.drink-name').append(randomName);
			$template.find('.drink-glass').append(randonGlassware);
			$template.find('.drink-instructions').append(randomInstructions);
			$('.clone-target').append($template)
		})
	})
}

var getIdOfChosenDrink = function(){
	$('body').on('click', '.cocktailLink', function(event){
		event.preventDefault()
		$('.appendCocktail').addClass('hidden');
		let chosenCocktail = $(this).text();
		getDataFromApi('search.php?s=', chosenCocktail, renderIndividualCocktail);
	})
}

$(function(){
	waitForClickOnSubmit();
	getIdOfChosenDrink();
	getRandomDrink();
})
