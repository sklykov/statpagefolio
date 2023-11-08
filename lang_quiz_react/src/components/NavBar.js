import "./NavBar.css"; 
import { useState } from "react";
import StyleSwitcher from "./StyleSwitcher"; 

// Display info after clicking the button in the component below
function DisplayInfo(){
    window.alert("Language Quiz created using ReactJS. Author: S.K., license: MIT, Year: 2023"); 
}

// The stateless component
export default function NavBar(props) {
    const [styleSymbol, setStyleSymbol] = useState('\u263C');  // can be changed by the Ref in the function?
    return (
        <nav className="navbar">
            <div> Quiz implemented in ReactJS </div>
            <button type="button" className="about-button" onClick={DisplayInfo}> About </button> 
            <StyleSwitcher styleSymbol={styleSymbol} setStyleSymbol={setStyleSymbol} />
        </nav>
        );
}
