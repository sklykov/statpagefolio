document.addEventListener("DOMContentLoaded", ()=>{
    "use strict";

    // Elements selectors from DOM
    const uploadButton = document.getElementById("uploadButton");
    const imgElement = document.getElementById("imageContainer");  // it points to the <img> HTML element
    const uploadInfoStr = document.getElementById("uploadInfoStr");
    const canvas = document.getElementById("imageAsCanvas");  // HTML <canvas> element allows pixel manipulation in addition to operations
    const contextCanvas = canvas.getContext("2d");  // get the drawing context - 2d, it composes functions for drawing
    const widthInput = document.getElementById("widthImageInput"); 
    const blurInput = document.getElementById("blur-control"); 
    const blurValue = document.getElementById("blur-value");

    // Images reader and value for storing original image
    const readerImg = new FileReader();  // IO API from JS
    let imageClass = new Image();  // Image class for providing raster image to the canvas context drawing
    let widthSet = "55%"; widthInput.value = 55;  // default width setting
    let blurPixelValue = "0.0"; blurInput.value = 0.0;  // default blur setting
    let imageUploaded = false;  // flag for referring if image uploaded or not
    let fileType;  // store the uploaded type file provided in FileReader.result of method readAsDataURL
    let windowWidth = window.innerWidth; let windowHeight = window.innerHeight; 
    let loadedImgWidth = 0; let loadedImgHeight = 0;

    uploadButton.value = "";  // put default "No file selected" to the input button

    // Add event listener to the event, when the file provided through the <input type="file"> button
    uploadButton.addEventListener("change", (event) => {
        readerImg.readAsDataURL(uploadButton.files[0]);
    });

    // Event listener that reacts to finished loaded event from above (readerImg.readAsDataURL(...))
    readerImg.addEventListener("load", (event) => {
        // Below - default values for the case that image not uploaded - before it will be confirmed that the image loaded
        imageUploaded = false; widthInput.disabled = true; blurInput.disabled = true; 
        // console.log(readerImg.result.slice(5, 10));  // will print out the type of the uploaded file
        fileType = readerImg.result.slice(5, 10);
        // Simple uploaded type checker - if the FileReader reports that uploaded image, then proceed to drawing of its content
        if (fileType == "image"){
            imgElement.src = readerImg.result;  // transfer loaded image to the HTML element, evoke "load" event in the end of loading
            // Add event listener to finished load of an image
            imgElement.onload = () => {
                windowWidth = window.innerWidth; windowHeight = window.innerHeight;  // update window sizes
                canvas.width = imgElement.naturalWidth; canvas.height = imgElement.naturalHeight;  // make canvas to inherit geometrical properties of <img> element
                console.log(`Image WxH: ${imgElement.naturalWidth}x${imgElement.naturalHeight}`);  // note of usage of naturalWidth and naturalHeight - original image properties
                console.log(`Browser viewport / Document WxH: ${windowWidth}x${windowHeight}`);  // log the view port of the browser size
                loadedImgWidth = imgElement.naturalWidth; loadedImgHeight = imgElement.naturalHeight;  // store image WxH

                // Set now styling for restrict image sizes, taking into account the window properties
                // Below - recalculate width set in % of the window width
                if (loadedImgWidth < (widthInput.value/100)*windowWidth){  // this case then the image is much smaller then the default % of window, it prevents expanding small images
                    widthInput.value = Math.round(100*(loadedImgWidth/windowWidth)); widthSet = `${widthInput.value}%`;
                } else {
                    widthInput.value = 85; widthSet = `${widthInput.value}%`;  // then the loaded image is less then the window size, just use most of the page width
                }

                // Set the width % to the style of elements
                imgElement.style.width = widthSet; imgElement.style.height = "auto";  // to prevent wrong transfer to the canvas element
                imageClass.src = readerImg.result;  // transfer loaded image to the Image class and can be bound with the "load" event below
                imageClass.onload = () => {
                    contextCanvas.drawImage(imageClass, 0, 0);  // 0, 0 - coordinates should be provided, it's origin of drawing. This function draws a raster image on canvas
                    canvas.style.width = widthSet; canvas.style.height = "auto";  // same styling as <img> element
                    // check that it was normal image (width and height more than 1 pixel)
                    if ((Number.parseInt(imgElement.naturalWidth) > 1) && (Number.parseInt(imgElement.naturalHeight) > 1)){
                        changePropsImgUploaded();  // centrally changing of properties when the image is uploaded
                    } else {
                        window.alert("The uploaded image width and / or height isn't more than 1 pixel, it will be ignored!");
                    }
                };
            };
        } else {
            clearCanvas();
        }
    });

    // Listen to a change on the page of the width input
    widthInput.addEventListener("change", () => {
        if (imageUploaded){
            widthSet = `${widthInput.value}%`;
            canvas.style.width = widthSet; imgElement.style.width = widthSet; 
        }
    });

    // Blurring image if the blur control changed
    blurInput.addEventListener("change", ()=>{
        if (imageUploaded){
            blurPixelValue = `${blurInput.value}px`;  // convert from pure number to the Number px value accepted by filters
            imgElement.style.filter = `blur(${blurPixelValue})`;  // apply blurring to the <img> element
            blurValue.innerHTML = `<strong> ${blurInput.value} px </strong> - applied blur`;

            // Below - manually cleaning drawn image, applying filter, drawing the result, but the result is different compared to the result of 
            // the same filter applied to the <img> element (code above)
            // contextCanvas.clearRect(0, 0, canvas.width, canvas.height);
            // contextCanvas.filter = `blur(${blurPixelValue})`;  
            // contextCanvas.drawImage(imageClass, 0, 0);

            // Applying the filter on the canvas and drawing the direct result, instead of drawing original image
            canvas.style.filter = `blur(${blurPixelValue})`;  
            contextCanvas.drawImage(canvas, 0, 0);
        }
    }); 

    // Change properties of page elements if the image was successfully uploaded to the browser
    function changePropsImgUploaded(){
        imageUploaded = true; widthInput.disabled = false; blurInput.disabled = false;
        uploadInfoStr.innerText = `Image uploaded and shown below. Name of image: ${uploadButton.files[0].name}. Upload new image: `;
    };

    // Remove previously uploaded image from <img> and <canvas> elements
    function clearCanvas(){
        if (!imageUploaded){
            contextCanvas.clearRect(0, 0, canvas.width, canvas.height);
            imgElement.src = "";
        }
    };

    // Window size changed event
    window.addEventListener("resize", () => {
        windowWidth = window.innerWidth; windowHeight = window.innerHeight;  // update window sizes
        // console.log("Window resized: "+`${windowWidth}x${windowHeight}`);
    });
})
