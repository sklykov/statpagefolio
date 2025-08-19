import "./TimerBarStyles.css";

import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../store/ThemeContextProvider.jsx";

export default function TimerBar({
  timeForAnswer,
  onTimeout,
  quizIsStillGoing,
  answered,
}) {
  // Handle timer by using hooks
  const defaultProgressWidth = 100;
  const stepTimer = 0.02 * timeForAnswer; // 2% of the width - step for counting interval
  const [widthProgress, setWidthProgress] = useState(defaultProgressWidth);
  const [remainingTime, setRemainingTime] = useState(timeForAnswer);

  // Setting handle for timeout event - proceed to the next question on the parent component
  useEffect(() => {
    const timeoutEvent = setTimeout(onTimeout, timeForAnswer);
    return () => clearTimeout(timeoutEvent); 
  }, [onTimeout, timeForAnswer]);

  // Set the interval for reducing the remained time
  useEffect(() => {
    // schedule callbacks with interval in ms
    if (!answered && quizIsStillGoing) {
      const countdownInterval = setInterval(() => {
        if (remainingTime - stepTimer >= 0 && quizIsStillGoing && !answered) {
          // change states of interval and state of a progress bar
          setRemainingTime((prevTime) => {
            setWidthProgress((prevProgress) => prevProgress - 2);
            return prevTime - stepTimer;
          });
        } else {
          clearInterval(countdownInterval); // clear interval task
          setRemainingTime(timeForAnswer); // getting back to the starting time
          setWidthProgress(defaultProgressWidth); // getting back full width of a progress bar
        }
      }, stepTimer);
      return () => clearInterval(countdownInterval); // clean up function in the end (e.g. if component is unmounted)
    }
  }, [remainingTime, stepTimer, timeForAnswer, quizIsStillGoing, answered]);

  let { theme } = useContext(ThemeContext);

  // CSS styles classes definition depending on the provided theme
  const outerDivStyles = `container-bar container-bar-${theme}`;
  const innerDivStyles = `timer-bar timer-bar-${theme}`;

  // Progress Bar simulation inspired by: https://stackoverflow.com/questions/7190898/progress-bar-with-html-and-css
  return (
    <section>
      <div className={outerDivStyles}>
        <div
          style={{
            width: `${widthProgress}%`,
          }}
          className={innerDivStyles}
        >
          {" "}
        </div>
      </div>
      <p> Remaining Time: {remainingTime} ms </p>
    </section>
  );
}
