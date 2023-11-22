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

    // Set width and height for the background image element to represent it. There are the issue with getting actual height value of the main element
    // The code below doesn't provide good way of setting the width and height
    const mainElement = document.querySelector("main");  // get the main page content container
    // const mainContainerWidth = getComputedStyle(mainElement).getPropertyValue("width"); 
    // const mainContainerHeight = getComputedStyle(mainElement).getPropertyValue("height");  // Actually, return the number larger than actually calculated
    // let mainSizes = mainElement.getBoundingClientRect(); console.log(mainSizes);  // returns the bounding sizes of the main element
    // const mainContainerWidth = Math.floor(mainSizes["width"]); const mainContainerHeight = Math.floor(mainSizes["height"]);
    // const mainContainerWidth = mainElement.scrollWidth; const mainContainerHeight = mainElement.scrollHeight; 
    // const backgroundImageBox = document.getElementById("background-image-box");
    // backgroundImageBox.style.width = `${mainContainerWidth}px`; backgroundImageBox.style.height = `${mainContainerHeight}px`; 

    // Page elements handles and associated variables
    const startButton = document.getElementById("launch-control-button"); const startButtonText = document.getElementById("launch-button-text");
    const timeLivesBox = document.getElementById("time-lives-box"); const livesNumberElement = document.getElementById("lives-number");
    const timeBar = document.getElementById("remaining-time-bar"); const questionElement = document.getElementById("quiz-question");
    const quizBox = document.getElementById("quiz-box"); const footer = document.getElementById("page-footer");
    const answer1 = document.getElementById("answer-variant-1"); const answer2 = document.getElementById("answer-variant-2");
    const answer3 = document.getElementById("answer-variant-3"); const answer4 = document.getElementById("answer-variant-4");
    const pageHeader = document.getElementById("project-header"); const head = document.querySelector("head");
    const rightAnswersIndicator = document.getElementById("right-answers"); const statisticsTableBox = document.getElementById("statistics-table-box"); 
    const initialStringStatistics = document.getElementById("initial-statistics-string"); 
    const rightAnswersTable = document.getElementById("table-right-answers");  const passedSecondsTable = document.getElementById("passed-time-answers");
    const remainedLivesTable = document.getElementById("remained-lives-answers"); const projectShortInfo = document.getElementById("project-short-description"); 
    const rank = document.getElementById("rank"); const initialRank = rank.innerText;  
    const hoveredBackgroundColor = "darkslategray";  // difficult to retrieve stored for CSS pseudoclass value in JS

    // Variables and constants for the function within the DOMContentLoaded event handler
    const initMarginRight = parseFloat(getComputedStyle(startButton).getPropertyValue("margin-top"));
    const footerMarginTopDefault = parseFloat(getComputedStyle(footer).getPropertyValue("margin-top"));
    const headerMarginTopDefault = parseFloat(getComputedStyle(pageHeader).getPropertyValue("margin-top"));
    const initComputedStartButtonWidth = parseFloat(getComputedStyle(startButton).getPropertyValue("width"));  // getting computed button width
    const initComputedStartButtonHeight = parseFloat(getComputedStyle(startButton).getPropertyValue("height"));
    const initMarginTop = getComputedStyle(mainElement).getPropertyValue("margin-top");  // direct access through mainElement.style.marginTop is impossible
    const initialBackground = getComputedStyle(answer1).getPropertyValue("background-color");  // direct access return the empty string, so this way works
    const initMarginTopStartButton = getComputedStyle(startButton).getPropertyValue("margin-top");
    const initialFontSizeLives = parseFloat(getComputedStyle(livesNumberElement).getPropertyValue("font-size"));  
    const heartSymbol = "&#10084"; const animationsDuration = 2000; quizBox.style.display = "none"; 
    let startLives = parseInt(livesNumberElement.dataset.amount);  let lives = startLives;
    let quizStarted = false; let questionNumber = 0; let rightAnswersTotal = 0;
    let maxTimeForAnswer = 11; let remainedTimerSeconds = maxTimeForAnswer; 
    let rightAnswerIndex = 0; let givenAnswerIndex = -1; let passedSeconds = 0;
    let answerTypes = ["Capital", "Largest City"];
    const answerVariants = [answer1, answer2, answer3, answer4];  // store all 4 variants HTML elements
    let timerHandle = undefined;  // store handle for counting down the remained for giving an answer time
    let buttonStartedStyleElementCreated = false; let buttonStartedStyle = undefined; let playedGames = 0; 

    // Start / stop the quiz by the button click
    startButton.addEventListener("click", handleStartButtonClick);
    function handleStartButtonClick() { 
        quizStarted = !(quizStarted); changeElementsQuiz(); 
    }

    // Change element info, appearance after starting / stopping the quiz
    function changeElementsQuiz(){
        if (quizStarted) {
            // Quiz started, show the Quiz associated elements and set default values
            passedSeconds = 0; 
            if (playedGames === 0){
                initialStringStatistics.style.display = "none";  // remove the initial informational string
            }
            // For the small screen width devices - remove the project short description
            if (window.screen.width <= 925) { projectShortInfo.style.display = "none"; }
            // Preserve initial margin for the medium- and large-length devices
            if (window.screen.width <= 1280) { pageHeader.style.marginTop = initMarginTop; }
            // Remove event listener for disable clicking on the button between transitions
            startButton.removeEventListener("click", handleStartButtonClick); 
            animateStartButton();  // visualize that the clicking is disabled
            // below - re-assign handling of clicks after animation is done
            setTimeout(()=>{startButton.addEventListener("click", handleStartButtonClick);}, animationsDuration*0.65);
            // Set initial values for quiz starting
            timeBar.max = maxTimeForAnswer; timeBar.value = maxTimeForAnswer;
            questionNumber = 1; lives = startLives; remainedTimerSeconds = maxTimeForAnswer;
            rightAnswersTotal = 0;  livesNumberElement.innerHTML = `${heartSymbol}: ${lives}`; 
            rightAnswersIndicator.innerText = ` Right answers: ${rightAnswersTotal} `; rank.innerText = initialRank; rank.style.color = "black";
            startButtonText.innerText = "Stop the Quiz"; startButton.style.marginTop = initMarginTop;
            animateTimeLivesBox(); timeLivesBox.style.display = "flex";   // Animate appearance of the box with remaining time, # of lives and right answers 
            animateQuizBox(); quizBox.style.display = "flex";  // Animate appearance of the box with the quiz question and answer variants
            // Change styling of elements around appeared elements
            footer.style.marginTop = `${Math.floor(0.4*footerMarginTopDefault)}px`;
            startButton.style.width = `${Math.floor(0.7*initComputedStartButtonWidth)}px`;  // ...% of initial button width
            startButton.style.height = `${Math.floor(0.7*initComputedStartButtonHeight)}px`;  // ...% of initial button height
            // Prepare quiz: prepare question and answer variants, bind handlers
            setTimeout(()=>{ trackClickedVariants(); }, 50);
            prepareQuestion(); timerHandle = setTimeout(timer, 1.5*animationsDuration); 
            // Load special CSS file for handling colors of launch (start) button
            if (!buttonStartedStyleElementCreated){
                buttonStartedStyle = document.createElement("link"); 
                buttonStartedStyle.href = "./launch_btn_started_quiz.css"; buttonStartedStyle.rel = "stylesheet"; 
                buttonStartedStyleElementCreated = true;
            }
            head.appendChild(buttonStartedStyle);  // the style will be automatically loaded, the button appearance will be changed
            statisticsTableBox.style.display = "none";  // remove the table with games statistics
        } else {
            // Quiz finished
            footer.style.display = "none";  // remove footer for preventing blink appearance it before animation
            // Remove event listener for disable clicking on the button between transitions
            startButton.removeEventListener("click", handleStartButtonClick); 
            // Remove listeners from the answer variants
            setTimeout(()=>{ trackClickedVariants(false); }, 10);
            // Remove quiz area + make disappearance of the start button
            disappearStartButton();  // fade out the start button, duration = quiz area disappearance
            animateTimeLivesBox(true); animateQuizBox(true); // animation of fading out of boxes
            // Below - disappearance of the quiz, the time / lives box box
            setTimeout(()=> {quizBox.style.display = "none"; timeLivesBox.style.display = "none"}, 0.98*animationsDuration);
            // Re-assign handling of clicks after animation of disappearance is done
            setTimeout(()=>{
                animateStartButton(true);  // animate Start button appearance
                animateStatisticsTable();  statisticsTableBox.style.display = "flex";  // animate the appearance of the table with statistics
                startButtonText.innerText = "Start the Quiz"; startButton.style.marginRight = `${initMarginRight}px`; 
                // Remove styling of started button, keep default one by the removing the special external style
                head.removeChild(buttonStartedStyle);  // default style will be returned back to "Start Button"
                // Return initial styling by the assigning stored in this script values
                startButton.style.width = `${initComputedStartButtonWidth}px`;  // initial button width
                startButton.style.height = `${initComputedStartButtonHeight}px`;  // initial button height
                startButton.style.marginTop = initMarginTopStartButton;  // initial margin top
                footer.style.display = "block";  // footer will appear in the end of animation
                // tune some margins for small device width
                if (window.screen.width > 925) { 
                    footer.style.marginTop = `${Math.floor(0.35*footerMarginTopDefault)}px`;  // decrease margin top because the statistics table appeared
                } else {
                    footer.style.marginTop = `${Math.floor(1.45*footerMarginTopDefault)}px`;  // increase margin top for moving footer to the page bottom
                }
                pageHeader.style.marginTop = `${Math.floor(0.55*headerMarginTopDefault)}px`;
            }, 
                animationsDuration);  // visualize appearance of the Start button with the initial style
            // Below - returning back handle to clicking of the Start button
            setTimeout(()=>{startButton.addEventListener("click", handleStartButtonClick); startButton.style.opacity = 1;}, 1.25*animationsDuration);
            // Put statistics in the table
            rightAnswersTable.innerText = `${rightAnswersTotal}`; passedSecondsTable.innerText = `${passedSeconds}`; 
            remainedLivesTable.innerText = `${lives}`; 
            playedGames += 1;  // count how many games were played
        }
    }
    
    // Timer for counting down remained time for answering
    function timer(){
        if ((quizStarted) && (lives > 0)){
            if (remainedTimerSeconds > 0){
                passedSeconds += 1;  // just count for statistics
                remainedTimerSeconds -= 1; timeBar.value = remainedTimerSeconds;
                timerHandle = setTimeout(timer, 1000);  // call again this function after 1 second
            } else {
                lives -= 1; livesNumberElement.innerHTML = `${heartSymbol}: ${lives}`;
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

    // Animate box with the remaining time and number of lives appearance, the simple "Fade In" effect
    const timeLivesBoxEffect = [{opacity: 0}, {opacity: 1}]; const timeLivesBoxRevEffect = [{opacity: 1}, {opacity: 0}];
    const timeLivesBoxEffectTiming = {duration: animationsDuration, iterations: 1}; 
    function animateTimeLivesBox(reverse=false){
        if (!reverse){
            timeLivesBox.animate(timeLivesBoxEffect, timeLivesBoxEffectTiming);
        } else {
            timeLivesBox.animate(timeLivesBoxRevEffect, timeLivesBoxEffectTiming);
        }
    }

    // Animate start button to show that it's disabled during appearance / disappearance of the quiz section
    const startButtonEffect = [{opacity: 0.25}, {opacity: 1}]; const startButtonRevEffect = [{opacity: 0}, {opacity: 1}]; 
    const startButtonTiming = {duration: 0.75*animationsDuration, iterations: 1}; 
    const startButtonRevTiming = {duration: 0.25*animationsDuration, iterations: 1};
    function animateStartButton(reverse=false){
        if (!reverse){
            startButton.animate(startButtonEffect, startButtonTiming);
        } else {
            startButton.animate(startButtonRevEffect, startButtonRevTiming);
        }
    }
    const startButtonDisappearEffect = [{opacity: 1}, {opacity: 0}]; 
    function disappearStartButton(){
        startButton.animate(startButtonDisappearEffect, timeLivesBoxEffectTiming);
    }

    // Animate the quiz box (questions and answer variants)
    const quizBoxEffect = [{opacity: 0}, {opacity: 1}]; const quizBoxReverseEffect = [{opacity: 1}, {opacity: 0}];
    function animateQuizBox(reverse=false){
        if (!reverse){
            quizBox.animate(quizBoxEffect, timeLivesBoxEffectTiming);
        } else {
            quizBox.animate(quizBoxReverseEffect, timeLivesBoxEffectTiming);
        }
    }

    // Animate the statistics table appearance, rotate and appear from the center effect
    const statisticsTableBoxEffect = [{transform: "rotate(0) scale(0, 0)"}, {transform: "rotate(360deg) scale(1, 1)"}];
    const statisticsTableBoxTiming = {duration: 0.5*animationsDuration, iterations: 1};
    function animateStatisticsTable(){
        statisticsTableBox.animate(statisticsTableBoxEffect, statisticsTableBoxTiming); 
    }
    
    // Animate right answer - highlight it with green background
    const rightAnswerEffect = [{backgroundColor: `${initialBackground}`}, {backgroundColor: "rgb(8, 180, 8)"}]; 
    const rightAnswerTiming = {duration: 0.2*animationsDuration, iterations: 4};
    function animateRightAnswer(){
        answerVariants[rightAnswerIndex].animate(rightAnswerEffect, rightAnswerTiming);
    } 

    // Animate that the lives number changed
    const livesNumberEffect = [{fontSize: `${initialFontSizeLives}px`}, {fontSize: `${1.5*initialFontSizeLives}px`},
                               {fontSize: `${initialFontSizeLives}px`}]; 
    const livesNumberTiming = {duration: 0.8*animationsDuration, iterations: 1};
    function animateLivesNumber(){
        livesNumberElement.animate(livesNumberEffect, livesNumberTiming);
    }

    // Prepare the quiz question and answer variants
    async function prepareQuestion(){
        let questionIndex = Math.floor(Math.random()*answerTypes.length);  // select randomly type of the question
        let state = await getRandomState();  // randomly get state from the emulated database
        rightAnswerIndex = Math.floor(Math.random()*4);   // randomly select the answer variant with the right answer
        let rightAnswerText = ""; 
        // Explicitly return default backgrounds for all variants of answers, prevent remained hovered background
        answer1.style.backgroundColor = `${initialBackground}`; answer2.style.backgroundColor = `${initialBackground}`;
        answer3.style.backgroundColor = `${initialBackground}`; answer4.style.backgroundColor = `${initialBackground}`;
        // Compose the question text body
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

    // Bind click events on answer variants to the event handler
    function trackClickedVariants(add=true) {
        if (add) {
            // Assign handling of clicking functions
            answer1.addEventListener('click', getClickedElement); answer2.addEventListener('click', getClickedElement);
            answer3.addEventListener('click', getClickedElement); answer4.addEventListener('click', getClickedElement);
            // Recover hovering on the answer variants effect of changing background
            answer1.addEventListener('mouseenter', assignHoverBackground); answer1.addEventListener('mouseleave', assignNormalBackground); 
            answer2.addEventListener('mouseenter', assignHoverBackground); answer2.addEventListener('mouseleave', assignNormalBackground); 
            answer3.addEventListener('mouseenter', assignHoverBackground); answer3.addEventListener('mouseleave', assignNormalBackground); 
            answer4.addEventListener('mouseenter', assignHoverBackground); answer4.addEventListener('mouseleave', assignNormalBackground); 
        } else {
            // Remove handlers of clicks
            answer1.removeEventListener('click', getClickedElement); answer2.removeEventListener('click', getClickedElement); 
            answer3.removeEventListener('click', getClickedElement); answer4.removeEventListener('click', getClickedElement);
            // Remove tracking of hovering on the variants
            answer1.removeEventListener('mouseenter', assignHoverBackground); answer1.removeEventListener('mouseleave', assignNormalBackground); 
            answer2.removeEventListener('mouseenter', assignHoverBackground); answer2.removeEventListener('mouseleave', assignNormalBackground); 
            answer3.removeEventListener('mouseenter', assignHoverBackground); answer3.removeEventListener('mouseleave', assignNormalBackground); 
            answer4.removeEventListener('mouseenter', assignHoverBackground); answer4.removeEventListener('mouseleave', assignNormalBackground);   
        }
    }

    // After animation of wrong answer, hovering effect removed. The functions below recover it again.
    function assignHoverBackground(event){
        event.target.style.backgroundColor = hoveredBackgroundColor;  // directly access to it from CSS is difficult, just copied from the css file
    }
    function assignNormalBackground(event){
        event.target.style.backgroundColor = `${initialBackground}`;
    }
    
    // Get the clicked element - get the answer and check it
    function getClickedElement(event){
        // cancel the current Timer counting down the remained time for the giving an answer
        cancelTimer();
        // remove Event listeners for prevent wrong processing of clicks during animations
        setTimeout(()=>{trackClickedVariants(false);}, 10); 
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
        animateRightAnswer();  // animate right answer variant
        // Check if the question is right or not
        if (givenAnswerIndex === (rightAnswerIndex + 1)){
            rightAnswersTotal += 1; 
            rightAnswersIndicator.innerText = ` Right answers: ${rightAnswersTotal} `;
            let prepareNextQuestion = true; 
            // Assign some ranking depending on the # of right answers
            if (rightAnswersTotal === 3) {
                maxTimeForAnswer += 1;
                rank.innerText = "Trainee"; rank.style.color = "rgb(118, 161, 118)";
            } else if (rightAnswersTotal === 5) {
                lives += 1; livesNumberElement.innerHTML = `${heartSymbol}: ${lives}`; animateLivesNumber(); 
                maxTimeForAnswer += 2;
                rank.innerText = "Junior"; rank.style.color = "rgb(95, 187, 95)"; 
            } else if (rightAnswersTotal === 10) {
                lives += 1; livesNumberElement.innerHTML = `${heartSymbol}: ${lives}`; animateLivesNumber();
                maxTimeForAnswer += 1;
                rank.innerText = "Intermediate"; rank.style.color = "rgb(73, 206, 73)"; 
            } else if (rightAnswersTotal === 15) {
                lives += 1; livesNumberElement.innerHTML = `${heartSymbol}: ${lives}`; animateLivesNumber();
                maxTimeForAnswer += 1;
                rank.innerText = "Upper Intermediate"; rank.style.color = "rgb(58, 218, 58)"; 
            } else if (rightAnswersTotal === 20) {
                maxTimeForAnswer -= 4;
                lives += 1; livesNumberElement.innerHTML = `${heartSymbol}: ${lives}`; animateLivesNumber();
                rank.innerText = "Advanced"; rank.style.color = "rgb(48, 230, 48)";
            } else if (rightAnswersTotal === 35) {
                rank.innerText = "Expert"; rank.style.color = "rgb(0, 255, 0)";
                prepareNextQuestion = false;  // automatically stop the game
                window.alert("You are Expert of U.S. states! You answered correctly to the 35 questions! CONGRATULATIONS!")
                setTimeout(()=>{quizStarted = !(quizStarted); changeElementsQuiz(); }, animationsDuration);  // stop quiz
            }
            if (prepareNextQuestion) {
                // postpone switching to the next question because of animations above (right answer)
                setTimeout(()=> {
                    prepareQuestion();  // prepare new question
                    timerHandle = setTimeout(timer, 1000);  // start again the stopped timer
                    setTimeout(()=>{trackClickedVariants();}, 200);  // bind clicking on answer variants again
                }, animationsDuration);  
            }
        } else {
            animateLivesNumber();
            lives -= 1; livesNumberElement.innerHTML = `${heartSymbol}: ${lives}`;  // reduce number of lives
            // highlight wrong answer and set timer for returning it back
            answerVariants[givenAnswerIndex-1].style.backgroundColor = "rgb(212, 8, 8)"; 
             // return back the original background
            setTimeout(()=>{answerVariants[givenAnswerIndex-1].style.backgroundColor = initialBackground;}, animationsDuration);
            if (lives > 0) {
                // postpone switching to the next question because of animations above (right answer)
                setTimeout(()=> {
                    prepareQuestion();  // prepare new question
                    timerHandle = setTimeout(timer, 1000);  // start again the stopped timer
                    setTimeout(()=>{trackClickedVariants();}, 200);  // bind clicking on answer variants again
                }, animationsDuration);  
            } else {
                setTimeout(()=>{quizStarted = !(quizStarted); changeElementsQuiz(); }, animationsDuration);  // stop quiz
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
    
    // Source - the Wikipedia website, list of U.S. states
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
                    {"state_id": 20, "state_name": "Maryland", "abbreviation": "MD", "capital_city": "Annapolis", "largest_city": "Baltimore"},
                    {"state_id": 21, "state_name": "Massachusetts", "abbreviation": "MA", "capital_city": "Boston", "largest_city": "Boston"},
                    {"state_id": 22, "state_name": "Michigan", "abbreviation": "MI", "capital_city": "Lansing", "largest_city": "Detroit"},
                    {"state_id": 23, "state_name": "Minnesota", "abbreviation": "MN", "capital_city": "Saint Paul", "largest_city": "Minneapolis"},
                    {"state_id": 24, "state_name": "Mississippi", "abbreviation": "MS", "capital_city": "Jackson", "largest_city": "Jackson"},
                    {"state_id": 25, "state_name": "Missouri", "abbreviation": "MO", "capital_city": "Jefferson City", "largest_city": "Kansas City"},
                    {"state_id": 26, "state_name": "Montana", "abbreviation": "MT", "capital_city": "Helena", "largest_city": "Billings"},
                    {"state_id": 27, "state_name": "Nebraska", "abbreviation": "NE", "capital_city": "Lincoln", "largest_city": "Omaha"},
                    {"state_id": 28, "state_name": "Nevada", "abbreviation": "NV", "capital_city": "Carson City", "largest_city": "Las Vegas"},
                    {"state_id": 29, "state_name": "New Hampshire", "abbreviation": "NH", "capital_city": "Concord", "largest_city": "Manchester"},
                    {"state_id": 30, "state_name": "New Jersey", "abbreviation": "NJ", "capital_city": "Trenton", "largest_city": "Newark"},
                    {"state_id": 31, "state_name": "New Mexico", "abbreviation": "NM", "capital_city": "Santa Fe", "largest_city": "Albuquerque"},
                    {"state_id": 32, "state_name": "New York", "abbreviation": "NY", "capital_city": "Albany", "largest_city": "New York City"},
                    {"state_id": 33, "state_name": "North Carolina", "abbreviation": "NC", "capital_city": "Raleigh", "largest_city": "Charlotte"}, 
                    {"state_id": 34, "state_name": "North Dakota", "abbreviation": "ND", "capital_city": "Bismark", "largest_city": "Fargo"},
                    {"state_id": 35, "state_name": "Ohio", "abbreviation": "OH", "capital_city": "Columbus", "largest_city": "Columbus"},
                    {"state_id": 36, "state_name": "Oklahoma", "abbreviation": "OK", "capital_city": "Oklahoma City", "largest_city": "Oklahoma City"},
                    {"state_id": 37, "state_name": "Oregon", "abbreviation": "OR", "capital_city": "Salem", "largest_city": "Portland"},
                    {"state_id": 38, "state_name": "Pennsylvania", "abbreviation": "PA", "capital_city": "Harrisburg", "largest_city": "Philadelphia"},
                    {"state_id": 39, "state_name": "Rhode Island", "abbreviation": "RI", "capital_city": "Providence", "largest_city": "Providence"},
                    {"state_id": 40, "state_name": "South Carolina", "abbreviation": "SC", "capital_city": "Columbia", "largest_city": "Charleston"},
                    {"state_id": 41, "state_name": "South Dakota", "abbreviation": "SD", "capital_city": "Pierre", "largest_city": "Sioux Falls"},
                    {"state_id": 42, "state_name": "Tennessee", "abbreviation": "TN", "capital_city": "Nashville", "largest_city": "Nashville"},
                    {"state_id": 43, "state_name": "Texas", "abbreviation": "TX", "capital_city": "Austin", "largest_city": "Houston"},
                    {"state_id": 44, "state_name": "Utah", "abbreviation": "UT", "capital_city": "Salt Lake City", "largest_city": "Salt Lake City"},
                    {"state_id": 45, "state_name": "Vermont", "abbreviation": "VT", "capital_city": "Montpelier", "largest_city": "Burlington"},
                    {"state_id": 46, "state_name": "Virginia", "abbreviation": "VA", "capital_city": "Richmond", "largest_city": "Virginia Beach"},
                    {"state_id": 47, "state_name": "Washington", "abbreviation": "WA", "capital_city": "Olympia", "largest_city": "Seattle"}, 
                    {"state_id": 48, "state_name": "West Virginia", "abbreviation": "WV", "capital_city": "Charleston (WV)", "largest_city": "Charleston (WV)"},
                    {"state_id": 49, "state_name": "Wisconsin", "abbreviation": "WI", "capital_city": "Madison", "largest_city": "Milwaukee"},
                    {"state_id": 50, "state_name": "Wyoming", "abbreviation": "WY", "capital_city": "Cheyenne", "largest_city": "Cheyenne"}]
}
