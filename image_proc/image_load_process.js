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
    let imageUploaded = false;  // flag for referring if image uploaded or not
    let fileType;  // store the uploaded type file provided in FileReader.result of method readAsDataURL

    uploadButton.value = "";  // put default "No file selected" to the input button

    // Add event listener to the event, when the file provided through the <input type="file"> button
    uploadButton.addEventListener("change", (event) => {
        readerImg.readAsDataURL(uploadButton.files[0]);
    });

    // Event listener that reacts to finished loaded event from above (readerImg.readAsDataURL(...))
    readerImg.addEventListener("load", (event) => {
        imageUploaded = false; widthInput.disabled = true; // default values - before it will be confirmed that the image loaded
        // console.log(readerImg.result.slice(5, 10));  // will print out the type of the uploaded file
        fileType = readerImg.result.slice(5, 10);
        // Simple uploaded type checker - if the FileReader reports that uploaded image, then proceed to drawing of its content
        if (fileType == "image"){
            imgElement.src = readerImg.result;  // transfer loaded image to the HTML element, evoke "load" event in the end of loading
            // Add event listener to finished load of an image
            imgElement.onload = () => {
                console.log(imgElement);
                canvas.width = imgElement.width; canvas.height = imgElement.height;  // make canvas to inherit geometrical properties of <img> element
                console.log(`Image WxH: ${imgElement.width}x${imgElement.height}`);
                // Set now styling for restrict image sizes
                imgElement.style.width = widthSet; imgElement.style.height = "auto";  // to prevent wrong transfer to the canvas element
                imageClass.src = readerImg.result;  // transfer loaded image to the Image class and can be bound with the "load" event below
                imageClass.onload = () => {
                    contextCanvas.drawImage(imageClass, 0, 0);  // 0, 0 - coordinates should be provided, it's origin of drawing. This function draws a raster image on canvas
                    canvas.style.width = widthSet; canvas.style.height = "auto";  // same styling as <img> element
                    // check that it was normal image (width and height more than 1 pixel)
                    if ((Number.parseInt(imgElement.width) > 1) && (Number.parseInt(imgElement.height) > 1)){
                        changePropsImgUploaded();  // centrally changing of properties when the image is uploaded
                    } else {
                        window.alert("The uploaded image width and / or height isn't more than 1 pixel, it will be ignored!");
                    }
                };
            };
        } else {
            clearCanvas();
        }
        // setTimeout(750, clearCanvas());  // clear image on canvas if it hasn't been uploaded 
    });

    // Listen to a change on the page of the width input
    widthInput.addEventListener("change", () => {
        if (imageUploaded){
            widthSet = `${widthInput.value}%`;
            canvas.style.width = widthSet; imgElement.style.width = widthSet; 
        }
    });

    // Change properties of page elements if the image was successfully uploaded to the browser
    function changePropsImgUploaded(){
        imageUploaded = true; widthInput.disabled = false;
        uploadInfoStr.innerText = `Image uploaded and shown below. Name of image: ${uploadButton.files[0].name}. Upload new image: `;
    };

    // Remove previously uploaded image from <img> and <canvas> elements
    function clearCanvas(){
        if (!imageUploaded){
            contextCanvas.clearRect(0, 0, canvas.width, canvas.height);
            imgElement.src = "";
        }
    };
})
