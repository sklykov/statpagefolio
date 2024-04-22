import "./NavBar.css"; 
import { useState } from "react";
import StyleSwitcher from "./StyleSwitcher"; 

const date = new Date(); const year = date.getFullYear();  // get the actual year

// Display info after clicking the button in the component below
function DisplayInfo(){
    window.alert(`Language Quiz created using ReactJS. Author: S.K., license: MIT, Year: ${year}`); 
}

// The stateless component
export default function NavBar() {
    const [styleSymbol, setStyleSymbol] = useState('\u263C');  // can be changed by the Ref in the function?
    return (
        <nav className="navbar">
            <div> Quiz implemented in ReactJS </div>
            <button type="button" className="about-button" onClick={DisplayInfo}> About </button> 
            <StyleSwitcher styleSymbol={styleSymbol} setStyleSymbol={setStyleSymbol} />
        </nav>
        );
}
