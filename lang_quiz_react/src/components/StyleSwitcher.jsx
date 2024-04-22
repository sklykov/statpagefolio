import { useContext } from 'react';
import './StyleSwitcher.css'; 
import { ThemeContext } from '../store/ThemeContextProvider';

// Style switcher made as the component based on the standard button
export default function StyleSwitcher(props) { 
    const context = useContext(ThemeContext);  // centrally managed theme switcher
    let themeName = context.theme === "light" ? "Dark" : "Light";

    // Passing inside the states from the parent Components
    const styleSymbol = props.styleSymbol; const setStyleSymbol = props.setStyleSymbol;

    // Style class specification for switching after clicking on button between CSS classes with postfixes  
    let cssStyleSymbol = `style-symbol style-symbol-${context.theme}`; 
    let buttonClassName = `style-switcher style-switcher-${context.theme}`;
    let symbolSwitchClass = `switch-symbol switch-symbol-${context.theme}`;

    console.log(symbolSwitchClass); 
    // Actual function handling clicking of the button
    const handleSwitch = () => {
        context.changeTheme();  // call of the function that changing the theme
        if (context.theme === "light") { 
            setStyleSymbol('\u263C'); 
        } else {
            setStyleSymbol('\u263D');
        }
    }

    return (
        <button className={buttonClassName} onClick={handleSwitch}>
            <span className={symbolSwitchClass}> &rArr; </span>
            <span className={cssStyleSymbol}> {styleSymbol} </span> 
            <span className="style-string"> {themeName + " Theme"} </span>  
        </button>
    );  
}
