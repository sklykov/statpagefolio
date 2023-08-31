"use strict"; 

//  Since the attempts to load files without server request (fetch API) and the user input (<input> file selection)
//  were unsuccessful, this script will: 
//  1) Store information that should stored on the server side (Database)
//  2) Emulate fetch API requests for getting the information
//  3) Facilitate the HTML page functionality. 
//  Thus, this script will be quite lengthy.

// Script-wide variables
let checkPrinciples = false;  // used for on / off logging into console some principles not related to the working logic of a page


// All logic related to the moment then page is loaded
document.addEventListener("DOMContentLoaded", () => {

    // Page elements handles
    const startButton = document.getElementById("launch-control-button");
    const initMarginRight = startButton.style.marginRight; 
    const timeLivesBox = document.getElementById("time-lives-box"); 
    const livesNumberElement = document.getElementById("lives-number");
    const timeBar = document.getElementById("remaining-time-bar"); const questionElement = document.getElementById("quiz-question");
    const answer1 = document.getElementById("answer-variant-1"); const answer2 = document.getElementById("answer-variant-2");
    const answer3 = document.getElementById("answer-variant-3"); const answer4 = document.getElementById("answer-variant-4");

    // Variables for after page loaded logic below
    let startLives = parseInt(livesNumberElement.dataset.amount);  let lives = startLives;
    let quizStarted = false; let questionNumber = 1;  
    let maxTimeForAnswer = 4; let remainedTimerSeconds = maxTimeForAnswer; 
    let rightAnswer = 0; let givenAnswer = -1; 
    let answerTypes = ["Capital", "Largest City"];

    // Start / stop the quiz by the button click
    startButton.addEventListener("click", () => {
        quizStarted = !(quizStarted); changeElementsQuiz(); 
    });

    // Change element info, appearance after starting / stopping the quiz
    function changeElementsQuiz(){
        if (quizStarted){
            startButton.innerText = "Stop the Quiz!"; startButton.style.marginRight = "1.25em";
            timeLivesBox.style.display = "flex"; timeBar.max = maxTimeForAnswer; timeBar.value = maxTimeForAnswer;
            questionNumber = 1; lives = startLives; remainedTimerSeconds = maxTimeForAnswer; lives = startLives; 
            prepareQuestion(); 
            livesNumberElement.innerText = ` Lives: ${lives}`; setTimeout(timer, 1000); 
        } else {
            startButton.innerText = "Start the Quiz!"; startButton.style.marginRight = initMarginRight; 
            timeLivesBox.style.display = "none"; 
        }
    }
    
    // Timer for counting down remained time for answering
    function timer(){
        if ((quizStarted) && (lives > 0)){
            if (remainedTimerSeconds > 0){
                remainedTimerSeconds -= 1; timeBar.value = remainedTimerSeconds;
                setTimeout(timer, 1000);  // call again this function after 1 second
            } else {
                lives -= 1; livesNumberElement.innerText = ` Lives: ${lives}`;
                if (lives === 0){
                    quizStarted = !(quizStarted); changeElementsQuiz(); 
                } else {
                    remainedTimerSeconds = maxTimeForAnswer; timeBar.value = maxTimeForAnswer;
                    setTimeout(timer, 1000);  // call again this function after 1 second
                }
            }
        }
    }

    // Prepare question, answer variants
    async function prepareQuestion(){
        let answerIndex = Math.floor(Math.random()*answerTypes.length);  // select randomly type of the question
        let state = await getState();  // randomly get state from the emulated database
        if (state !== undefined){
            let stateName = state["state"]; 
            if (answerIndex === 0){
                questionElement.innerText = `What is the capital city of ${stateName}`; 
            } else if (answerIndex === 1) {
                questionElement.innerText = `What is the largest city of ${stateName}`; 
            }
        } else {
            console.log("No state obtained, check console"); 
        }
    }

    // Bind click events to the single handling function
    answer1.addEventListener('click', (e) => { getClickedElement(e); }); answer2.addEventListener('click', (e) => { getClickedElement(e); });
    answer3.addEventListener('click', (e) => { getClickedElement(e); }); answer4.addEventListener('click', (e) => { getClickedElement(e); });

    // Get the clicked element - get the answer and check it
    function getClickedElement(event){
        // console.log("Answer:", event.target.id); 
        switch (event.target.id){
            case answer1.id:
                givenAnswer = 1; break;
            case answer2.id:
                givenAnswer = 2; break;
            case answer3.id:
                givenAnswer = 3; break;
            case answer4.id:
                givenAnswer = 4; break;
        }
        // console.log("Number of the given answer", givenAnswer);
        prepareQuestion();  // prepare new question
    }

    // Check some principles, code parts
    if (checkPrinciples){
        // Direct access to the stored data, for loop used for data object
        for (let countryEntry of data["countries_table"]){
            console.log(countryEntry); 
        }
        // Simulation of a request and handling returned Promise
        getCapital("Some Country")
            .then((retrievedCapital) => console.log(retrievedCapital))
            .catch((error) => console.log(error));
        getCapital("TBD4")
            .then((retrievedCapital) => console.log(retrievedCapital))
            .catch((error) => console.log(error));
    }       
});

