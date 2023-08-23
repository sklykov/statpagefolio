// import ping from "./get_info.js";   // NOTE: Import from the local file cannot be achieved in the browser due to the CORS error
"use strict"; 

// import("./get_info.js")
//     .then(obj => {console.log(obj);})
async function load(){
    let imported = await import("./get_info.js");
}
// load();  // The function call throws an CORS error in the browser (tested in Firefox) as well as a Promise call
