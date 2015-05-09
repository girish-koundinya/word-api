var natural = require('natural');

var wordnet = new natural.WordNet();

var csv = require('fast-csv');


var firebase = require('firebase');

var rootRef = new firebase('https://wordapp1.firebaseio.com/questions/');


parseCSV("words.csv");


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function parseCSV(filename){

	var questionWord = [];

	csv
 	.fromPath(filename)
 	.on("data", function(data){
	 	questionWord.push(data);
 	})
 	.on("end", function(){

		generateQuestion(questionWord);

 	});
}

function generateQuestion(questionWord) {
 				
 				var question = {};
 				var random = getRandomInt(0,questionWord.length);
 				question.qWord = (questionWord[random]).toString();
 				generateSynonym(question.qWord,function(responseString){
					question.answer   = responseString;
					question.choices  = [];
					question.choices.push(responseString);
					random = getRandomInt(0,questionWord.length);
					question.choices.push(questionWord[random].toString());
					random = getRandomInt(0,questionWord.length);
					question.choices.push(questionWord[random].toString());
					random = getRandomInt(0,questionWord.length);
					question.choices.push(questionWord[random].toString());
	 				addToQuestionBank(question);
 				});

}



var synonyms = [];
function generateSynonym(word,callback){
	wordnet.lookup(word, function(results) {
		var i = 0;
		results.forEach(function(result) {
			result.synonyms.forEach(function(synonym){
				if(word != synonym){
					synonyms.push(synonym); 
					i++;
					if(i == results.length){
						callback (synonyms[0]);
					} 
				}
			});
		});
	});
}


function addToQuestionBank(questionObject) {

		if(Object.getOwnPropertyNames(questionObject).length != 0){
			console.log(JSON.stringify(questionObject));
			rootRef.push(questionObject);
		}

}





