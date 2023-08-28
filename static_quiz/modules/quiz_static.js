// import ping from "./get_info.js";   // NOTE: Import from the local file cannot be achieved in the browser due to the CORS error
"use strict"; 

// Functions below cannot be successfully executed because of the browser restrictions on access to the local files
// import("./get_info.js")
//     .then(obj => {console.log(obj);})
async function load(){
    let imported = await import("./get_info.js");
}
// load();  // The function call throws an CORS error in the browser (tested in Firefox) as well as a Promise call
// Note that there is no way to load directly the local file to JS, it's anyway sandboxed by the browser and has no access to the local file system

// Note that to guarantee the body created before script runs, place the function to the event listener
document.addEventListener("DOMContentLoaded", () => {
    let inputElement = document.createElement("input"); inputElement.type = "file";
    document.body.appendChild(inputElement);  // add the button to the DOM (body)

    inputElement.addEventListener("change", () => {
        console.log(inputElement.files[0]);
        console.log(inputElement);
    });

    // Change "value" - path to the file
    // inputElement.value = "./data.json";   // Throws an error
    inputElement.setAttribute("value", "./data.json");  // Alternative way to set "value"
    inputElement.style.display = "none"; 
    // inputElement.click();  // doesn't work on Firefox
    // Below - evokes an event "change" but associated FileList not created. 
    // MDN notes that this way won't work (see the link below): 
    // https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#getting_information_about_selected_files
    let simulatedClick = new Event("change"); inputElement.dispatchEvent(simulatedClick);
}); 
