document.addEventListener("DOMContentLoaded", ()=>{
    "use strict";

    // Elements selectors from DOM
    const uploadButton = document.getElementById("uploadButton");
    const imgElement = document.getElementById("imageContainer");
    const uploadInfoStr = document.getElementById("uploadInfoStr");
    const canvas = document.getElementById("imageAsCanvas");  // canvas element allows also pixel manipulation
    const contextCanvas = canvas.getContext("2d");  // get the drawing context - 2d, it composes functions for drawing
    const widthInput = document.getElementById("widthImageInput"); 

    // Images reader and value for storing original image
    const readerImg = new FileReader();  // IO API from JS
    let imageClass = new Image();  // Image class for providing raster image to the canvas context drawing
    let widthSet = "55%"; widthInput.value = 55;  // default width setting
    let imageUploaded = false;

    uploadButton.value = "";  // put default "No file selected" to the input button

    // Add event listener to the event, when the file provided through the <input type="file"> button
    uploadButton.addEventListener("change", (event) => {
        readerImg.readAsDataURL(uploadButton.files[0]);
    });

    // Event listener that reacts to finished loaded event from above (readerImg.readAsDataURL(...))
    readerImg.addEventListener("load", (event) => {
        imgElement.src = readerImg.result;  // transfer loaded image to the HTML element, evoke "load" event in the end of loading
        // Add event listener to finished load of an image
        imgElement.onload = () => {
            console.log(imgElement);
            canvas.width = imgElement.width; canvas.height = imgElement.height;  // make canvas to inherit geometrical properties of <img> element
            console.log(`Image WxH: ${imgElement.width}x${imgElement.height}`);
            // Set now styling for restrict image sizes
            imgElement.style.width = widthSet; imgElement.style.height = "auto";  // to prevent wrong transfer to canvas file
            imageClass.src = readerImg.result;  // transfer loaded image to the Image class and can be bound with the "load" event below
            imageClass.onload = () => {
                contextCanvas.drawImage(imageClass, 0, 0);  // 0, 0 - coordinates should be provided, it's origin of drawing. This function draws a raster image on canvas
                canvas.style.width = widthSet; canvas.style.height = "auto";  // same styling as <img> element
                imageUploaded = true;
            };
        }; 
        uploadInfoStr.innerText = `Image uploaded and shown below. Name of image: ${uploadButton.files[0].name}. Upload new image: `;
        // imgElement.style.filter = "blur(2px)";
    });

    // Listen to change of width input
    widthInput.addEventListener("change", () => {
        if (imageUploaded){
            widthSet = `${widthInput.value}%`;
            canvas.style.width = widthSet; imgElement.style.width = widthSet; 
        }
    });
})
