"use strict";  // This modifier forces to launch this script in 'strict' mode, allowing more mistakes / bugs to be caught

const date = new Date(); const year = date.getFullYear();  // get the actual year

// overall function guarantees that the page loaded before any script functions start working
document.addEventListener("DOMContentLoaded", () => {

    // Check the browser family (compatibility issues - the canvas.filter property are not implemented in Safari)
    console.log(`Page opened in: ${navigator.userAgent}`);
    // Apparently, it's difficult to detect the exact browser used for opening the page
    if ((navigator.userAgent.includes("Safari") || navigator.userAgent.includes("safari")) && !navigator.userAgent.includes("Firefox") 
        && !navigator.userAgent.includes("Chrome") && !navigator.userAgent.includes("Mozilla")){
        window.alert("Possibly, this page is opened in Safari browser. In this case, the image processing wouldn't work properly, try another browser");
        // Ref.: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter#browser_compatibility
    }

    // Elements selectors from DOM. Buttons / sliders from the page
    const uploadButton = document.getElementById("upload-button"); const widthInput = document.getElementById("width-image-input"); 
    const downloadBtn = document.getElementById("download-button"); const resetButton = document.getElementById("reset-button");
    const blurInput = document.getElementById("blur-control"); const blurValue = document.getElementById("blur-value");
    const brightnessInput = document.getElementById("brightness-control"); const brightnessValue = document.getElementById("brightness-value");
    const contrastInput = document.getElementById("contrast-control"); const contrastValue = document.getElementById("contrast-value");
    const saturateInput = document.getElementById("saturate-control"); const saturateValue = document.getElementById("saturate-value");
    const grayscaleInput = document.getElementById("grayscale-control"); const grayscaleValue = document.getElementById("grayscale-value");
    const huerotateInput = document.getElementById("huerotate-control"); const huerotateValue = document.getElementById("huerotate-value");
    const saturateCtrlBox = document.getElementById("saturate-control-container"); const grayscaleCtrlBox = document.getElementById("grayscale-control-container");
    const huerotateCtrlBox = document.getElementById("huerotate-control-container"); const clearImageButton = document.getElementById("clear-image-button"); 
    const instructionsHeaderBox = document.getElementById("instructions-header-container"); const radioBox = document.getElementById("input-type-container"); 
    const imageCtrlsBox = document.getElementById("image-ctrls-box"); const sliderSelector = document.getElementById("sliders-selector1"); 
    const inputElements = [blurInput, brightnessInput, contrastInput, saturateInput, grayscaleInput, huerotateInput];
    const inputLabels = [blurValue, brightnessValue, contrastValue, saturateValue, grayscaleValue, huerotateValue];
    
    // Containers, html elements
    const pageContent = document.getElementsByClassName("flexbox-container")[0];   // the flexbox - container of all page content
    const pageHeader = document.getElementById("project-header");  // for changing its margin-top
    const imgElement = document.getElementById("img-element");  // it points to the <img> HTML element
    const canvas = document.getElementById("canvas-element");  // HTML <canvas> element allows pixel manipulation in addition to operations
    const uploadImageContainer = document.getElementById("upload-image-container"); const infoContainer = document.getElementById("instructions-header-container");
    const processingCtrlBox = document.getElementById("image-manipulation-controls-box");
    // Strings with some text representation
    const uploadInfoStr = document.getElementById("upload-info");
    const infoPoint1 = document.getElementById("info-point-1"); const infoPoint2 = document.getElementById("info-point-2");
    const imageControlsBox = document.getElementById("image-associated-ctrls-box");
    const footerElement = document.getElementById("page-footer");  // for changing margin of the footer if image uploaded
    footerElement.innerHTML = `${year}, ` + footerElement.innerHTML;  // set actual year on the web-page
    // Below - selectors for elements for changing their values if the page is opened on the mobile device
    const minTickImgWidth = document.getElementById("min-width-tick"); const maxTickImgWidth = document.getElementById("max-width-tick");

    // Default parameters and initialization of classes for image reading and storing
    const contextCanvas = canvas.getContext("2d");  // get the drawing context - 2d, it composes functions for drawing
    const readerImg = new FileReader();  // IO API from JS
    let imageClass = new Image();  // Image class for providing raster image to the canvas context drawing
    widthInput.value = parseInt(widthInput.dataset.default); let widthSet = `${widthInput.value}%`;   // default width setting
    let imageUploaded = false;  // flag for referring if image uploaded or not
    let fileType = ""; let imageFormat = "";  // store the uploaded type file / image provided in FileReader.result of method readAsDataURL
    let windowWidth = window.innerWidth; let windowHeight = window.innerHeight;  // WxH of the page
    let imageRefreshed = false;  // flag preventing calling functions associated with the tracking of the uploaded image
    uploadButton.value = "";  // put default "No file selected" to the input button
    // Styling constants, needed for setting them after uploading / clearing the image
    const contentTopMarginInit = pageContent.style.marginTop; const instructionsTopMarginInit = instructionsHeaderBox.style.topMargin;
    const topMarginInitUplBox = uploadImageContainer.style.marginTop;
    const topMargin = "0.25em";  // uniform top margin setting
    const headerBottomMargin = "0.75em"; const headerBottomMarginInit = pageHeader.style.marginBottom;
    // Flags for designating across all functions user actions
    let imageModified = false;  // track that the image has been modified and activate Download button for the modified images only
    let grayScaleImageLoaded = false;  // tracks that the gray-scaled or color image has been uploaded 
    let defaultDisplayStyle;  // records initial display styling for input control boxes for restoring if color image has been uploaded
    let flagSwitchImages = false;  // for tracking the clicks on the image for switching original / processed
    let selectedSliders = true;  // flag if the sliders are selected as the input for the image processing options
    sliderSelector.checked = "true";  // set default radio button (otherwise, remain switched after reloading)

    // Add event listener to the event, when the file provided through the <input type="file"> button
    uploadButton.addEventListener("change", () => {
        readerImg.readAsDataURL(uploadButton.files[0]); // will evoke in the end of loading file "load" event (function below)
    });

    // Event listener that reacts to finished loaded event from above (readerImg.readAsDataURL(...))
    readerImg.addEventListener("load", () => {
        // Set filters to the default values if the image re-uploaded
        if (imageUploaded) makeAllFiltersDefault();
        // Below - default values for the case that image not uploaded - before it will be confirmed that actually the image has been uploaded
        imageUploaded = false; widthInput.disabled = true; blurInput.disabled = true; brightnessInput.disabled = true;
        saturateInput.disabled = true; grayscaleInput.disable = true; huerotateInput.disable = true;
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
                    // note of usage below of naturalWidth and naturalHeight - original image properties
                    console.log(`Image WxH: ${imgElement.naturalWidth}x${imgElement.naturalHeight}. Document WxH: ${windowWidth}x${windowHeight}`);
                    // If new image uploaded, change width control to the default one and compare with the default percentage of the page width = 55%
                    widthInput.value = parseInt(widthInput.dataset.default); widthSet = `${widthInput.value}%`;

                    // Set now styling for restrict image sizes, taking into account the window properties. For it, recalculate width set in % of the window width
                    const maxWidthCtrl = parseInt(maxTickImgWidth.value)
                    // the image is much smaller then the default % of window, it prevents expanding small images
                    if (imgElement.naturalWidth < (widthInput.value/maxWidthCtrl)*windowWidth) {
                        widthInput.value = Math.round(maxWidthCtrl*(imgElement.naturalWidth/windowWidth)); widthSet = `${widthInput.value}%`;
                    } else if (imgElement.naturalWidth > windowWidth) {  // if image has width larger then the window size, just set it to the window size
                        widthInput.value = maxWidthCtrl; widthSet = `${widthInput.value}%`;
                        // If the width of an image is larger than the available width of a page (device specific), set ticks and available width control to min 50%
                        widthInput.min = "50"; minTickImgWidth.value="50"; minTickImgWidth.label="50";
                    }

                    imageClass.src = readerImg.result;  // transfer loaded image to the Image class and can be bound with the "load" event below
                    imageModified = false; downloadBtn.disabled = true;  // allow only downloading of the modified image

                    // Draw image on the <canvas> element, !!!: evoked by the call imageClass.src = readerImg.result
                    imageClass.onload = () => {
                        contextCanvas.drawImage(imageClass, 0, 0);  // 0, 0 - coordinates should be provided, it's origin of drawing. This function draws a raster image on canvas
                        canvas.style.width = widthSet; canvas.style.height = "auto";  // same styling of width / height as for <img> element
                        // check that it was normal image (width and height more than 1 pixel)
                        if ((Number.parseInt(imgElement.naturalWidth) > 1) && (Number.parseInt(imgElement.naturalHeight) > 1)){
                            changePropsImgUploaded();  // centrally changing of flags and elements content by calling a function
                            checkImageGray();  // check if the uploaded image is gray-scaled or color (different values in RGB channels)
                            changePageStyleImgUploaded();  // change style of elements to show loaded image
                        } else {
                            window.alert("The uploaded image width and / or height isn't more than 1 pixel, it will be ignored!");
                        }
                    }
                }
            } else {
                window.alert(`Uploaded image with format "${imageFormat}" not supported. Please upload jpeg/jpg, png or bmp image`);
                clearImage();
            }
        } else {
            clearImage();
        }
    });

    // Listen to any change on the page of the width input (slider)
    widthInput.addEventListener("change", () => {
        if (imageUploaded){
            widthSet = `${widthInput.value}%`; canvas.style.width = widthSet;
        }
    });

    // Compose inner HTML for indicating selected value by inputs
    function getInnerHTML(element){
        let unit = ''; 
        switch (element.name){
            case "blur":
                unit = 'px'; break;
            case "brightness":
            case "saturate":
            case "contrast":
            case "grayscale":
                unit = '%'; break;
            case "hue-rotate":
                unit = 'deg'; break;
            default:
                unit = ''; break; 
        }
        return `<strong class="horizontal-element"> ${element.value} ${unit} </strong> - applied ${element.name}`;
    }

    // Blurring image if the blur control changed
    blurInput.addEventListener("change", ()=>{
        if (imageUploaded){
            // blurPixelValue = `${blurInput.value}px`;  // convert from pure number to the Number px value accepted by filters
            // imgElement.style.filter = `blur(${blurPixelValue})`;  // apply blurring to the <img> element  - was used for tests, 
            // where comparison of filter effect on <img> and <canvas> elements was performed
            blurValue.innerHTML = getInnerHTML(blurInput);
            imageModified = parseFloat(blurInput.value) > parseFloat(blurInput.dataset.default);  // track that the image modified for enabling download button
            applyAllFilters();  // applying all selected filters at once
        }
    });

    // Change brightness of an image
    brightnessInput.addEventListener("change", () => {
        if (imageUploaded){
            brightnessValue.innerHTML = getInnerHTML(brightnessInput);  // show the selected value by modifying inner HTML
            imageModified = parseInt(brightnessInput.value) !== parseInt(brightnessInput.dataset.default);  // track that the image modified for enabling download button
            applyAllFilters();  // applying all selected filters at once
        }
    });

    // Change contrast of an image
    contrastInput.addEventListener("change", () => {
        if (imageUploaded){
            contrastValue.innerHTML = getInnerHTML(contrastInput);  // show the selected value by modifying inner HTML
            imageModified = parseInt(contrastInput.value) !== parseInt(contrastInput.dataset.default);  // track that the image modified for enabling download button
            applyAllFilters();  // applying all selected filters at once
        }
    });

    // Input with Saturation changed handle
    saturateInput.addEventListener("change", () => {
        if (imageUploaded){
            saturateValue.innerHTML = getInnerHTML(saturateInput);  // show the selected value by modifying inner HTML
            imageModified = parseInt(saturateInput.value) !== parseInt(saturateInput.dataset.default);  // track that the image modified for enabling download button
            applyAllFilters();  // applying all selected filters at once
        }
    });

    // Input with Grayscale changed handle
    grayscaleInput.addEventListener('change', () => {
        if (imageUploaded){
            grayscaleValue.innerHTML = getInnerHTML(grayscaleInput);  // show the selected value by modifying inner HTML
            imageModified = parseInt(grayscaleInput.value) !== parseInt(grayscaleInput.dataset.default);  // track that the image modified for enabling download button
            applyAllFilters();  // applying all selected filters at once
        }
    });

    // Input with Hue-rotate changed handle
    huerotateInput.addEventListener('change', () => {
        if (imageUploaded){
            huerotateValue.innerHTML = getInnerHTML(huerotateInput);  // show the selected value by modifying inner HTML
            imageModified = parseInt(huerotateInput.value) !== parseInt(huerotateInput.dataset.default);  // track that the image modified for enabling download button
            applyAllFilters();  // applying all selected filters at once
        }
    });

    // Assign only the default blur value = 0.0
    function zeroBlurInput(){
        blurInput.value = parseFloat(blurInput.dataset.default); blurValue.innerHTML = getInnerHTML(blurInput);
    }

    // Make brightness input element default = 100%
    function makeDefaultBrightnessInput(){
        brightnessInput.value = parseInt(brightnessInput.dataset.default); brightnessValue.innerHTML = getInnerHTML(brightnessInput);
    }

    // Make contrast input element default = 100%
    function makeDefaultContrastInput(){
        contrastInput.value = parseInt(contrastInput.dataset.default); contrastValue.innerHTML = getInnerHTML(contrastInput);
    }

    // Make saturate input element default = 100%
    function makeDefaultSaturateInput(){
        saturateInput.value = parseInt(saturateInput.dataset.default); saturateValue.innerHTML = getInnerHTML(saturateInput);
    }

    // Make grayscale input element default = 0%
    function makeDefaultGrayscaleInput(){
        grayscaleInput.value = parseInt(grayscaleInput.dataset.default); grayscaleValue.innerHTML = getInnerHTML(grayscaleInput);
    }

    // Make hue-rotate input element default = 0deg
    function makeDefaultHueRotateInput(){
        huerotateInput.value = parseInt(huerotateInput.dataset.default); huerotateValue.innerHTML = getInnerHTML(huerotateInput);
    }

    function makeAllFiltersDefault(){
        if (blurInput.value > parseFloat(blurInput.dataset.default)) zeroBlurInput(); 
        if (brightnessInput.value != parseInt(brightnessInput.dataset.default)) makeDefaultBrightnessInput();
        if (contrastInput.value != parseInt(contrastInput.dataset.default)) makeDefaultContrastInput();
        if (saturateInput.value != parseInt(saturateInput.dataset.default)) makeDefaultSaturateInput(); 
        if (grayscaleInput.value != parseInt(grayscaleInput.dataset.default)) makeDefaultGrayscaleInput();
        if (huerotateInput.value != parseInt(huerotateInput.dataset.default)) makeDefaultHueRotateInput(); 
    }

    // Apply all implemented filters at once, and before it redraw the original image
    function applyAllFilters(){
        // Refresh the image for applying all filters to the original image instead of the already modified one
        imageRefreshed = true;  // for preventing associated functions changeProps...() to run
        imageClass.src = readerImg.result; contextCanvas.drawImage(imageClass, 0, 0);  // refresh image for applying again the filter
        // Apply the filters by assigning it to the properties of the context of the canvas
        // Note that applying filter to contextCanvas changes the content of the image data, which could be downloaded later, 
        // in comparison to applying them to the <image> element.
        // canvas.style.filter = `blur(${blurPixelValue})`;  // non-destructive applying of the filter, not changing the image content
        // Reference: https://www.bit-101.com/blog/2021/07/new-html-canvas-stuff-filters/
        // Below - apply all implemented filters by specifying all them as the string for HTML element property
        contextCanvas.filter = `brightness(${brightnessInput.value}%) contrast(${contrastInput.value}%) saturate(${saturateInput.value}%)
        grayscale(${grayscaleInput.value}%) hue-rotate(${huerotateInput.value}deg) blur(${blurInput.value}px)`;  
        contextCanvas.drawImage(imageClass, 0, 0);  // update image shown on the canvas element
        downloadBtn.disabled = !imageModified  // enable Download button
    }

    // Change properties of page elements if the image was successfully uploaded to the browser
    function changePropsImgUploaded() {
        if (!imageRefreshed){
            // Enable all inputs if only the uploaded file acknowledged as an image
            imageUploaded = true; widthInput.disabled = false; blurInput.disabled = false; brightnessInput.disabled = false;
            contrastInput.disabled = false; saturateInput.disabled = false; grayscaleInput.disabled = false; huerotateInput.disabled = false;
            infoPoint1.innerText = "Process image by dragging the sliders below + Adjust its width for checking any small details on it";
            infoPoint2.innerText = "Download the processed image if it is useful. Click on the processed image to switch between it and original one";
            // Composing the information with the file name and the successful status of uploading
            uploadInfoStr.innerHTML = ""; uploadInfoStr.innerHTML += '<span style="color: green;"> Image uploaded. </span>'; 
            if (windowWidth > 640) {
                uploadInfoStr.innerHTML +=  `File name:<em>${uploadButton.files[0].name}.</em>`;  // Add the file name only for wide screens
            }
            uploadInfoStr.innerHTML += ' Upload new image:';
        }  // change the "imageRefreshed" flag shifted to the function 'changePageStyleImgUploaded', because it's called after this function
    }

    // Change styling after uploading image on the page, note that display: none -> display: ... - enough along with previously specified properties
    function changePageStyleImgUploaded(){
        if (!imageRefreshed){
            // imgElement.style.display = "block";   // Display the <image> element on the page. If commented out, the entire element won't be displayed
            pageContent.style.marginTop = topMargin; pageHeader.style.marginTop = topMargin; pageHeader.style.marginBottom = headerBottomMargin; 
            infoContainer.style.marginTop = topMargin; uploadImageContainer.style.marginTop = topMargin; 
            uploadImageContainer.style.fontWeight = "normal"; uploadImageContainer.style.marginBottom = topMargin; 
            uploadButton.style.width = "9.5em";  // cut out the file name string associated with the upload button
            uploadButton.style.border = "none"  // removes the default blue 1px border
            imageControlsBox.style.display = "flex";  // automatically show the uploaded image, width input, download button
            processingCtrlBox.style.display = "flex";  // This is enough, since other properties already specified in the *css file
            footerElement.style.marginTop = "0.5em";  // shift footer closer to the image / content of a page
            imageCtrlsBox.style.display = "flex"; 
        } else {
            imageRefreshed = false;  // set again the flag to the default value, this flag preventing calling this and function above
        }
    }

    // Remove previously uploaded image from the <canvas> element, hide the image processing controls. This function is also invoked when no image uploaded.
    function clearImage(){
        if (!imageUploaded){
            contextCanvas.clearRect(0, 0, canvas.width, canvas.height); imgElement.src = ""; 
            uploadInfoStr.innerHTML = '<span style="color: red;">Image not uploaded!</span> Upload new image:';
            setDefaultStyles(); 
        }
    }

    // Clear the uploaded image and its container
    clearImageButton.addEventListener('click', () =>{
        if (imageUploaded){
            makeAllFiltersDefault();  // return all inputs to the default values
            imageUploaded = false; uploadInfoStr.innerHTML = '<span style="color: darkorange;">Image has been cleared.</span> Upload new image:';
            contextCanvas.clearRect(0, 0, canvas.width, canvas.height); imgElement.src = "";
            setDefaultStyles();
        }
    });

    // Return styles of elements if the image has been cleared or not uploaded
    function setDefaultStyles(){
        // Specifying below default styling if the image haven't been uploaded, hide buttons / elements
        instructionsHeaderBox.marginTop = instructionsTopMarginInit; uploadImageContainer.style.marginTop = topMarginInitUplBox;
        pageHeader.style.marginBottom = headerBottomMarginInit; pageContent.style.marginTop = contentTopMarginInit;
        imageControlsBox.style.display = "none"; processingCtrlBox.style.display = "none";
        imageCtrlsBox.style.display = "none"; 
        footerElement.style.marginTop = "30vh";  // shift footer again to the bottom
    }

    // Function for downloading processed image
    downloadBtn.addEventListener("click", (event) => {
        if (imageUploaded){
            // If the original image is shown, 1st - call back application of all selected filters for saving the processed image
            if (flagSwitchImages) {
                applyAllFilters(); flagSwitchImages = false;
            }
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

    // Resetting all applied filters by clicking the button
    resetButton.addEventListener("click", () => {
        imageModified = false; downloadBtn.disabled = true; makeAllFiltersDefault(); applyAllFilters(); 
    });

    // Check that pixels in the uploaded image gray-scaled or colored
    function checkImageGray(){
        if (!imageRefreshed){
            // hint from: https://www.qoncious.com/questions/how-load-image-html5-canvas-and-do-pixel-manipulation
            let rawPixels = contextCanvas.getImageData(0, 0, imgElement.naturalWidth, imgElement.naturalHeight).data; 
            grayScaleImageLoaded = true;  // if all pixels are equal in all 3 RGB channels, then the uploaded image is gray-scaled
            for (let i = 0; i < rawPixels.length; i+=4){
                // Store all channels from RGBA scheme below for checking if they correspond to gray-scale transform
                let red = rawPixels[i]; let green = rawPixels[i+1]; let blue = rawPixels[i+2];
                // For more equations about RGB to Gray image conversion: https://openaccess.thecvf.com/content_cvpr_2017/papers/Nguyen_Why_You_Should_CVPR_2017_paper.pdf
                if ((red !== green) && (red !== blue) && (green !== blue)){
                    // The uploaded image is not gray-scaled, since the RGB channel values not equal
                    grayScaleImageLoaded = false; break;
                }
            }
            // If the uploaded image already is already gray-scaled, some filters have no effect and will be deleted from the displaying
            if (grayScaleImageLoaded){
                defaultDisplayStyle = saturateCtrlBox.style.display;
                saturateCtrlBox.style.display = "none"; grayscaleCtrlBox.style.display = "none"; huerotateCtrlBox.style.display = "none";
            } else {
                // Recover controlling input boxes if the color image has been uploaded after gray-scaled one
                if (!(defaultDisplayStyle === undefined)){
                    saturateCtrlBox.style.display = defaultDisplayStyle; grayscaleCtrlBox.style.display = defaultDisplayStyle;
                    huerotateCtrlBox.style.display = defaultDisplayStyle;
                }
            }
            console.log(`Image uploaded and it is : ${grayScaleImageLoaded? "Gray-scaled" : "Colorful"}`);  // checking the result
        }
    }

    // Associate clicks on the image (<canvas> element) and swap original and processed images
    canvas.addEventListener("click", () => {
        flagSwitchImages = !flagSwitchImages;  // switch internal flag
        if (flagSwitchImages){
            imageRefreshed = true;  // for preventing associated functions changeProps...() to run
            imageClass.src = readerImg.result; // contextCanvas.drawImage(imageClass, 0, 0);  // refresh image for applying again the filter
            contextCanvas.filter = 'blur(0px)';  // show the original image
            contextCanvas.drawImage(imageClass, 0, 0);  // refresh image for applying again the filter
        } else {
            applyAllFilters();  // show the processed image
        }
    });
    
    // Function for changing the representation of input from slider to numerical one
    function changeInputsAppearance() {
        if (selectedSliders) {
            // To manipulate styling, remove specific for number input CSS class and add specific for range input CSS class
            for (let input of inputElements) {
                input.type = "range"; input.classList.remove('parameter-number-input'); input.classList.add('parameter-range-input');
            }
            for (let label of inputLabels) {
                label.classList.remove("value-label-hide"); label.classList.add("value-label-ranges");
            }
        } else {
            for (let input of inputElements) {
                input.type = "number"; input.classList.remove('parameter-range-input'); input.classList.add('parameter-number-input');
            }
            for (let label of inputLabels) {
                label.classList.remove("value-label-ranges"); label.classList.add("value-label-hide");
            }
        }
    }

    // Selection between 2 options on the radio box (inputs as sliders or numerical inputs)
    radioBox.addEventListener("change", (e) => {
        // console.log(e.target); 
        if (e.target.id == "sliders-selector1") {
            selectedSliders = true; 
        } else {
            selectedSliders = false; 
        } 
        changeInputsAppearance();  // call for changing <input> from range to number and back
    }); 
});
