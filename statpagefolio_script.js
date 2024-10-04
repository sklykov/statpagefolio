"use strict";

// After loading content of the page, add logic to it
document.addEventListener("DOMContentLoaded", () => {
    // DOM element selectors
    const checkButton1 = document.getElementById("btnradio1"); const checkButton2 = document.getElementById("btnradio2");
    const checkButton3 = document.getElementById("btnradio3"); 
    const cardImageProcessing = document.getElementById("image-processing-card-ind");
    const cardImageProcessingClasses = cardImageProcessing.classList;
    const cardQuiz = document.getElementById("quiz-card-ind"); const cardQuizClasses = cardQuiz.classList;
    const cardFluoscenepy = document.getElementById("fluoscenepy-card-ind"); const cardFluoscenepyClasses = cardFluoscenepy.classList;
    
    // Script variables
    let flagButton1 = false; let flagButton2 = false; let flagButton3 = false; 
    let windowWidth = window.innerWidth; 

    function checkButtonClickHandler(e) {
        // Note that cardImageProcessingClasses is a List subclass with own list of methods!
        if (cardImageProcessingClasses.contains("d-block")) {
            cardImageProcessingClasses.remove("d-block"); cardImageProcessingClasses.add("d-none");  
        }
        if (cardQuizClasses.contains("d-block")) {
            cardQuizClasses.remove("d-block"); cardQuizClasses.add("d-none");
        }
        if (cardFluoscenepyClasses.contains("d-block")) {
            cardFluoscenepyClasses.remove("d-block"); cardFluoscenepyClasses.add("d-none");
        }

        // Show the cards if one of button from radio buttons group has been clicked
        if (e.target.id === "btnradio1") {
            if (e.target.checked) {
                cardImageProcessingClasses.remove("d-none"); cardImageProcessingClasses.add("d-block");
            }
        }
        if (e.target.id === "btnradio2") {
            if (e.target.checked) {
                cardQuizClasses.remove("d-none"); cardQuizClasses.add("d-block");
            }
        }
        if (e.target.id === "btnradio3") {
            if (e.target.checked) {
                cardFluoscenepyClasses.remove("d-none"); cardFluoscenepyClasses.add("d-block");
            }
        }
    }

    // Switch logic for check buttons 
    if (windowWidth <= 992) {
        checkButton1.addEventListener("click", (e) => {
            if (checkButton1.checked && !flagButton1) {
                flagButton1 = true; flagButton2 = false; flagButton3 = false;
            } else if (flagButton1 && checkButton1.checked) {
                checkButton1.checked = false; flagButton1 = false;
            }
            checkButtonClickHandler(e);  // handle click event
        }); 

        checkButton2.addEventListener("click", (e) => {
            if (checkButton2.checked && !flagButton2) {
                flagButton2 = true; flagButton1 = false; flagButton3 = false;
            } else if (flagButton2 && checkButton2.checked) {
                checkButton2.checked = false; flagButton2 = false;
            }
            checkButtonClickHandler(e);  // handle click event
        });

        checkButton3.addEventListener("click", (e) => {
            if (checkButton3.checked && !flagButton3) {
                flagButton3 = true; flagButton1 = false; flagButton2 = false;
            } else if (flagButton3 && checkButton3.checked) {
                checkButton3.checked = false; flagButton3 = false;
            }
            checkButtonClickHandler(e);  // handle click event
        }); 
    }
});
