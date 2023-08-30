"use strict"; 

//  Since the attempts to load files without server request (fetch API) and the user input (<input> file selection)
//  were unsuccessful, this script will: 
//  1) Store information that should stored on the server side (Database)
//  2) Emulate fetch API requests for getting the information
//  3) Facilitate the HTML page functionality. 
//  Thus, this script will be quite lengthy.

// Script-wide variables
let checkPrinciples = true;  // used for on / off logging into console some principles not related to the working logic of a page


// All logic related to the moment then page is loaded
document.addEventListener("DOMContentLoaded", () => {

    // Page elements handles
    const startButton = document.getElementById("launch-control-button"); const initMarginRight = startButton.style.marginRight; 
    const timeLivesBox = document.getElementById("time-lives-box"); 

    // Variables for after page loaded logic below
    let quizStarted = false;

    // Start / stop the quiz by the button click
    startButton.addEventListener("click", () => {
        quizStarted = !(quizStarted); changeElementsQuiz(); 
    });

    // Change element info, appearance after starting / stopping the quiz
    function changeElementsQuiz(){
        if (quizStarted){
            startButton.innerText = "Stop the Quiz!"; startButton.style.marginRight = "1.25em";
            timeLivesBox.style.display = "flex";
        } else{
            startButton.innerText = "Start the Quiz!"; startButton.style.marginRight = initMarginRight; 
            timeLivesBox.style.display = "none";
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
        
        // Check async function return
        getState(); 
    }
});

// Randomly select a State from available ones
async function getState(){
    let statesNumber = await getStatesNumber(); 
    let randomIndex = Math.floor(Math.random()*statesNumber); 
    console.log("Overall number of states: " + statesNumber + ". Selected state id: " + randomIndex); 
}

// Emulation of query to the back-end for getting overall number of States
function getStatesNumber(){
    let response = new Promise((resolve, reject) => {
        setTimeout(resolve(data["states_table"].length), 45); 
    });
    return response;
}

// Retrieve the state by the ID

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
