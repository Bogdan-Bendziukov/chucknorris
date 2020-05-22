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
	let jokeCats = '';
	let jokeUpdated = Date.now() - Date.parse(data.updated_at);
	let hours = Math.floor(jokeUpdated/1000/60/60);
	if (data.categories.length > 0) {
		for (let i = 0; i < data.categories.length; i += 1) {
			jokeCats =`<span class="joke-cat">${data.categories[i]}</span>`;
		}
	}
	jokeDiv.setAttribute('class', 'joke-single');	
	jokeDiv.innerHTML = `
				<div class="joke-single__inner">
					<span class="joke-like" data-id="${data.id}"></span>
					<div class="joke-id">ID: <a href="${data.url}" target="_blank">${data.id}</a></div>
					<div class="joke-text">
					${data.value}
					</div>
					<div class="joke-bottom">
						<span class="joke-updated">Last update: ${hours} hours ago</span>
						${jokeCats}
					</div>
				</div>`;
	
	searchResult.appendChild(jokeDiv);
	
}

function jokeFormSubmit(event){
	event.preventDefault();
	
	const jokeTypes = jokeForm.querySelectorAll('[name="joke-type"]');
	const jokeCats = jokeForm.querySelectorAll('[name="joke-cat"]');
	const jokeSearch = jokeForm.querySelectorAll('[name="joke-search"]')[0];
	
	searchResult.innerHTML = '';
	
	for (let i = 0; i < jokeTypes.length; i += 1) {
		if (jokeTypes[i].checked) {
			switch (jokeTypes[i].value) {
				case 'random':
					getChuck('random').then(data => {
						console.log(data);
						printJokes(data);
					});
					break;
				case 'categories':
					for (let n = 0; n < jokeCats.length; n += 1) {
						if (jokeCats[n].checked) {
							getChuck('random?category=' + jokeCats[n].value).then(data => {
								printJokes(data);
							});
							break;
						}
					}
					break;
				case 'search':
					getChuck('search?query=' + encodeURI(jokeSearch.value)).then(data => {
						printJokes( data.result[Math.floor(Math.random() * data.total)] );						
					});
					break;
				default:
					break;
			}
			break;
		}
	}
}

jokeForm.addEventListener("submit", jokeFormSubmit, false);

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
		label.setAttribute('class', 'joke-cat');
		label.innerHTML = data[i];
		
		jokeCatsDiv.appendChild(radio);
		jokeCatsDiv.appendChild(label);
	}
});