// Randomly select a State from available ones
async function getState(){
    let statesNumber = await getStatesNumber(); 
    let randomIndex = Math.floor(Math.random()*statesNumber); 
    // console.log("Overall number of states: " + statesNumber + ". Selected state id: " + randomIndex); 
    return await getStateById(randomIndex);  // return the result of emulated request to the backend
}

// Emulation of query to the back-end for getting overall number of States
function getStatesNumber(){
    let response = new Promise((resolve, reject) => {
        setTimeout(resolve(data["states_table"].length), 45); 
    });
    return response;
}

// Retrieve the state by the provided ID
function getStateById(id){
    let response = new Promise((resolve, reject) => {
        if ( (id >= 0) && (id < data["states_table"].length)){
            setTimeout(resolve(data["states_table"][id]), 40);
        } else {
            setTimeout(reject("State id out of range"), 20);
        }
    }); 
    return response;
}

// Emulation of requesting the back-end code to search for data (capital) of some country (input)
function getCapital(country){
    let response = new Promise((resolve, reject) => {
        let foundCapital = searchCapital(country); 
        if (foundCapital !== undefined){
            setTimeout(resolve(foundCapital), 50);
        } else {
            setTimeout(reject("Capital Not Found for " + String(country)), 75);
        }
    });
    return response;
}

// Search the capital for the country
function searchCapital(country){
    let capital = undefined; 
    // Basic search, not optimized in for loop for the capital. Complexity - O(N).
    for (let countryEntry of data["countries_table"]){
        if (country === countryEntry["country"]){
            capital = countryEntry["capital"]; break;
        }
    }
    return capital;
}

// Basic data storage as the object data type. It's not efficient for search algorithm but it's 
// possible represent the JSON response from the server. It's used because of the serverless implementation of the page.
const data = {
    "countries_table": [{"country_id": 1, "country": "TBD1", "capital": "Cap1"},
                        {"country_id": 2, "country": "TBD2", "capital": "Cap2"},
                        {"country_id": 3, "country": "TBD3", "capital": "Cap3"},
                        {"country_id": 4, "country": "TBD4", "capital": "Cap4"}],
    // Source - the Wikipedia website
    "states_table": [{"state_id": 1, "state": "Alabama", "abbreviation": "AL", "capital_city": "Montgomery", "largest_city": "Huntsville"},
                    {"state_id": 2, "state": "Alaska", "abbreviation": "AK", "capital_city": "Juneau", "largest_city": "Anchorage"},
                    {"state_id": 3, "state": "Arizona", "abbreviation": "AZ", "capital_city": "Phoenix", "largest_city": "Phoenix"},
                    {"state_id": 4, "state": "Arkansas", "abbreviation": "AR", "capital_city": "Little Rock", "largest_city": "Little Rock"},
                    {"state_id": 5, "state": "California", "abbreviation": "CA", "capital_city": "Sacramento", "largest_city": "Los Angeles"},
                    {"state_id": 6, "state": "Colorado", "abbreviation": "CO", "capital_city": "Denver", "largest_city": "Denver"},
                    {"state_id": 7, "state": "Connecticut", "abbreviation": "CT", "capital_city": "Hartford", "largest_city": "Bridgeport"}]
}
