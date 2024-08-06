import styles from './CloseInfoButton.module.css'; 
import { useContext } from 'react';
import { ThemeContext } from '../../store/ThemeContextProvider';

export default function CloseInfoButton({openInfoWindow, dialogWin}) {

    let {theme} = useContext(ThemeContext); 

    let selectedThemedStyle = styles.closeButtonDark;  // default theme
    if (theme !== 'dark') {
        selectedThemedStyle = styles.closeButtonLight;  // update theme, will be initialized if Context will be changed
    }

    // The function below is closing the opened AboutInfo <dialog> and changes its opened state to false + close opened modal
    function CloseInfo() {
        openInfoWindow((prevState) => {
          if (prevState) {
            if (dialogWin.current.open) {
                dialogWin.current.close();
            }
          }
          return !prevState;
        });
      }
    
    return (
        <button onClick={CloseInfo} className={selectedThemedStyle}> {"Close or press 'Esc'"} </button>
    ); 
}