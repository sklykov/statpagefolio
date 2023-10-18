import { useState } from "react";
import ModeSwitch from "./ModeSwitch"; 

// Display info after clicking the button in the component below
function DisplayInfo(){
    window.alert("Language Quiz created using ReactJS. Author: S.K., license: MIT, Year: 2023"); 
}

// The stateless component
function NavBar(props) {
    const [mode, setMode] = useState("\u27F3 Light Theme");   // state from this component
    const pickedStyle = props.pickedStyle; const setStyle = props.setStyle;  // passing state from parent
    return (
        <nav className="navbar"> 
            <div> Quiz implemented in ReactJS </div>
            <button type="button" className="about-button" onClick={DisplayInfo}> About </button> 
            <ModeSwitch mode={mode} setMode={setMode} pickedStyle={pickedStyle} setStyle={setStyle} />
        </nav>
        );
}

export default NavBar;
