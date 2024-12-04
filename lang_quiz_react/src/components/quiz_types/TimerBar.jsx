import "./TimerBarStyles.css";

import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../store/ThemeContextProvider.jsx";

export default function TimerBar({ timeForAnswer, onTimeout }) {
  // Handle timer by using hooks
  let stepTimer = 0.02 * timeForAnswer; // 1% of the width - step for counting interval
  const [widthProgress, setWidthProgress] = useState(100);
  const [remainingTime, setRemainingTime] = useState(timeForAnswer);

  // console.log(`${widthProgress}%`, remainingTime, onTimeout);

  // Setting handle for timeout event - proceed to the next question on the parent component
  useEffect(() => {
    setTimeout(onTimeout, timeForAnswer);
  }, [timeForAnswer, onTimeout]);

  // Set the interval for reducing the remained time
  useEffect(() => {
    setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime - stepTimer >= 0) {
          setWidthProgress((prevProgress) => prevProgress - 2);
        }
        return prevTime - stepTimer;
      });
    }, stepTimer);
  }, [stepTimer]);

  let { theme } = useContext(ThemeContext);

  // CSS styles classes definition depending on the provided theme
  const outerDivStyles = `container-bar container-bar-${theme}`;
  const innerDivStyles = `timer-bar timer-bar-${theme}`;

  // Progress Bar simulation inspired by: https://stackoverflow.com/questions/7190898/progress-bar-with-html-and-css
  return (
    <div className={outerDivStyles}>
      <div
        style={{
          width: `${widthProgress}%`,
        }}
        className={innerDivStyles}
      >
        {" "}
      </div>
      <div> Remaining Time: {remainingTime} ms </div>
    </div>
  );
}
