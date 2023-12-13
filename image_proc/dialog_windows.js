"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // DOM elements selectors
    const aboutButton = document.getElementById("about-button"); const infoDialog = document.getElementById("info-dialog");
    const closeButton = document.getElementById("info-dialog-close-button"); 

    // Show the dialog window
    aboutButton.addEventListener("click", () => {
        infoDialog.showModal(); 
    });

    // Associate closing function for the dialog
    closeButton.onclick = () => {
        infoDialog.close();
    };

});
