document.addEventListener("DOMContentLoaded", ()=>{
    "use strict";

    // Elements selectors from DOM
    const uploadButton = document.getElementById("uploadButton");
    const imgElement = document.getElementById("imageContainer");  // it points to the <img> HTML element
    const uploadInfoStr = document.getElementById("uploadInfoStr");
    const canvas = document.getElementById("imageAsCanvas");  // HTML <canvas> element allows pixel manipulation in addition to operations
    const contextCanvas = canvas.getContext("2d");  // get the drawing context - 2d, it composes functions for drawing
    const widthInput = document.getElementById("widthImageInput"); 
    const blurInput = document.getElementById("blur-control"); const blurValue = document.getElementById("blur-value");
    const widthInputContainer = document.getElementById("widthInputContainer");
    const uploadBtnContainer = document.getElementById("uploadBtnContainer");
    const processingCtrlBox = document.getElementById("image-manipulation-controls-box");
    const infoTwoImagesStr = document.getElementById("info-two-image-elements"); 
    const downloadBtn = document.getElementById("download-button");
    const pageHeader = document.getElementById("pageHeader");  // for changing its margin-top
    const brightnessInput = document.getElementById("brightness-control"); 

    // Default parameters and initialization of containers for image reading and storing
    const readerImg = new FileReader();  // IO API from JS
    let imageClass = new Image();  // Image class for providing raster image to the canvas context drawing
    let widthSet = "55%"; widthInput.value = 55; let defaultWidthPercentage = 55; // default width setting
    let blurPixelValue = "0.0"; blurInput.value = 0.0;  // default blur setting
    let imageUploaded = false;  // flag for referring if image uploaded or not
    let fileType;  // store the uploaded type file provided in FileReader.result of method readAsDataURL
    let windowWidth = window.innerWidth; let windowHeight = window.innerHeight; 
    let loadedImgWidth = 0; let loadedImgHeight = 0; let imageFormat = ""; 
    uploadButton.value = "";  // put default "No file selected" to the input button

    // Add event listener to the event, when the file provided through the <input type="file"> button
    uploadButton.addEventListener("change", (event) => {
        readerImg.readAsDataURL(uploadButton.files[0]);
    });

    // Event listener that reacts to finished loaded event from above (readerImg.readAsDataURL(...))
    readerImg.addEventListener("load", (event) => {
        if (imageUploaded){
            // Set blur pixel value to 0.0 if the image re-uploaded and this setting is non-zero
            if (blurInput.value > 0.0){
                zeroBlurInput();  // workaround for updating the blur filter value to the default == 0px
            }
        }

        // Below - default values for the case that image not uploaded - before it will be confirmed that the image loaded
        imageUploaded = false; widthInput.disabled = true; blurInput.disabled = true; brightnessInput.disabled = true;
        // console.log(readerImg.result.slice(5, 10));  // will print out the type of the uploaded file - image or not
        fileType = readerImg.result.slice(5, 10); 
        // Simple uploaded type checker - if the FileReader reports that uploaded image, then proceed to drawing of its content
        if (fileType == "image"){
            imgElement.src = readerImg.result;  // transfer loaded image to the HTML element, evoke "load" event in the end of loading
            // console.log(imgElement.src.slice(11, 14));  // print out of uploaded file extension (debug)
            imageFormat = imgElement.src.slice(11, 14);  // store recognized image format, only 3 letters
            if (imageFormat == "jpe"){
                imageFormat = imgElement.src.slice(11, 15);  // store proper extension for "jpeg", 4 letters
            }
            // Check uploaded image type, restrict support only to jpeg, png, bmp formats
            if (imageFormat == "jpeg" || imageFormat == "jpg" || imageFormat == "png" || imageFormat == "bmp"){
                // Add event listener to finished load of an image
                imgElement.onload = () => {
                    windowWidth = window.innerWidth; windowHeight = window.innerHeight;  // update window sizes
                    canvas.width = imgElement.naturalWidth; canvas.height = imgElement.naturalHeight;  // make canvas to inherit geometrical properties of <img> element
                    console.log(`Image WxH: ${imgElement.naturalWidth}x${imgElement.naturalHeight}`);  // note of usage of naturalWidth and naturalHeight - original image properties
                    console.log(`Browser viewport / Document WxH: ${windowWidth}x${windowHeight}`);  // log the view port of the browser size
                    loadedImgWidth = imgElement.naturalWidth; loadedImgHeight = imgElement.naturalHeight;  // store image WxH

                    // If new image uploaded, change width control to the default one and compare with the default percentage of the page width = 55%
                    widthInput.value = defaultWidthPercentage;

                    // Set now styling for restrict image sizes, taking into account the window properties
                    // Below - recalculate width set in % of the window width
                    if (loadedImgWidth < (widthInput.value/100)*windowWidth){  // this case then the image is much smaller then the default % of window, it prevents expanding small images
                        widthInput.value = Math.round(100*(loadedImgWidth/windowWidth)); widthSet = `${widthInput.value}%`;
                    }

                    // Set the width % to the style of elements
                    imgElement.style.width = widthSet; imgElement.style.height = "auto";  // to prevent wrong transfer to the canvas element
                    imageClass.src = readerImg.result;  // transfer loaded image to the Image class and can be bound with the "load" event below

                    // Draw image on the <canvas> element
                    imageClass.onload = () => {
                        contextCanvas.drawImage(imageClass, 0, 0);  // 0, 0 - coordinates should be provided, it's origin of drawing. This function draws a raster image on canvas
                        canvas.style.width = widthSet; canvas.style.height = "auto";  // same styling as <img> element
                        // check that it was normal image (width and height more than 1 pixel)
                        if ((Number.parseInt(imgElement.naturalWidth) > 1) && (Number.parseInt(imgElement.naturalHeight) > 1)){
                            changePropsImgUploaded();  // centrally changing of flags and elements content by 
                            changePageStyleImgUploaded();  // change style of elements to show loaded image
                        } else {
                            window.alert("The uploaded image width and / or height isn't more than 1 pixel, it will be ignored!");
                        }
                    };
                };
            } else {
                window.alert(`Uploaded image with format "${imageFormat}" not supported. Please upload jpeg/jpg, png or bmp image`);
                clearImagesFromElements();
            }
        } else {
            clearImagesFromElements();
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
            // Applying the filter on the canvas and drawing the direct result, instead of drawing original image
            // canvas.style.filter = `blur(${blurPixelValue})`;  // non-destructive applying of the filter, not changing the image content
            imageClass.src = readerImg.result;  // refresh image for applying again the filter
            contextCanvas.drawImage(imageClass, 0, 0);
            // !!!: below -  applying filter to contextCanvas changes the content of the image data, which could be downloaded later
            contextCanvas.filter = `blur(${blurPixelValue})`; // according to https://www.bit-101.com/blog/2021/07/new-html-canvas-stuff-filters/
            contextCanvas.drawImage(imageClass, 0, 0);  // update image shown on the canvas element
        }
    });

    // Workaround for making blurInput zero after reloading of an image
    function zeroBlurInput(){
        blurInput.value = 0.0; 
        blurPixelValue = `${blurInput.value}px`;  // convert from pure number to the Number px value accepted by filters
        imgElement.style.filter = `blur(${blurPixelValue})`;  // apply blurring to the <img> element
        blurValue.innerHTML = `<strong> ${blurInput.value} px </strong> - applied blur`;
    }

    // Change properties of page elements if the image was successfully uploaded to the browser
    function changePropsImgUploaded(){
        imageUploaded = true; widthInput.disabled = false; blurInput.disabled = false; brightnessInput.disabled = false;
        uploadInfoStr.innerHTML = '<span style="color: green;">Image uploaded.</span>';
        uploadInfoStr.innerHTML +=  `File name:<em>${uploadButton.files[0].name}.</em> Upload new image:`;
        console.log("Image uploaded");
    };

    // Change styling after uploading image on the page
    // TODO - better way to get all rules from an external file?
    function changePageStyleImgUploaded(){
        // imgElement.style.display = "block";   // Display the <image> element on the page. If commented out, the entire element won't be displayed
        canvas.style.display = "block";  // Display the <canvas> element on the page
        widthInputContainer.style.display = "flex"; infoTwoImagesStr.style.display = "block";
        uploadBtnContainer.style.fontWeight = "normal"; uploadBtnContainer.style.border = "none";
        uploadBtnContainer.style.marginTop = "0.1em"; uploadInfoStr.style.marginRight = "0.1em";
        uploadButton.style.width = "5.25em"; uploadButton.style.border = "none"; uploadButton.style.marginLeft = "0.1em";
        uploadInfoStr.style.marginTop = "0.5em"; uploadButton.style.marginTop = "0.5em";
        processingCtrlBox.style.display = "flex"; processingCtrlBox.style.flexDirection = "row";
        downloadBtn.style.display = "block"; pageHeader.style.marginTop = "0.5em"; 
    }

    // Remove previously uploaded image from <img> and <canvas> elements, also handle if the image not uploaded
    function clearImagesFromElements(){
        if (!imageUploaded){
            contextCanvas.clearRect(0, 0, canvas.width, canvas.height); imgElement.src = ""; 
            // Specifying below default styling if the image haven't been uploaded
            imgElement.style.display = "none"; canvas.style.display = "none";
            widthInputContainer.style.display = "none"; infoTwoImagesStr.style.display = "none";
            processingCtrlBox.style.display = "none"; uploadInfoStr.innerHTML = '<span style="color: red;">Image not uploaded!</span> Upload new image:';
            downloadBtn.style.display = "none";
        }
    };

    // Function for downloading processed image
    downloadBtn.addEventListener("click", (event) =>{
        if (imageUploaded){
            const temporary_link = document.createElement('a'); 
            let file_name_wt_ext = uploadButton.files[0].name.split(".")[0];  // split file name based on dot, excluding extension of the file
            temporary_link.download = `${file_name_wt_ext}_processed.${imageFormat}`;
            if (imageFormat == 'jpeg' || imageFormat == 'jpg'){ 
                temporary_link.href = canvas.toDataURL(`image/${imageFormat}`, 1.0);  // max jpg quality used
            } else {
                temporary_link.href = canvas.toDataURL(`image/${imageFormat}`); 
            }
            temporary_link.click(); temporary_link.delete;  // temporary link is clicked evoking image downloading, after it is deleted
        }
    });
    
});
