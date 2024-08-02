import "../../styles/NavBar.css"; 
import { useState, useContext } from "react";
import StyleSwitcher from "./StyleSwitcher"; 
import { ThemeContext } from '../../store/ThemeContextProvider';

export default function NavBar({openInfoWindow}) {
    const {theme} = useContext(ThemeContext); let navBarClass = `navbar navbar-${theme}`;  // Get current toggled mode
    const [styleSymbol, setStyleSymbol] = useState('\u263C');  // can be changed by the Ref in the function?

    // Display info after clicking the button in the component below
  function DisplayInfo(){
    openInfoWindow((prevState) => !prevState);
  }

    return (
      <nav  className={navBarClass}>
        <div> Quiz implemented in ReactJS (serverless) </div>
        <button type="button" className="about-button" onClick={DisplayInfo}>
          About
        </button>
        <StyleSwitcher
          styleSymbol={styleSymbol}
          setStyleSymbol={setStyleSymbol}
        />
      </nav>
    );
}
