// Switcher of the state made by useState - for the reference
function ModeSwitch(props) {
    // Passing inside the states from the parent Components
    const mode = props.mode;  const setMode = props.setMode;
    const pickedStyle = props.pickedStyle; const setStyle = props.setStyle; 
    // Style class specification for switching after clicking  
    let buttonClassName = `mode-button mode-button-${pickedStyle}`;  // name of the class will be updated
    // Actual function handling clicking of the button
    const switchMode = () => {
        if (mode === "\u27F3 Light Theme") {
            setMode("\u27F3 Dark Theme");
        } else {
            setMode("\u27F3 Light Theme");
        }
        if (pickedStyle === "Default"){
            setStyle("Light"); 
        } else {
            setStyle("Default");
        }
    }
    return (
        <button className={buttonClassName} onClick={switchMode}> {mode} </button>
    ); 
}

export default ModeSwitch;