// Imports
import StartQuiz from "./StartQuiz";
import QuizManager from "./quiz_types/QuizManager";

// Component specification
export default function QuizSection({quizState, setQuizState, userInfo}) {

  // TODO: add retrieving the variants if the quiz started or start managing some complex state by useReducer

  // Dynamic returning of components - depending on the state quiz: started or ended
  if (!quizState.started) {
    // Returning couple of buttons to start different quiz types
    return (
      <section>
        <StartQuiz
          quizState={quizState}
          setQuizState={setQuizState}
        >
          Flipping Cards
        </StartQuiz>
        <StartQuiz
          quizState={quizState}
          setQuizState={setQuizState}
        >
          Article for Noun
        </StartQuiz>
      </section>
    );
  } else {
    // Returning the quiz game field and the button for ending it
    return (
      <section>
        <QuizManager userInfo={userInfo} quizState={quizState} />
        <StartQuiz quizState={quizState} setQuizState={setQuizState} />
      </section>
    );
  }
}
