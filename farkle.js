var diceArr = [];
let turnData = [];
let state = "beginGame"
let playerOneTotal;
let playerTwoTotal; 
let turnScore; 
let isPlayerOne;
let pOneScoreNode = document.getElementById("player-one-score")
let pTwoScoreNode = document.getElementById("player-two-score")
// Get button elements
let rollBtn = document.getElementById("roll-button");
let bankBtn = document.getElementById("bank-button");
let storeBtn = document.getElementById("store-button");
const diceDiv = document.getElementById("dice-div");
rollBtn.style.visibility = "hidden";
bankBtn.style.visibility = "hidden";
storeBtn.style.visibility = "hidden";
let NUM_OF_DICE = 6;

function initializeDice(){
	for(i = 0; i < 6; i++){
		diceArr[i] = {};
		diceVal = i + 1;
		diceArr[i].id = "die" + diceVal;
		diceArr[i].value = diceVal;
		diceArr[i].clicked = 0;
	}
}

function setAllDiceClicks() {
	let diceDivChildren = diceDiv.children;
	console.log("Children")
	console.log(diceDivChildren);
	console.log(diceDivChildren.length);
	for (let i = 0; i < diceDivChildren.length; i++){
		let currentDie = diceDivChildren[i];
		console.log(currentDie);
		currentDie.setAttribute("onclick", diceClick());
		console.log(currentDie);
	}
}


/*Rolling dice values*/
function rollDice(){
	for(var i=0; i < NUM_OF_DICE; i++){
		if(diceArr[i].clicked === 0){
			diceArr[i].value = Math.floor((Math.random() * 6) + 1);
		}
	}
	console.log(diceArr);
	updateDiceImg();
}

/*Updating images of dice given values of rollDice*/
function updateDiceImg(){
	var diceImage;
	for(var i = 0; i < NUM_OF_DICE; i++){
		diceImage = "images/" + diceArr[i].value + ".png";
		document.getElementById(diceArr[i].id).setAttribute("src", diceImage);
	}
}

function diceClick(img){
	console.log(img);
	var i = img.getAttribute("data-number");

	img.classList.toggle("transparent");
	img.removeAttribute("onclick");
	if(diceArr[i].clicked === 0){
		diceArr[i].clicked = 1;
	}
	else{
		diceArr[i].clicked = 0;
	}

}

/**
 * Initialize the starting vals for the game (everything to zero,
 * start at player one's turn, change game state to "startTurn")
 */
function initializeGame(){
	playerOneTotal = 0;
	playerTwoTotal = 0;
	turnScore = 0;
	turnData = [];
	isPlayerOne = true;
}



/**
 * Takes turn. Gameplay loop for each player resides in this function,
 * and then at the end of the turn, the players switch
 */
function takeTurn() {
	rollDice();
	//setAllDiceClicks();
	turnScore = 0;
	turnData = []
	if (state == "startTurn"){
		NUM_OF_DICE = 6;
		state = "continueTurn"
	}
	// Make dice non-transparent
	let dice = document.getElementsByClassName("die");
	for (let i = 0; i < dice.length; i++){
		let die = dice[i];
		if (die.classList.contains("transparent")){
			die.classList.remove("transparent");
		}
		diceArr[i].clicked = 0
	}
	// Make buttons accessible
	rollBtn.style.visibility = "visible";
	bankBtn.style.visibility = "visible";
	storeBtn.style.visibility = "visible";
	// Make the turnData array accessible to push die rolls

	// At this point, the player can work with the logic of the buttons
	if (isPlayerOne){
		
	}
	else {

	}
}

/**
 * Check the score (turnData array) based on the different possibilities.
 * Check for most complicated scorings first ([1, 1, 1], etc.) BEFORE 
 * simple scorings (1, or 5, etc.) to ensure they get counted.
 */
function checkScore() {
	// TODO: Dummy value, fix with actual scoring later
	scoringObject = {}
	turnScore = 0
	// Tally the number of repeats for each number on the die
	for (let i = 0; i < turnData.length; i++){
		numOnDie = turnData[i]
		if (numOnDie in scoringObject){
			scoringObject[numOnDie] += 1
		}
		else {
			scoringObject[numOnDie] = 1
		}
	}

	for (numOnDie in scoringObject){
		numOfRepeats = scoringObject[numOnDie];
		if (numOfRepeats >= 3){
			if (numOnDie == "1"){
					turnScore += 1000;
					scoringObject[numOnDie] -= 3
			}
			else if (numOnDie == "2"){
					turnScore += 200;
					scoringObject[numOnDie] -= 3			
			}
			else if (numOnDie == "3"){
					turnScore += 300;
					scoringObject[numOnDie] -= 3
			}
			else if (numOnDie == "4"){
					turnScore += 400;
					scoringObject[numOnDie] -= 3
			}
			else if (numOnDie == "5"){
					turnScore += 500;
					scoringObject[numOnDie] -= 3
			}
			else if (numOnDie == "6"){
					turnScore += 600;
					scoringObject[numOnDie] -= 3
			}

			if (scoringObject[numOnDie] < 1){
				delete scoringObject[numOnDie];
			}
		}
		if (numOnDie == "1"){
			turnScore += 100 * parseInt(scoringObject[numOnDie])
		}
		else if (numOnDie == "5"){
			turnScore += 50 * parseInt(scoringObject[numOnDie])
		}
	}
	console.log("Total turn score")
	console.log(turnScore)
}

function setScore() {
	console.log("P1 total");
	console.log(playerOneTotal);
	if (isPlayerOne){
		console.log("P1 total");
		console.log(playerOneTotal);
		playerOneTotal += turnScore
		pOneScoreNode.innerHTML = `P1: ${playerOneTotal }`
	}
	else {
		console.log("P2 total");
		console.log(playerTwoTotal);
		playerTwoTotal += turnScore
		pTwoScoreNode.innerHTML = `P2: ${playerTwoTotal}`
	}
	turnScore = 0
	turnData = []
}

/**
 * Should be called when someone presses store score button. Will run the selected dice 
 * for this turn through scoring algorithm, and add that total to the player's total
 * score. 
 */
function storeScore() {
	let clicked = 0
	let diceDiv = document.getElementsByClassName("dice");
	for (let i = 0; i < diceArr.length; i++){
		if (diceArr[i].clicked == 1){
			console.log(diceArr[i]);
			turnData.push(diceArr[i].value);
			clicked += 1

			//removeDie(i);
		}
	}
	checkScore()
	setScore()
	takeTurn()
	//checkScore();
}

/**
 * Simple function, just goes to the next player
 */
function switchPlayer(){
	isPlayerOne = !isPlayerOne;
	currentPlayer = "P1"
	let turnElement = document.getElementById("current-turn");
	if (!isPlayerOne){
		currentPlayer = "P2"
	}
	turnElement.innerText = `Turn: ${currentPlayer}`;
}


/**
 * Remove clicked dice for the remainder of that player's turn
 */
function removeDie() {

}

/**
 * Bank score really just switches to the other player's turn,
 * and starts their turn 
 */
function bankScore() {
	switchPlayer()
	console.log("Switching players")
	state = "startTurn"
	gameStates()
}

/**
 * Keep track of the different available states for the game
 * 
 */
function gameStates() {
	if (state == "beginGame"){
		initializeDice()
		initializeGame();
		state = "startTurn";
		gameStates();
	}
	else if (state == "startTurn"){
		takeTurn();
		
	}
	




}


gameStates() 
