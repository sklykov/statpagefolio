"use strict";  // This modifier forces to launch this script in 'strict' mode, allowing more mistakes / bugs to be caught

const f_plc = () => {};  // empty placeholder function

console.log("window w, h:", window.innerWidth, window.innerHeight); 

document.addEventListener("DOMContentLoaded", () => {

    const divContainer = document.getElementById("divs-container"); const body = document.body; 
    const div1 = document.getElementById("div1"); const div2 = document.getElementById("div2");

    // Testing setting of the draggable div 
    div1.draggable = "true"; div1.addEventListener("dragstart", () => { div1.style.opacity = "0.7"; });
    div1.addEventListener("dragend", () => { div1.style.opacity = "1.0"; });

    // Setting options for touch screens - assign some properties to the element for the screen with touch screens    
    // Sources: https://developer.mozilla.org/en-US/docs/Web/API/Element/releasePointerCapture
    div1.addEventListener("pointerdown", (event) => {
        div1.style.opacity = "0.7"; div1.setPointerCapture(event.pointerId); 
    });

    div1.addEventListener("pointerup", (event) => {
        div1.style.opacity = "1.0"; div1.releasePointerCapture(event.pointerId); 
    });
    // Prevent scrolling for pointer events - as default action for pointing device 
    divContainer.style.touchAction = "none";  // disable any touch actions for the element
    // body.style.touchAction = "none";  // disable any interaction with the entire body, but event listeners kept active

    // Testing of checking the click events for both screen and touch display
    div2.addEventListener("click", () => { console.log("div2 clicked") }); 

});
