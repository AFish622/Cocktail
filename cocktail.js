	const defaultImage = 'http://www.31dover.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/3/1/31dover-bar-craft-stainless-steel-3-piece-cocktail-set.jpg'


	const bigCardTemplate = `<div class="row">
									<div class="col s12 l8 m7 offset-l2 offset-m2 big-card">
										<div class="card">
										<div class="card-action big-card-action">
												<a class="back-link" href="#">Back</a>
												<p class="drink-name"></p>
											</div>
											<div class="card-image">
												<img class="drink-thumbnail" height="425px" width="300px" src="">
												<span class="card-title"></span>
											</div>
											<div class="card content big-card-content">
												<p class="drink-ingredients"></p>
												<p class="drink-instructions"></p>
												<p class="drink-glass">Glass: </p>
											</div>
											
										</div>
									</div>
								</div>`

	const cardOutput = `<div class="col s12 m10 offset-m1 small-card">
								<h2 class="header"></h2>
								<div class="card horizontal  cocktail-link">
									<div class="card-image">
										<img class="card-image" src="">
									</div>
									<div class="card-stacked">
										<div class="card-content">
											<p class="cocktail-name"></p>
										</div>
										<div class="card-action">
											<a class="small-card-text" href="#">Let's make it</a>
										</div>
									</div>
								</div>
							</div>`

var getDataFromApi = function(endpoint, query, callback, hidden) {
	$.getJSON('https://www.thecocktaildb.com/api/json/v1/1/' + endpoint + query, function(data){
		!data.drinks ? noData() : callback(data, hidden);
		pageScroll();
	})

	.catch(err=> {
		noData();
		pageScroll();
	})
}

var noData = function(){
	$('.individual-result').hide();
	$('.results').html(`<h2>No drinks were found, please try search again</h2>
		<img height="200px" width="200px" src=https://www.displayfakefoods.com/store/pc/catalog/2417-lg.jpg>`);
}

const pageScroll = () => $('html,body').animate({scrollTop: $('.title').offset().top});

const renderDrinks = data => {
	const appendCocktails = data.drinks.map(function(drink){
	 	const $template = $(cardOutput);
	 	const imgSrc = drink.strDrinkThumb ? drink.strDrinkThumb.replace('http','https') : defaultImage;	
		$template.find('.card-image').attr('src', imgSrc);
		$template.find('.cocktail-name').append(drink.strDrink);
		return $template
	})
	$('.results').append(appendCocktails);
}

const renderIndividualCocktail = (data, hidden) =>{
	const $template = $(bigCardTemplate);

	const obj = data.drinks[0];

	const filteredKeys = Object.keys(obj)
							.filter(key => obj[key]);

	const ingredients = filteredKeys
							.filter(key => key.includes('strIngredient'))
							.map(key => obj[key]);

	const measurements = filteredKeys
	 						.filter(key => key.includes('strMeasure'))
	 						.map(key => obj[key]);

	obj.strDrinkThumb = obj.strDrinkThumb ? obj.strDrinkThumb.replace('http','https') : '';

	const {strDrink, strGlass, strInstructions, strDrinkThumb} = obj
	
	ingredients.forEach((ingredient, i) => {
		$template.find('.drink-ingredients').append(`<p>${measurements[i]} ${ingredients[i]}</p>`)
	})

	const imgSrc = strDrinkThumb || defaultImage;
	$template.find('.drink-thumbnail').attr('src', imgSrc)
	$template.find('.drink-name').append(strDrink);
	$template.find('.drink-glass').append(strGlass);
	$template.find('.drink-instructions').append(strInstructions);
	$('.results').hide();
	$('.individual-result').html($template).show()
	if(hidden){
		$('.back-link').hide();	
	}
}

var waitForClickOnSubmit = function() {
	$('.search-form').submit(function(event){
		event.preventDefault();
		const cocktailTarget = $('.main-search').val();
		$('.main-search').val('');
		const queryType = $('select').find(':selected').val();
		const endpoint = queryType == 'Ingredients' ? 'filter.php?i=' : 'search.php?s='
		$('.results').html('').show();
		getDataFromApi(endpoint, cocktailTarget, renderDrinks);
	})
}

var getRandomDrink = function() {
	$('.random-submit').click(function(event){
		event.preventDefault();
		getDataFromApi('random.php', '', renderIndividualCocktail, 'hide-back-link')
	})
}

var getIdOfChosenDrink = function(){
	$('body').on('click', '.cocktail-link', function(event){
		event.preventDefault();
		let chosenCocktail = $(this).find('.cocktail-name').text();
		getDataFromApi('search.php?s=', chosenCocktail, renderIndividualCocktail);
	})
}

var goBackOnClick = function() {
	$('body').on('click', '.back-link', function(event) {
		event.preventDefault();
		$('.individual-result').hide();
		$('.results').show();
	})
}

$(function(){
	waitForClickOnSubmit();
	getIdOfChosenDrink();
	getRandomDrink();
	goBackOnClick();
	$('select').material_select();
})
