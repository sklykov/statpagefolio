import { useEffect, useState } from 'react';
import styles from './NounArticleQuiz.module.css';
import { getNounsSlice } from '../quiz_data/Nouns.js';

let variants = ["der", "die", "das"];   // 3 base articles - fixed answer variants

// Shuffle array function from the https://javascript.info/task/shuffle (Fisher-Yates shuffle algorithm)
// This function is used for shuffle the 3 variants of articles for answer variants
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Component function for the preparing quiz question about the article of the noun
export default function NounArticleQuiz({userInfo}) {
  let quizLength = 5;  // number of words for fetching and asking during the quiz

  const [quizGoing, setQuizState] = useState(true); 
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [indexQuestion, setCurrentIndexQuestion] = useState(0);
  const [quizNouns, setQuizNouns] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
 
  useEffect(() => {
    // Definition of the function for retrieving data from the simulated backend
    async function retrieveData() {
      console.log("Start Retrieving data...");
      try {
        const nouns = await getNounsSlice(quizLength, userInfo, []); 
        if (nouns.length > 0) {
          setQuizNouns(nouns);
        }
      } catch (error) {
        setQuizNouns([]); setErrorMessage(String(error)); 
      }
      console.log("Stop Retrieving data.");
    }
    retrieveData(); 
  }, [quizLength, userInfo]);
  
  // below - set the first question, performed when the quizNouns are changed
  useEffect(() => {
    if (quizNouns.length > 0) {
      setCurrentQuestion(quizNouns[0]); setCurrentIndexQuestion((prevIndex) => prevIndex + 1);
    }}, [quizNouns]);

  useEffect(() => {shuffle(variants)}, [currentQuestion]);  // shuffle the array if noun has been changed

  // Handle click on the variant of an answer
  function handleVariantSelection(e) {
    if (e.target.innerText === currentQuestion.article) {
      // TODO: add useReducer for saving the learnt words and managing the next quiz round
      console.log("Right answer!"); 
    } else {
      console.log("Wrong answer!");
    }
    if (indexQuestion < quizLength) {
      setCurrentQuestion(quizNouns[indexQuestion]);
      setCurrentIndexQuestion((prevIndex) => prevIndex + 1); 
    } else {
      setQuizState(false);
    }
  }

  // JSX forming conditionally
  return (
    <>
      {currentQuestion === null && quizGoing && (
        <div> Waiting for data coming from the mocked backend ... </div>
      )}
      {quizGoing && currentQuestion !== null && (
        <div className={styles.quizBox}>
          <div lang="de" className={styles.questionBox}>
            {" "}
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
      {!quizGoing && currentQuestion === null && (
        <div> Rejected with the message: {errorMessage} </div>
      )}
      {!quizGoing && (
        <p>
          <div> Quiz finished! </div>
          <button> Continue Quiz... </button>
        </p>
      )}
    </>
  );

}
