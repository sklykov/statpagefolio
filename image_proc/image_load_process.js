document.addEventListener("DOMContentLoaded", ()=>{
    "use strict";
    const uploadButton = document.getElementById("uploadButton");
    const imgElement = document.getElementById("imageContainer");
    const readerImg = new FileReader();  // 

    uploadButton.addEventListener("change", (event) => {
        console.log(uploadButton.files[0]);

        readerImg.addEventListener("load", (event) => {
            console.log("On load event");
            // imgElement.src = event.target.result;
            imgElement.src = readerImg.result;
        });

        readerImg.readAsDataURL(uploadButton.files[0]);
        console.log("File should be read so far");
    });
})
