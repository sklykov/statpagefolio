import styles from './AboutInfo.module.css';
import { ThemeContext } from '../../store/ThemeContextProvider';
import { useContext, forwardRef} from 'react';
import CloseInfoButton from './CloseInfoButton';

const date = new Date(); const year = date.getFullYear();  // get the actual year

// forwardRef is used for forwarding accepted ref React property for providing the access to the HTML element
const AboutInfo = forwardRef(function AboutInfo({openInfoWinFunction, openedInfo}, ref) {
  const {theme} = useContext(ThemeContext);  // get the selected theme: dark or light
  let selectedThemedStyle = styles.aboutWindowDark;  // default theme
  if (theme !== 'dark') {
    selectedThemedStyle = styles.aboutWindowLight;  // update theme, will be initialized if Context will be changed
  }

  function handleEscHit(event) {
    event.preventDefault();  // prevent default action, let the closing action specified in the App component to handle it
    openInfoWinFunction((prevState) => {
      return !prevState;
    });  // change the associated state for triggering useEffect hook for closing operation
  }

  return (
    <dialog open={openedInfo} ref={ref} className={selectedThemedStyle} onCancel={handleEscHit}>
      <div className={styles.aboutInfoWinBox}> 
        <h3> Information about this project </h3> 
        <p className={styles.paragraph}> Language Quiz created using React, ... (more to be used and listed)</p>
        <p className={styles.paragraph}> Author: S.K., (GitHub: 
          <a className={styles.link} href="https://github.com/sklykov" target="_blank">@sklykov</a>), 
          license: MIT, {year} </p>
        <CloseInfoButton dialogWin={ref} openInfoWindow={openInfoWinFunction} />
      </div>
    </dialog>
  );
});

export default AboutInfo;
