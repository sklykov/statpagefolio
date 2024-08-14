import { useEffect } from 'react';
import styles from './NounArticleQuiz.module.css';

let variants = ["der", "die", "das"];   // 3 base articles - fixed answer variants

// Fetch the information for setting up the quiz
function fetchUserData(userCredentials) {
  // console.log("Logged in:", userCredentials);
  let data = null; 

  if (userCredentials.user === "demo") {
    data = {
      noun: "Heimat", article: "die",
    };
  }
  return data;
}

// Shuffle array function from the https://javascript.info/task/shuffle (Fisher-Yates shuffle algorithm)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Component function
export default function NounArticleQuiz({userInfo}) {

  let quizData = fetchUserData(userInfo); 

  useEffect(() => {shuffle(variants)}, [quizData.noun]);  // shuffle the array if noun has been changed

  // Handle click on the variant of an answer
  function handleVariantSelection(e) {
    if (e.target.innerText === quizData.article) {
      console.log("Right answer!"); 
    } else {
      console.log("Wrong answer!");
    }
  }

  // JSX forming
  if (quizData !== null) {
    return (
      <div className={styles.quizBox}>
        <div lang="de"> Select proper article for: <span className={styles.noun}>{quizData.noun}</span> </div>
        <ul className={styles.variantsBox}>
          {variants.map(variant => {
            // Note that always the HTML tags should be always returned to be rendered and displayed
            return (<li lang="de" key={variant} className={styles.variant} onClick={handleVariantSelection}>{variant}</li>);
          })}
        </ul>
      </div>
    ); 
  } else {
    return <div> User Not Found, cannot set up Quiz... </div>
  }
}
