import { useState } from "react";
import ModeSwitch from "./ModeSwitch"; 

// Display info after clicking the button in the component below
function DisplayInfo(){
    window.alert("Language Quiz created using ReactJS. Author: S.K., license: MIT, Year: 2023"); 
}

// The stateless component
function Bar() {
    const [mode, setMode] = useState("Quiz");
    return (
        <nav className="navbar"> 
            <div> Quiz implemented in ReactJS </div>
            <button type="button" className="about-button" onClick={DisplayInfo}> About </button> 
            <ModeSwitch mode={mode} setMode={setMode}/>
        </nav>
        );
}

export default Bar;
