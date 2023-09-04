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
    const startButton = document.getElementById("launch-control-button"); const rightAnswersIndicator = document.getElementById("right-answers"); 
    const timeLivesBox = document.getElementById("time-lives-box"); const livesNumberElement = document.getElementById("lives-number");
    const timeBar = document.getElementById("remaining-time-bar"); const questionElement = document.getElementById("quiz-question");
    const quizBox = document.getElementById("quiz-box"); const footer = document.getElementById("page-footer");
    const answer1 = document.getElementById("answer-variant-1"); const answer2 = document.getElementById("answer-variant-2");
    const answer3 = document.getElementById("answer-variant-3"); const answer4 = document.getElementById("answer-variant-4");
    const pageHeader = document.getElementById("project-header"); 

    // Variables for after page loaded logic below
    const initMarginRight = startButton.style.marginRight;  const footerMarginTopDefault = footer.style.marginTop;
    quizBox.style.display = "none"; const headerMarginTopDefault = pageHeader.style.marginTop; 
    let startLives = parseInt(livesNumberElement.dataset.amount);  let lives = startLives;
    let quizStarted = false; let questionNumber = 1;  let rightAnswersTotal = 0;
    let maxTimeForAnswer = 11; let remainedTimerSeconds = maxTimeForAnswer; 
    let rightAnswerIndex = 0; let givenAnswerIndex = -1;
    let answerTypes = ["Capital", "Largest City"];
    const answerVariants = [answer1, answer2, answer3, answer4];  // store all 4 variants HTML elements
    let timerHandle = undefined;  // store handle for counting down the remained for giving an answer time

    // Start / stop the quiz by the button click
    startButton.addEventListener("click", () => {
        quizStarted = !(quizStarted); changeElementsQuiz(); 
    });

    // Change element info, appearance after starting / stopping the quiz
    function changeElementsQuiz(){
        if (quizStarted){
            // set all values to the default values
            startButton.innerText = "Stop the Quiz!"; startButton.style.marginRight = "1.25em";
            timeLivesBox.style.display = "flex"; timeBar.max = maxTimeForAnswer; timeBar.value = maxTimeForAnswer;
            questionNumber = 1; lives = startLives; remainedTimerSeconds = maxTimeForAnswer; lives = startLives; 
            rightAnswersTotal = 0;  livesNumberElement.innerText = ` Lives: ${lives} `; 
            rightAnswersIndicator.innerText = ` Right answers: ${rightAnswersTotal} `;
            quizBox.style.display = "flex"; footer.style.marginTop = "5vh"; pageHeader.style.marginTop = "0.4em";
            prepareQuestion(); timerHandle = setTimeout(timer, 1000); 
        } else {
            startButton.innerText = "Start the Quiz!"; startButton.style.marginRight = initMarginRight; 
            timeLivesBox.style.display = "none";  quizBox.style.display = "none";
            footer.style.marginTop = footerMarginTopDefault; pageHeader.style.marginTop = headerMarginTopDefault;
        }
    }
    
    // Timer for counting down remained time for answering
    function timer(){
        if ((quizStarted) && (lives > 0)){
            if (remainedTimerSeconds > 0){
                remainedTimerSeconds -= 1; timeBar.value = remainedTimerSeconds;
                timerHandle = setTimeout(timer, 1000);  // call again this function after 1 second
            } else {
                lives -= 1; livesNumberElement.innerText = ` Lives: ${lives} `;
                if (lives === 0){
                    quizStarted = !(quizStarted); changeElementsQuiz(); 
                } else {
                    remainedTimerSeconds = maxTimeForAnswer; timeBar.value = maxTimeForAnswer;
                    timerHandle = setTimeout(timer, 1000);  // call again this function after 1 second
                }
            }
        }
    }

    // Cancelling count down the time and refreshing the timer
    function cancelTimer(){
        if (timerHandle !== undefined){
            clearTimeout(timerHandle); 
            remainedTimerSeconds = maxTimeForAnswer; timeBar.value = maxTimeForAnswer;
        }
    }

    // Prepare the quiz question and answer variants
    async function prepareQuestion(){
        let questionIndex = Math.floor(Math.random()*answerTypes.length);  // select randomly type of the question
        let state = await getRandomState();  // randomly get state from the emulated database
        rightAnswerIndex = Math.floor(Math.random()*4);   // randomly select the answer variant with the right answer
        let rightAnswerText = ""; 
        if (state !== undefined){
            let stateName = state["state_name"];
            // compose the quiz question, record the right answer  
            if (questionIndex === 0){
                questionElement.innerText = `What is the capital city of ${stateName}?`; 
                rightAnswerText = state["capital_city"]; 
            } else if (questionIndex === 1) {
                questionElement.innerText = `What is the largest city of ${stateName}?`; 
                rightAnswerText = state["largest_city"]; 
            }
            // compose the answer variants - only for question types #1 and #2
            if (questionIndex < 2){
                let wrongAnswersIndex = 0; 
                let wrongAnswers = await getWrongAnswers(questionIndex, state); 
                for (let i = 0; i < 4; i++){
                    // placing right answer
                    if (i === rightAnswerIndex){
                        answerVariants[i].innerText = rightAnswerText;
                    } else {
                        // placing wrong answers
                        answerVariants[i].innerText = wrongAnswers[wrongAnswersIndex];
                        wrongAnswersIndex += 1;
                    }
                }
            }
        } else {
            console.log("No state obtained, check console for error reports"); 
        }
    }

    // Generate another answer variants
    async function getWrongAnswers(questionTypeIndex, selectedState) {
        let wrongAnswers = ["", "", ""];  let sameStateOtherCity = undefined;
        let sameStateOtherCityIndex = Math.floor(Math.random()*3);  // randomly select the index for the same state but other city (capital <=> largest)
        let otherState1 = undefined; let otherState2 = undefined;  // for getting 2 different randomly selected states
        // random selection of the first state different from selected state for the quiz question
        while (otherState1 === undefined) {
            otherState1 = await getRandomState(); 
            if (selectedState["state_name"] === otherState1["state_name"]) {
                otherState1 = undefined; 
            } else break;
        }
        // random selection of second state, different from the first one and the state for the quiz
        while (otherState2 === undefined) {
            otherState2 = await getRandomState(); 
            if ((selectedState["state_name"] === otherState2["state_name"]) || (otherState1["state_name"] === otherState2["state_name"])) {
                otherState2 = undefined; 
            } else break;
        }
        let states = [otherState1, otherState2];  // for accessing later
        // checking that the largest and capital cities are different for the selected for the question state
        if (selectedState["largest_city"] !== selectedState["capital_city"]) {
            // saving other city as the answer variant if capital and largest cities are different
            if (questionTypeIndex === 0) sameStateOtherCity = selectedState["largest_city"];
            else sameStateOtherCity = selectedState["capital_city"];
        } else {
            // checking other cities from the two selected before states if they are different
            if (otherState1["largest_city"] !== otherState1["capital_city"]) {
                if (questionTypeIndex === 0) sameStateOtherCity = otherState1["largest_city"];
                else sameStateOtherCity = otherState1["capital_city"];
            } else if (otherState2["largest_city"] !== otherState2["capital_city"]) {
                if (questionTypeIndex === 0) sameStateOtherCity = otherState2["largest_city"];
                else sameStateOtherCity = otherState2["capital_city"];
            } else {
                let otherState3 = undefined; 
                // select 3rd random state
                while (otherState3 === undefined){
                    otherState3 = await getRandomState(); 
                    if ((selectedState["state_name"] === otherState3["state_name"]) || (otherState1["state_name"] === otherState3["state_name"]) ||
                    (otherState2["state_name"] === otherState3["state_name"])) {
                        otherState3 = undefined; 
                    } else break;
                }
                if (questionTypeIndex === 0) sameStateOtherCity = otherState3["capital_city"];
                else sameStateOtherCity = otherState3["largest_city"];
            }   
        }
        // filling the wrong answers array
        let otherStateIndex = 0; 
        for (let i = 0; i < 3; i++){
            if(i === sameStateOtherCityIndex){
                wrongAnswers[i] = sameStateOtherCity; 
            } else {
                wrongAnswers[i] = (questionTypeIndex === 0)? states[otherStateIndex]["capital_city"] : states[otherStateIndex]["largest_city"];
                otherStateIndex += 1;
            }
        }
        return wrongAnswers; 
    }

    // Bind click events to the single handling function
    answer1.addEventListener('click', (e) => { getClickedElement(e); }); answer2.addEventListener('click', (e) => { getClickedElement(e); });
    answer3.addEventListener('click', (e) => { getClickedElement(e); }); answer4.addEventListener('click', (e) => { getClickedElement(e); });

    // Get the clicked element - get the answer and check it
    function getClickedElement(event){
        // cancel the current Timer counting down the remained time for the giving an answer
        cancelTimer();  
        // get the number of the answer
        switch (event.target.id){
            case answer1.id:
                givenAnswerIndex = 1; break;
            case answer2.id:
                givenAnswerIndex = 2; break;
            case answer3.id:
                givenAnswerIndex = 3; break;
            case answer4.id:
                givenAnswerIndex = 4; break;
        }
        // Check if the question is right or not
        if (givenAnswerIndex === (rightAnswerIndex + 1)){
            rightAnswersTotal += 1; 
            rightAnswersIndicator.innerText = ` Right answers: ${rightAnswersTotal} `; 
            prepareQuestion();  // prepare new question
            timerHandle = setTimeout(timer, 1000);  // start again the stopped timer
        } else {
            lives -= 1; livesNumberElement.innerText = ` Lives: ${lives}`;  // reduce number of lives
            if (lives > 0) {
                prepareQuestion();  // prepare new question
                timerHandle = setTimeout(timer, 1000);  // start again the stopped timer
            } else {
                quizStarted = !(quizStarted); changeElementsQuiz(); 
            }
        }
        
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
async function getRandomState(){
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
            setTimeout(reject("State id is out of range"), 20);
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
    "states_table": [{"state_id": 1, "state_name": "Alabama", "abbreviation": "AL", "capital_city": "Montgomery", "largest_city": "Huntsville"},
                    {"state_id": 2, "state_name": "Alaska", "abbreviation": "AK", "capital_city": "Juneau", "largest_city": "Anchorage"},
                    {"state_id": 3, "state_name": "Arizona", "abbreviation": "AZ", "capital_city": "Phoenix", "largest_city": "Phoenix"},
                    {"state_id": 4, "state_name": "Arkansas", "abbreviation": "AR", "capital_city": "Little Rock", "largest_city": "Little Rock"},
                    {"state_id": 5, "state_name": "California", "abbreviation": "CA", "capital_city": "Sacramento", "largest_city": "Los Angeles"},
                    {"state_id": 6, "state_name": "Colorado", "abbreviation": "CO", "capital_city": "Denver", "largest_city": "Denver"},
                    {"state_id": 7, "state_name": "Connecticut", "abbreviation": "CT", "capital_city": "Hartford", "largest_city": "Bridgeport"},
                    {"state_id": 8, "state_name": "Delaware", "abbreviation": "DE", "capital_city": "Dover", "largest_city": "Wilmington"},
                    {"state_id": 9, "state_name": "Florida", "abbreviation": "FL", "capital_city": "Tallahassee", "largest_city": "Jacksonville"},
                    {"state_id": 10, "state_name": "Georgia", "abbreviation": "GA", "capital_city": "Atlanta", "largest_city": "Atlanta"},
                    {"state_id": 11, "state_name": "Hawaii", "abbreviation": "HI", "capital_city": "Honolulu", "largest_city": "Honolulu"},
                    {"state_id": 12, "state_name": "Idaho", "abbreviation": "ID", "capital_city": "Boise", "largest_city": "Boise"},
                    {"state_id": 13, "state_name": "Illinois", "abbreviation": "IL", "capital_city": "Springfield", "largest_city": "Chicago"},
                    {"state_id": 14, "state_name": "Indiana", "abbreviation": "IN", "capital_city": "Indianapolis", "largest_city": "Indianapolis"},
                    {"state_id": 15, "state_name": "Iowa", "abbreviation": "IA", "capital_city": "Des Moines", "largest_city": "Des Moines"},
                    {"state_id": 16, "state_name": "Kansas", "abbreviation": "KS", "capital_city": "Topeka", "largest_city": "Wichita"},
                    {"state_id": 17, "state_name": "Kentucky", "abbreviation": "KY", "capital_city": "Frankfort", "largest_city": "Louisville"},
                    {"state_id": 18, "state_name": "Louisiana", "abbreviation": "LA", "capital_city": "Baton Rouge", "largest_city": "New Orleans"},
                    {"state_id": 19, "state_name": "Maine", "abbreviation": "ME", "capital_city": "Augusta", "largest_city": "Portland"},
                    {"state_id": 20, "state_name": "Maryland", "abbreviation": "MD", "capital_city": "Annapolis", "largest_city": "Baltimore"}]
}
