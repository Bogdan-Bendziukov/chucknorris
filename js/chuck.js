"use strict";

const CHUCK_API = 'https://api.chucknorris.io/jokes/';

const jokeForm = document.getElementById("joke-form");
const searchResult = document.getElementById("search-result");

let getChuck = async (endpoint) => {
	const response = await fetch(CHUCK_API + endpoint);
	const data = await response.json();
	return data;
}

let printJokes = (data) => {
	let jokeDiv = document.createElement('div');
	jokeDiv.setAttribute('class', 'joke-single');
}

getChuck('categories').then(data => {
	const jokeCatsDiv = document.getElementsByClassName('joke-cats')[0];
	for (let i = 0; i < data.length; i += 1) {
		let radio = document.createElement('input');
		radio.setAttribute('type', 'radio');
		radio.setAttribute('class', 'radio');
		radio.setAttribute('value', data[i]);
		radio.setAttribute('id', data[i].replace(/ /g,"_"));
		radio.setAttribute('name', 'joke-cat');
		if (i == 0) {
			radio.setAttribute('checked', true);
		}
		
		let label = document.createElement('label');
		label.setAttribute('for', data[i].replace(/ /g,"_"));
		label.innerHTML = data[i];
		
		jokeCatsDiv.appendChild(radio);
		jokeCatsDiv.appendChild(label);
	}
});

jokeForm.addEventListener("submit", jokeFormSubmit, false);

function jokeFormSubmit(event){
	event.preventDefault();
	const jokeTypes = jokeForm.querySelectorAll('[name="joke-type"]');
	const jokeCats = jokeForm.querySelectorAll('[name="joke-cat"]');
	const jokeSearch = jokeForm.querySelectorAll('[name="joke-search"]')[0];
	for (let i = 0; i < jokeTypes.length; i += 1) {
		if (jokeTypes[i].checked) {
			switch (jokeTypes[i].value) {
				case 'random':
					getChuck('random').then(data => {
						console.log(data);
					});
					break;
				case 'categories':
					for (let n = 0; n < jokeCats.length; n += 1) {
						if (jokeCats[n].checked) {
							getChuck('random?category=' + jokeCats[n].value).then(data => {
								console.log(data);
							});
							break;
						}
					}
					break;
				case 'search':
					getChuck('search?query=' + encodeURI(jokeSearch.value)).then(data => {
						console.log(data);
					});
					break;
				default:
					break;
			}
			break;
		}
	}
}