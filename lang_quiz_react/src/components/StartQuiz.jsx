import { useCallback, useContext, useEffect } from "react";
import { ThemeContext } from "../store/ThemeContextProvider";
import "../styles/StartQuiz.css";
import { authenticate } from "./quiz_data/Auth_mock.js";

// Component specification, automatically make it importable by the root components
export default function StartQuiz({
  quizState,
  setQuizState,
  children,
  setLoginInfo,
  userInfo,
}) {
  const { theme } = useContext(ThemeContext);

  // TODO: this wrapper doesn't solve a problem with the multiple recalls of the same chain of functions - FIX this!
  const updateLoginInfo = useCallback((authState, authStatus) => {
    setLoginInfo((prevState) => {
      if (prevState.authenticated !== authState || prevState.status !== authStatus) {
        let newState = { ...prevState };
        newState.authenticated = authState; newState.status = authStatus;
        return newState;
      }
    });
  }, [setLoginInfo]);

  // CSS styles switching depending on the selected theme type
  const cssClassStartBtn = `start-quiz-button start-quiz-button-${theme}`;
  const cssClassStopBtn = `stop-quiz-button stop-quiz-button-${theme}`;

  // Update complex quiz state - with flag for started quiz and its type
  const changeQuizState = () => {
    setQuizState((prevState) => {
      if (!prevState.started) {
        updateLoginInfo(false, "in progress...");
        return { started: true, quizType: children };
      } else {
        return { started: false, quizType: null };
      }
    });
  };

  // Add asynchronous call for for changing state and mocking some authentication happening on the server
  useEffect(() => {
    async function makeAuth() {
      let authenticated = false;
      try {
        authenticated = await authenticate(userInfo);
      } catch (error) {
        authenticated = false;
        updateLoginInfo(authenticated, String(error));
      }
      if (authenticated) {
        updateLoginInfo(authenticated, "ok");
      }
    }
    if (quizState.started && userInfo.status === "in progress...") {
      makeAuth(userInfo);
    }
  }, [quizState, userInfo, updateLoginInfo]);

  // Render button (Start / Stop Quiz) content depending on the state
  if (!quizState.started) {
    return (
      <button
        title={"Start the quiz"}
        onClick={changeQuizState}
        className={cssClassStartBtn}
      >
        Start {children}!
      </button>
    );
  } else {
    return (
      <button
        onClick={changeQuizState}
        className={cssClassStopBtn}
        title={"Stop the quiz"}
      >
        End {quizState.quizType}...
      </button>
    );
  }
}
