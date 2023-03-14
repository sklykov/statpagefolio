document.addEventListener("DOMContentLoaded", ()=>{
    "use strict";

    // Elements selectors
    const uploadButton = document.getElementById("uploadButton");
    const imgElement = document.getElementById("imageContainer");
    const uploadInfoStr = document.getElementById("uploadInfoStr");

    // Images reader
    const readerImg = new FileReader();

    uploadButton.value = "";  // put default "No file selected" to the input button

    uploadButton.addEventListener("change", (event) => {
        readerImg.readAsDataURL(uploadButton.files[0]);
    });

    readerImg.addEventListener("load", (event) => {
        imgElement.src = readerImg.result;
        console.log(readerImg.result);
        uploadInfoStr.innerText = `Image uploaded and shown below. Name of image: ${uploadButton.files[0].name}. Upload new image: `;
    });
    
})
