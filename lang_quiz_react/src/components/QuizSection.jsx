// Imports
import StartQuiz from "./StartQuiz";
import { useState } from "react";

// Component specification
export default function QuizSection(props) {
  const [quizStarted, setQuizStart] = useState(props.quizStarted); // will be set by the buttons below
  const [chosenQuizType, setQuizType] = useState("NONE"); // selected type of quiz

  // Dynamic returning of components - depending on the state quiz: started or ended
  if (!quizStarted) {
    // Returning couple of buttons to start different quiz types
    return (
      <section>
        <StartQuiz
          quizStarted={quizStarted}
          setQuizStart={setQuizStart}
          chosenQuizType={chosenQuizType}
          setQuizType={setQuizType}
        >
          Flipping Cards
        </StartQuiz>
        <StartQuiz
          quizStarted={quizStarted}
          setQuizStart={setQuizStart}
          chosenQuizType={chosenQuizType}
          setQuizType={setQuizType}
        >
          Variants
        </StartQuiz>
      </section>
    );
  } else {
    // Returning the quiz game field and ending button
    return (
      <section>
        <div> Placeholder for the started Quiz. Here is the game! </div>
        <StartQuiz
          quizStarted={quizStarted}
          setQuizStart={setQuizStart}
          chosenQuizType={chosenQuizType}
          setQuizType={setQuizType}
        >
          Actual Quiz
        </StartQuiz>
      </section>
    );
  }
}
