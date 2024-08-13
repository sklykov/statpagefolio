import "../../styles/NavBar.css"; 
import { useState, useContext} from "react";
import StyleSwitcher from "./StyleSwitcher"; 
import { ThemeContext } from '../../store/ThemeContextProvider';

export default function NavBar({openInfoWindow}) {
    const {theme} = useContext(ThemeContext); let navBarClass = `navbar navbar-${theme}`;  // Get current toggled mode
    const [styleSymbol, setStyleSymbol] = useState('\u263C');  // changing symbol for the theme button switcher

    // Handling the button click and changing the associated state onl, letting open / close <dialog> by useEffect hook
    function DisplayInfo() {
      openInfoWindow((prevState) => {
        return !prevState;
      });
    }
  
    return (
      <nav  className={navBarClass}>
        <span> Quiz implemented in React (serverless) </span>
        <button type="button" className="about-button" onClick={DisplayInfo}>
          About this Project
        </button>
        <StyleSwitcher
          styleSymbol={styleSymbol}
          setStyleSymbol={setStyleSymbol}
        />
      </nav>
    );
}
