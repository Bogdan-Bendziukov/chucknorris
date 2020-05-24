"use strict";

import '../css/chuck.less';

const CHUCK_API = 'https://api.chucknorris.io/jokes/';

const jokeForm = document.getElementById("joke-form");
const searchResult = document.getElementById("search-result");
const favourites = document.getElementById("favourites");
const favMobBtn = document.getElementById("fav-mob");
const overlay = document.getElementById("overlay");

let getChuck = async (endpoint) => {
	const response = await fetch(CHUCK_API + endpoint);
	if (response.status == 200) {
		const data = await response.json();
		return data;
	}
	throw new Error("Couldn't get data from Chuck!");
}

let printJokes = (data, placeholder = searchResult, isFav = false) => {
	if (!data) {
		placeholder.innerHTML = 'Nothing found'; 
		return;
	}
	
	let jokeDiv = document.createElement('div');
	let jokeCats = '';
	let jokeLiked = '';
	let jokeUpdated = data.updated_at ? (Date.now() - Date.parse(data.updated_at)) : (Date.now() - Date.parse(data.created_at));
	let hours = Math.floor(jokeUpdated/1000/60/60);
	if (data.categories && data.categories.length > 0) {
		for (let i = 0; i < data.categories.length; i += 1) {
			jokeCats =`<span class="joke-cat">${data.categories[i]}</span>`;
		}
	}
	
	jokeDiv.setAttribute('class', 'joke-single');
	if (isFav) {
		jokeDiv.classList.add('fav');
		jokeLiked = 'liked';
	}
	jokeDiv.innerHTML = `
				<div class="joke-single__inner">
					<span class="joke-like ${jokeLiked}" data-id="${data.id}" data-url="${data.url}" data-value="${data.value}" data-updated_at="${data.updated_at}"></span>
					<div class="joke-id">ID: <a href="${data.url}" target="_blank">${data.id}</a></div>
					<div class="joke-text">
					${data.value}
					</div>
					<div class="joke-bottom">
						<span class="joke-updated">Last update: ${hours} hours ago</span>
						${jokeCats}
					</div>
				</div>`;
	
	placeholder.appendChild(jokeDiv);
	
}

function jokeFormSubmit(event){
	event.preventDefault();
	searchResult.innerHTML = '';
	const jokeTypes = jokeForm.querySelectorAll('[name="joke-type"]');
	const jokeCats = jokeForm.querySelectorAll('[name="joke-cat"]');
	const jokeSearch = jokeForm.querySelectorAll('[name="joke-search"]')[0];	
	
	for (let i = 0; i < jokeTypes.length; i += 1) {
		if (jokeTypes[i].checked) {
			switch (jokeTypes[i].value) {
				case 'random':
					getChuck('random').then(data => {
						//console.log(data);
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
					if (jokeSearch.value) {
						jokeSearch.classList.remove('invalid');
						getChuck('search?query=' + encodeURI(jokeSearch.value)).then(data => {
							// print random jokes from search
							// printJokes( data.result[Math.floor(Math.random() * data.result.length)] );	
							
							// print all jokes
							for (let res = 0; res < data.result.length; res += 1) {								
								printJokes( data.result[res] );	
							}							
						});
					} else {
						jokeSearch.classList.add('invalid');
					}
					break;
				default:
					break;
			}
			break;
		}
	}
}

function jokeLike(event) {
	if(lsTest() === true){
		const el = event.target;
		let chuckJokes = JSON.parse(localStorage.getItem("chuckJokes"));
		if (!chuckJokes) chuckJokes = {};
		const jokeObj = {
			[el.getAttribute('data-id')]: {
				"id": el.getAttribute('data-id'),
				"value": el.getAttribute('data-value'),
				"url": el.getAttribute('data-url'),
				"updated_at": el.getAttribute('data-updated_at')
			}
		};
		if (chuckJokes.hasOwnProperty(el.getAttribute('data-id'))) {
			delete chuckJokes[el.getAttribute('data-id')];
			el.classList.remove('liked');
			setTimeout(() => {
				if (el.closest('.joke-single.fav')){
					el.closest('.joke-single.fav').remove();
					document.querySelectorAll('[data-id="' + el.getAttribute('data-id') + '"]')[0].classList.remove('liked');
				} else {
					favourites.innerHTML = '';
					printFavJokes();
				}
			}, 500);
		} else {
			Object.assign(chuckJokes, jokeObj);
			el.classList.add('liked');
			printJokes(jokeObj[el.getAttribute('data-id')], favourites, true);
		}
		localStorage.setItem("chuckJokes", JSON.stringify(chuckJokes));
		
	} else {
		throw new Error("No place to save your data, sorry :(");
	}
}

function lsTest(){
    var test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}

function printFavJokes() {	
	let chuckJokes = JSON.parse(localStorage.getItem("chuckJokes"));
	if (chuckJokes) {
		for (let i in chuckJokes) {
			printJokes(chuckJokes[i], favourites, true);
		}
	}
}

function favMobToggle(){
	document.getElementsByClassName('site-sidebar')[0].classList.toggle('open');
	overlay.classList.toggle('open');
	favMobBtn.classList.toggle('open');
}
    


jokeForm.addEventListener("submit", jokeFormSubmit, false);
favMobBtn.addEventListener("click", favMobToggle, false);
overlay.addEventListener("click", favMobToggle, false);
document.addEventListener('click',function(event){
    if( event.target && event.target.classList.contains('joke-like') ){
        jokeLike(event);
    }
 });

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

printFavJokes();

