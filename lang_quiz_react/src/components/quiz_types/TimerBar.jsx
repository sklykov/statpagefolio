import './TimerBarStyles.css';

import { useContext } from 'react';
import { ThemeContext } from '../../store/ThemeContextProvider.jsx';

export default function TimerBar({ progress }) {
  let widthProgress = `${progress}%`;  // converting remaining time to color filling below by using child div width property

  let {theme} = useContext(ThemeContext);

  // CSS styles classes definition depending on the provided theme
  const outerDivStyles = `container-bar container-bar-${theme}`;
  const innerDivStyles = `timer-bar timer-bar-${theme}`;

  // Progress Bar simulation inspired by: https://stackoverflow.com/questions/7190898/progress-bar-with-html-and-css  
  return (
    <div
      className={outerDivStyles}
    >
      <div
        style={{
          width: widthProgress
        }}
        className={innerDivStyles}
      ></div>
    </div>
  );
}
