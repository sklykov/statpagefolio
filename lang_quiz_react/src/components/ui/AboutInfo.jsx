import styles from './AboutInfo.module.css';
import { ThemeContext } from '../../store/ThemeContextProvider';
import { useContext, forwardRef } from 'react';

const date = new Date(); const year = date.getFullYear();  // get the actual year

const AboutInfo = forwardRef(function AboutInfo({opened}, ref) {
  const {theme} = useContext(ThemeContext);  // get the selected theme: dark or light
  let selectedThemedStyle = styles.aboutWindowDark;
  if (theme !== 'dark') {
    selectedThemedStyle = styles.aboutWindowLight;
  }

  return (
    <dialog open={opened} ref={ref} className={selectedThemedStyle}>
      <h3> Information about this project </h3> 
      <p> "Language Quiz created using ReactJS. Author: S.K., license: MIT, Year: "{year}</p>
    </dialog>
  );
});

export default AboutInfo;
