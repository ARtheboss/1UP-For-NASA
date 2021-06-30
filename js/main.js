
var wrongs = 0;
var questions = [];
var quiz_length;

var leaderboard = [];

var url = "https://api.myjson.com/bins/svz50";

var name = "asdf";

var insults = ["Your geography skills are as real as Atlantis","Let's just call that a misclick","Roses are red, violets are blue, you thought you were smart, but that's not true","Trigger happy?","Maybe if you didn't sleep in geography class..."]

var num_correct = 0;

var on_country;

var score = 0;
var timer = 0;

var songs = [[new Audio('song2.mp3'),75],[new Audio('song3.mp3'),43.5]]
var song_playing = songs[0][0];

var t;

class Question{

	constructor(json,question){
		var q = question + 1;
		this.q = json['q'+q].question;
		this.options = json['q'+q].options;
		this.answer = json['q'+q].answer;
		this.img = json['q'+q].image;
	}

}

function main(country){

	document.body.style.backgroundImage = 'url("giphy.gif")';

	on_country = country;

	hideCountryList();

	getJSONfile("https://spaceapps.advayratan.com/assets/"+country+'.json');

}

function hideCountryList(){
	document.getElementById('country-choices').style.display = 'none';
	document.getElementById('questions').style.display = 'block';
}


function hideStartPage(){
	document.getElementById('start-page').style.display = 'none';
	document.getElementById('title').style.fontSize = '3vw';
	document.getElementById('title').style.bottom = '2vw';
	document.getElementById('title-img').style.width = '5vw';
	document.getElementById('title-img').style.top = '1.5vw';
	document.getElementById('country-choices').style.display = 'block';
	document.getElementById('horse').style.display = 'block';
	document.getElementById('score-box').style.display = 'block';
	document.getElementById('strikes').style.display ='block';
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function generateQuestions(r){
	var json = JSON.parse(r);
	quiz_length = json['number of questions'];
	questions = [];
	for(var i = 0; i < quiz_length; i++){
		var q = new Question(json, i);
		questions.push(q);
	}
	questions = shuffle(questions);

	document.getElementById('timer-block').removeAttribute("style");
	document.getElementById('timer').removeAttribute("style");
	timer = 45;
	document.getElementById('timer').innerHTML = "0:45";
	decreaseTimer();

	var song_to_play = Math.floor(Math.random()*songs.length);
	song_playing = songs[song_to_play][0];
	song_playing.currentTime = songs[song_to_play][1];
	song_playing.play()
	songs.pop(song_to_play);

	populateDivs(questions[0],0);
}

function decreaseTimer(){
	t = setInterval(function(){
		timer -= 1;
		if(timer < 10){
			document.getElementById('timer').innerHTML = "0:0"+timer;
		}else{
			document.getElementById('timer').innerHTML = "0:"+timer;
		}
		if(timer == 10){
			document.getElementById('timer-block').style.width = '15vw';
			document.getElementById('timer').style.fontSize = '4vw';
		}
		if(timer == 5){
			document.getElementById('timer-block').style.width = '20vw';
			document.getElementById('timer').style.fontSize = '5vw';
			document.getElementById('timer').style.color = 'red';
		}
		if(timer == 0){
			clearInterval(t);
			setTimeout(function(){
				document.getElementById('horse').style.opacity = 1;
				document.getElementById('horse').innerHTML = "Too slow. Study before you come back.";
				window.location.href = "https://worldview.earthdata.nasa.gov/";
			},2000)
		}
	},999)
}

function populateDivs(q,on){
	correct = 0;
	if(on == quiz_length){
		backToList();
	}else{
		document.getElementById('question').innerHTML = q.q;

		var d = new Date();
		var time = d.getTime();
		if(q.img == 'true'){
			document.getElementById('answers').style.height = "63%";
			for(var i = 0; i < 4; i++){
				var div = document.getElementById('answer'+i);
				div.style.display = 'inline-block';
				div.removeAttribute("style")
				div.innerHTML = "<img src='"+q.options[i]+"'>";
				div.onclick = function(){answer(this,'answer'+q.answer,time,on)}
				div.style.height = "40%";
			}
		}else{
			document.getElementById('answers').style.height = "30%";
			for(var i = 0; i < 4; i++){
				var div = document.getElementById('answer'+i);
				if(i >= q.options.length){
					div.style.display = 'none';
				}else{
					div.style.display = 'inline-block';
					div.removeAttribute("style")
					div.innerHTML = q.options[i];
					div.onclick = function(){answer(this,'answer'+q.answer,time,on)}
				}
				div.style.height = "29%";
			}
		}
	}	
}


function messUp(){
	getInsult();
	wrongs += 1;
	document.getElementById('strike'+wrongs).style.opacity = 1;
	if(wrongs == 3){
		gameDone();
	}
	/*
	var countries = document.getElementsByClassName("country");
	console.log(countries.length);
	countries = countries[Math.floor(Math.random()*countries.length)];
	var img = countries.childNodes[1];
	console.log(img)
	img.src = '';*/
}

function getRandomColor(){ 
  return "hsl(" + 360 * Math.random() + ',100%,50%';
}


function getInsult(){
	var div = document.getElementById('insult');
	div.style.visibility = 'visible';
	//var rand = Math.floor(Math.random()*insults.length);
	div.innerHTML = insults[wrongs];
	div.style.background = getRandomColor();
	setTimeout(function(){div.style.visibility = 'hidden';},2000);
}

function scoreString(n){
	var s = n.toString();
	var l = s.length;
	if(l == 1){
		return "000"+s;
	}else if(l == 2){
		return "00"+s;
	}else if(l == 3){
		return "0"+s;
	}else{
		return s;
	}
}


function answer(picked,correct,t,on){
	for(var i = 0; i < 4; i++){
		document.getElementById('answer'+i).style.background = 'white';
		document.getElementById('answer'+i).onclick = function(){};
	}
	var d = new Date();
	var time = d.getTime();
	if(picked.id == correct){
		document.getElementById(correct).style.background = 'green';
		num_correct++;
		score++;
	}else{
		picked.style.background = 'red';
		document.getElementById(correct).style.background = 'green';
		messUp();
	}
	document.getElementById('score').innerHTML = scoreString(score);
	setTimeout(function(){populateDivs(questions[on+1],on+1)},1500)
}


function backToList(){
	clearInterval(t)
	if(num_correct == quiz_length){
		document.getElementById(on_country).style.background = 'green';
		document.getElementById(on_country).childNodes[3].style.color = 'white';
		score += 100;
		console.log(score);
		document.getElementById('score').innerHTML = scoreString(score);
	}
	document.getElementById('country-choices').style.display = 'block';
	document.getElementById('questions').style.display = 'none';
	document.body.removeAttribute("style")
	song_playing.pause();
	//getJSONfile(url);

}

function getJSONfile(url,c,q){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	generateQuestions(xhttp.responseText);
		    //parseLeaderboard(xhttp.responseText);
	    }
	};
	
	xhttp.open("GET", url, true);
	xhttp.send();
}

