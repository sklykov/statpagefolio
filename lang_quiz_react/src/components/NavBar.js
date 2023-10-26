import "./NavBar.css"; 
import { useState } from "react";
import StyleSwitcher from "./StyleSwitcher"; 

// Display info after clicking the button in the component below
function DisplayInfo(){
    window.alert("Language Quiz created using ReactJS. Author: S.K., license: MIT, Year: 2023"); 
}

// The stateless component
export default function NavBar(props) {
    const [switchStyle, setSwitchStyle] = useState("Light");  // style text for the button
    const [styleSymbol, setStyleSymbol] = useState('\u263C');
    const pickedStyle = props.pickedStyle; const setStyle = props.setStyle;  // passing state from parent
    return (
        <nav className="navbar">
            <div> Quiz implemented in ReactJS </div>
            <button type="button" className="about-button" onClick={DisplayInfo}> About </button> 
            <StyleSwitcher switchStyle={switchStyle} setSwitchStyle={setSwitchStyle} pickedStyle={pickedStyle}
            setStyle={setStyle} styleSymbol={styleSymbol} setStyleSymbol={setStyleSymbol} />
        </nav>
        );
}
