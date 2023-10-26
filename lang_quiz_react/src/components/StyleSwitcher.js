import './StyleSwitcher.css'; 

// Style switcher made as the component based on the standard button
export default function StyleSwitcher(props) { 
    // Passing inside the states from the parent Components
    const styleSymbol = props.styleSymbol; const setStyleSymbol = props.setStyleSymbol;
    const switchStyle = props.switchStyle;  const setSwitchStyle = props.setSwitchStyle;
    const pickedStyle = props.pickedStyle; const setStyle = props.setStyle;
    const cssStyleSymbol = `style-symbol style-symbol-${switchStyle}`; 
    // Style class specification for switching after clicking  
    let buttonClassName = `style-switcher style-switcher-${pickedStyle}`;  // name of the class will be updated
    // Actual function handling clicking of the button
    const handleSwitch = () => {
        if (switchStyle === "Light") {
            setSwitchStyle("Dark"); setStyleSymbol('\u263D');
            setStyle("Light");  // setting new style will cause re-rendering of the parent App
        } else {
            setStyleSymbol('\u263C'); setSwitchStyle("Light"); setStyle("Dark");
        }
    }
    return (
        <button className={buttonClassName} onClick={handleSwitch}>
            <span className={cssStyleSymbol}> {styleSymbol} </span> 
            <span className="style-string"> {switchStyle + " Theme"} </span>  
        </button>
    );  
}