function parseLeaderboard(r){
	leaderboard = JSON.parse(r);

	var existing = false;
	for(var i = 0; i < leaderboard.length; i++){
		if(leaderboard[i][0] == name){
			leaderboard[i][1] = score;
			existing = true;
		}
	}

	if(existing == false){
		leaderboard.push([name,score]);
	}

	leaderboard.sort(compareSecondColumn).reverse();

	console.log(leaderboard);

	uploadData(url,leaderboard);

	console.log(leaderboard.indexOf(name));

	console.log(leaderboard.length);

	var mypos = 0;
	for(var i = 0; i < leaderboard.length; i++){
		console.log(leaderboard[i])
		if(leaderboard[i][0] == name){
			mypos = i + 1;
		}
	}

	alert("You are "+mypos+" place!");

}

function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}

function uploadData(location,query){
	try{
		$.ajax({
			url:location,
			type:"PUT",
			data:JSON.stringify(query),
			contentType:"application/json; charset=utf-8",
			dataType:"json",
			success: function(data, textStatus, jqXHR){}
		});  
	}catch(err){
		alert("You are offline, cannot connect to leaderboard!");
	}
}


function gameDone(){
	song_playing.pause();
	document.getElementById('horse').style.zIndex = 100;
	setTimeout(function(){document.getElementById('horse').style.opacity = 1;document.getElementById('horse').innerHTML = 'You tried your best...';setTimeout(function(){document.getElementById('horse').innerHTML = 'but you still need to study';setTimeout(function(){window.location.href = "https://worldview.earthdata.nasa.gov/";},2000)},2000)},1500)
}
