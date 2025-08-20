import { useEffect, useState, useReducer } from "react";
import styles from "./NounArticleQuiz.module.css";
import { getNounsSlice } from "../quiz_data/Nouns.js";
import TimerBar from "./TimerBar.jsx";
import { useCallback } from "react";

let variants = ["der", "die", "das"]; // 3 base articles - fixed answer variants of articles for nouns

// Shuffle array function from the https://javascript.info/task/shuffle (Fisher-Yates shuffle algorithm)
// This function is used for shuffle the 3 variants of articles for answer variants
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Reducer function for updating provided by an user answers (# of right answers and # of scores)
function updateAnswers(answersState, invokedAction) {
  if (invokedAction.type === "answered") {
    return {
      rightAnswered: answersState.rightAnswered + 1,
      score: answersState.score + 1,
    };
  }
  if (invokedAction.type === "not answered") {
    return {
      ...answersState,
      score: answersState.score - 1,
    };
  }
}

// Component function for the preparing quiz question about the article of the noun
export default function NounArticleQuiz({ userInfo }) {
  let quizLength = 5; // number of words for fetching and asking during the quiz
  const timeForAnswerInMs = 8_000;  // in ms overall time for

  // Various states managed using the useState hook
  const [quizGoing, setQuizState] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [indexQuestion, setCurrentIndexQuestion] = useState(0);
  const [quizNouns, setQuizNouns] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [answerProvided, setAnswerProvided] = useState(false); 

  // Managing complex state (answers) by the useReducer hook
  const [answers, dispatchAnswers] = useReducer(updateAnswers, {
    rightAnswered: 0,
    score: 0,
  });

  // Definition of the function for retrieving data from the simulated backend
  useEffect(() => {
    let componentMounted = true;
    // because below is the async function used, it should be somehow cleaned up for preventing launching it again, 
    // if the component remounts
    async function retrieveData(quizLength, authenticated) {
      console.log("Start Retrieving data...");
      try {
        const nouns = await getNounsSlice(quizLength, authenticated, []);
        if (nouns.length > 0 && componentMounted) {
          setQuizNouns(nouns);
        }
      } catch (error) {
        setQuizNouns([]);
        setErrorMessage(String(error));
      }
      console.log("Data retrieving finished.");
    }
    // Retrieve data if only user was authenticated (simple flag is True)
    if (userInfo.authenticated) {
      retrieveData(quizLength, userInfo.authenticated);
    }
    return () => {componentMounted = false};   // manual clean up logic 
  }, [quizLength, userInfo]);

  // Set the first question (triggered by retrieved data), performed when the quizNouns state is changed
  useEffect(() => {
    if (quizNouns.length > 0) {
      setCurrentQuestion(quizNouns[0]); setCurrentIndexQuestion(0); 
    }
  }, [quizNouns]);
  
  // This effect is triggered then the currentQUestion set with the noun
  useEffect(() => {
    shuffle(variants);  // shuffle static array (from the top)
  }, [currentQuestion]);

  // Handle click on the variant of an answer
  function handleVariantSelection(e) {
    // Handle clicked variant or null if the timer is expired`
    setAnswerProvided(true); 
    if (e !== null) {
      if (e.target.innerText === currentQuestion.article) {
        // TODO: add useReducer for saving the learnt words and managing the next quiz round
        console.log("Right answer!");
        dispatchAnswers({type: "answered"}); // update associated with answer statistics object
      } else {
        console.log("Wrong answer!");
        dispatchAnswers({type: "not answered"}); // update associated with answer statistics object
      }
    }
    setAnswerProvided(false); 
    // Proceed to the next question
    moveToTheNextQuestion(indexQuestion, quizLength, quizNouns); 
  }

  // Handle proceeding to the next question
  function moveToTheNextQuestion(indexQuestion, quizLength, quizNouns) {
    console.log("Answered Question #:", indexQuestion+1);
    if (indexQuestion < quizLength-1) {
      setCurrentIndexQuestion((prevIndex) => { 
        setCurrentQuestion(quizNouns[prevIndex + 1]);
        return prevIndex + 1});
      console.log("Proceed to the next question");
    } else {
      setQuizState(false);
      console.log("Round finished");
    }
  }

  // Handle timeout event - hook useCallback wraps up the function that shouldn't cause any new re-rendering
  const handleTimeout = useCallback(() => {
    console.log("Not answered within time!");
    dispatchAnswers({type: "not answered"});
    moveToTheNextQuestion(indexQuestion, quizLength, quizNouns); 
  }, [indexQuestion, quizLength, quizNouns]);

  // JSX forming conditionally
  return (
    <>
      {currentQuestion === null && quizGoing && (
        // Placeholder for waiting till the data arrived, not observed in the local dev. server
        <div> Waiting for data coming from the mocked backend ... </div>
      )}

      {quizGoing && currentQuestion !== null && (
        // Quiz Box - the element for a question and answers + Remained Time indicator + Answers Statistics
        <div className={styles.quizBox}>
          <div className={styles.progressBox}>
            <div> Remained Time for Answer: </div>
            {/* Used tricks for TimerBar: 1) "key" changing refreshes the component + timer;
             2) useCallback prevents refresh of the component on each refresh of this component */}
            <TimerBar key={indexQuestion} onTimeout={handleTimeout} timeForAnswer={timeForAnswerInMs} 
              quizIsStillGoing = {quizGoing} answered = {answerProvided}/>
          </div>
          <div lang="de" className={styles.questionBox}>
            Select proper article for:{" "}
            <span className={styles.noun}>{currentQuestion.noun}</span>{" "}
          </div>
          <ul className={styles.variantsBox}>
            {variants.map((variant) => {
              // Note that always the HTML tags should be always returned to be rendered and displayed
              return (
                <li
                  lang="de"
                  key={variant}
                  className={styles.variant}
                  onClick={handleVariantSelection}
                >
                  {variant}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {indexQuestion >= 2 && (
        // Statistic with given answers
        <div className={styles.answersStatistic}>
          <p>Answers Statistics</p>
          <p>
            <span> Right Answers: {answers.rightAnswered},</span>
            <span> Scores: {answers.score}</span>
          </p>
        </div>
      )}

      {!quizGoing && currentQuestion === null && (
        // Handle of a reject message
        <div> Rejected with the message: {errorMessage} </div>
      )}

      {!quizGoing && (
        // End of the current Quiz - placeholder for quiz statistics and variant to continue
        <div>
          <div> Quiz finished! </div>
          <button> Continue Quiz... </button>
        </div>
      )}
    </>
  );
}
