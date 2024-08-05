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

  return (
    <dialog open={openedInfo} ref={ref} className={selectedThemedStyle}>
      <div className={styles.aboutInfoWinBox}> 
        <h3> Information about this project </h3> 
        <p> Language Quiz created using ReactJS. Author: S.K., license: MIT, Year: {year} </p>
        <CloseInfoButton dialogWin={ref} openInfoWindow={openInfoWinFunction} />
      </div>
    </dialog>
  );
});

export default AboutInfo;
