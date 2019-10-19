

var wrongs = 0;
var questions = [];
const quiz_length = 10;

var leaderboard = [];

var url = "https://api.myjson.com/bins/svz50";

var name = "asdf";

class Question{

	constructor(name,question){
		question = question + 1
		getJSONfile('assets/'+name+'.json');
	}

}

function main(country){

	hideCountryList();

	questions = generateQuestions(country);

	populateDivs(questions[0],0);
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
}

function generateQuestions(country){
	var qs = [];
	for(var i = 0; i < quiz_length; i++){
		var q = new Question(country, i);
		qs.push(q);
	}
	return qs;
}

function populateDivs(q,on){
	if(on == quiz_length){
		endGame();
	}else{
		document.getElementById('question').innerHTML = q.question;

		var d = new Date();
		var time = d.getTime();
		if(q.img){
			for(var i = 0; i < 4; i++){
				var div = document.getElementById('answer'+i);
				div.removeAttribute("style")
				div.innerHTML = "<img src='"+q.options[i]+"'>";
				div.onclick = function(){answer(this,'answer'+q.answer,time,on)}
			}
		}else{
			for(var i = 0; i < 4; i++){
				var div = document.getElementById('answer'+i);
				div.removeAttribute("style")
				div.innerHTML = q.options[i];
				div.onclick = function(){answer(this,'answer'+q.answer,time,on)}
			}
		}
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
		//score += 100-Math.min(Math.round(Math.sqrt((time-t)/8)),50);
	}else{
		picked.style.background = 'red';
		document.getElementById(correct).style.background = 'green';
		wrongs += 1;
		horse.style.opacity += 0.2;
		if(wrongs == 5){
			gameDone();
		}
	}
	document.getElementById('score').innerHTML = score;

	setTimeout(function(){populateDivs(questions[on],on+1)},2000)
}


function backToList(){

	document.getElementById('country-choices').style.display = 'block';
	document.getElementById('questions').style.display = 'none';
	//getJSONfile(url);

}

function getJSONfile(url,c){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	toConstructor(xhttp.responseText,c);
		    //parseLeaderboard(xhttp.responseText);
	    }
	};
	
	xhttp.open("GET", url, true);
	xhttp.send();
}

function toConstructor(r,c){
	var json = JSON.parse(r);
	c.q = json['q'+question].question;
	c.options = json['q'+question].options;
	c.answer = json['q'+question].answer;
	c.img = json['q'+question].image;
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

}
