import "../../styles/NavBar.css"; 
import { useState, useContext } from "react";
import StyleSwitcher from "./StyleSwitcher"; 
import { ThemeContext } from '../../store/ThemeContextProvider';

const date = new Date(); const year = date.getFullYear();  // get the actual year

// Display info after clicking the button in the component below
function DisplayInfo(){
    window.alert(`Language Quiz created using ReactJS. Author: S.K., license: MIT, Year: ${year}`); 
}

// The stateless component
export default function NavBar() {
    const {theme} = useContext(ThemeContext); let navBarClass = `navbar navbar-${theme}`;  // Get current toggled mode
    const [styleSymbol, setStyleSymbol] = useState('\u263C');  // can be changed by the Ref in the function?
    return (
      <nav  className={navBarClass}>
        <div> Quiz implemented in ReactJS (serverless) </div>
        <button type="button" className="about-button" onClick={DisplayInfo}>
          {" "}
          About{" "}
        </button>
        <StyleSwitcher
          styleSymbol={styleSymbol}
          setStyleSymbol={setStyleSymbol}
        />
      </nav>
    );
}
