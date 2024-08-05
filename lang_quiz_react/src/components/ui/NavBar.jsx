import "../../styles/NavBar.css"; 
import { useState, useContext} from "react";
import StyleSwitcher from "./StyleSwitcher"; 
import { ThemeContext } from '../../store/ThemeContextProvider';

export default function NavBar({openInfoWindow, dialogWin}) {
    const {theme} = useContext(ThemeContext); let navBarClass = `navbar navbar-${theme}`;  // Get current toggled mode
    const [styleSymbol, setStyleSymbol] = useState('\u263C');  // changing symbol for the theme button switcher

    // Display Information Window after clicking the button in the component below (on the navigation bar)
    function DisplayInfo() {
      openInfoWindow((prevState) => {
        if (!prevState) {
          dialogWin.current.showModal();  
        } else {
          if (dialogWin.current.open) {
            dialogWin.current.close(); 
          }
        }
        return !prevState;
      });
    }
  
    // Forbid closing by the clicking of the 'Esc' button on the keyboard
    if (dialogWin.current) {
      dialogWin.current.addEventListener('cancel', (e) => {
        e.preventDefault();
      }); 
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
