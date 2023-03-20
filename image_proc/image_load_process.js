document.addEventListener("DOMContentLoaded", ()=>{
    "use strict";

    // Elements selectors
    const uploadButton = document.getElementById("uploadButton");
    const imgElement = document.getElementById("imageContainer");
    const uploadInfoStr = document.getElementById("uploadInfoStr");

    // Images reader and value for storing original image
    const readerImg = new FileReader();
    let loadedImage;

    uploadButton.value = "";  // put default "No file selected" to the input button

    uploadButton.addEventListener("change", (event) => {
        readerImg.readAsDataURL(uploadButton.files[0]);
    });

    readerImg.addEventListener("load", (event) => {
        imgElement.src = readerImg.result;  // transfer loaded image to the HTML element
        loadedImage = readerImg.result;   // save the original loaded image in the variable
        // console.log(readerImg.result); 
        console.log(imgElement); 
        uploadInfoStr.innerText = `Image uploaded and shown below. Name of image: ${uploadButton.files[0].name}. Upload new image: `;
        // setTimeout(800, imgElement.blur(10));
        imgElement.style.filter = "blur(2px)";
    });
    
})
