// Imports
import StartQuiz from "./StartQuiz";
import QuizManager from "./quiz_types/QuizManager";
import styles from './QuizSection.module.css';

// Component specification
export default function QuizSection({quizState, setQuizState, userInfo, setLoginInfo}) {

  // Dynamic returning of components - depending on the state quiz: started or ended
  if (!quizState.started) {
    // Returning couple of buttons to start different quiz types
    return (
      <section>
        <StartQuiz
          quizState={quizState}
          setQuizState={setQuizState}
          setLoginInfo={setLoginInfo}
          userInfo={userInfo}
        >
          Flipping Cards
        </StartQuiz>
        <StartQuiz
          quizState={quizState}
          setQuizState={setQuizState}
          setLoginInfo={setLoginInfo}
          userInfo={userInfo}
        >
          Article for Noun
        </StartQuiz>
      </section>
    );
  } else {
    // Returning the quiz game field and the button for ending it
    return (
      <section className={styles.quizBox}>
        <QuizManager userInfo={userInfo} quizState={quizState} />
        <StartQuiz
          quizState={quizState}
          setQuizState={setQuizState}
          setLoginInfo={setLoginInfo}
          userInfo={userInfo}
        />
      </section>
    );
  }
}
